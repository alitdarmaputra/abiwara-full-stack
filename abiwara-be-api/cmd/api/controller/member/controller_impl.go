package member_controller

import (
	"context"
	"net/http"
	"strconv"

	member_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/member"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type MemberControllerImpl struct {
	MemberService member_service.MemberService
	Middleware    middleware.Authetication
}

func NewMemberController(
	memberService member_service.MemberService,
	middleware middleware.Authetication,
) MemberController {
	return &MemberControllerImpl{
		MemberService: memberService,
		Middleware:    middleware,
	}
}

func (controller *MemberControllerImpl) Register(ctx *gin.Context) {
	memberCreateRequest := request.MemberCreateRequest{}
	err := ctx.ShouldBindJSON(&memberCreateRequest)
	utils.PanicIfError(err)

	controller.MemberService.Create(ctx, memberCreateRequest)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *MemberControllerImpl) Update(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	memberUpdateRequest := request.MemberUpdateRequest{}
	err = ctx.ShouldBindJSON(&memberUpdateRequest)
	utils.PanicIfError(err)

	controller.MemberService.Update(ctx, memberUpdateRequest, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) Delete(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	param := request.PathParam{}
	err = ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.MemberService.Delete(ctx, param.Id, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) FindAll(ctx *gin.Context) {
	var page, perPage int
	var err error

	queryPage, ok := ctx.GetQuery("page")
	querySearch, _ := ctx.GetQuery("search")

	if !ok {
		page = 1
	} else {
		page, err = strconv.Atoi(queryPage)
		utils.PanicIfError(err)
	}

	queryPerPage, ok := ctx.GetQuery("per_page")

	if !ok {
		perPage = 10
	} else {
		perPage, err = strconv.Atoi(queryPerPage)
		utils.PanicIfError(err)
	}

	memberResponses, meta := controller.MemberService.FindAll(ctx, page, perPage, querySearch)
	response.JsonPageData(ctx, http.StatusOK, "OK", memberResponses, meta)
}

func (controller *MemberControllerImpl) GetProfile(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	memberResponse := controller.MemberService.FindById(ctx, claims.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", memberResponse)
}

func (controller *MemberControllerImpl) VerifyEmail(ctx *gin.Context) {
	param := request.VerificationParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.MemberService.VerifyEmail(ctx, param.VerificationCode)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) Login(ctx *gin.Context) {
	memberLoginRequest := request.MemberLoginRequest{}
	err := ctx.ShouldBindJSON(&memberLoginRequest)
	utils.PanicIfError(err)

	token := controller.MemberService.Login(ctx, memberLoginRequest)
	response.JsonBasicData(ctx, http.StatusOK, "OK", token.Token)
}

func (controller *MemberControllerImpl) ChangePassword(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	changePasswordRequest := request.ChangePasswordRequest{}
	err = ctx.ShouldBindJSON(&changePasswordRequest)
	utils.PanicIfError(err)

	controller.MemberService.ChangePassword(context.Background(), changePasswordRequest, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) ResetPassword(ctx *gin.Context) {
	resetTokenRequest := request.ResetTokenRequest{}
	err := ctx.ShouldBindJSON(&resetTokenRequest)
	utils.PanicIfError(err)

	controller.MemberService.SendResetToken(ctx, resetTokenRequest)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) ReedemResetToken(ctx *gin.Context) {
	reedemTokenRequest := request.RedeemTokenRequest{}
	err := ctx.ShouldBindJSON(&reedemTokenRequest)
	utils.PanicIfError(err)

	controller.MemberService.RedeemToken(ctx, reedemTokenRequest)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *MemberControllerImpl) GetTotal(ctx *gin.Context) {
	res := controller.MemberService.GetTotal(ctx)
	response.JsonBasicData(ctx, http.StatusOK, "OK", res)
}
