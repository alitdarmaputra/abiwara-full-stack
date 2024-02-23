package user_controller

import (
	"context"
	"net/http"
	"strconv"

	user_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/user"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type UserControllerImpl struct {
	UserService user_service.UserService
	Middleware  middleware.Authetication
}

func NewUserController(
	userService user_service.UserService,
	middleware middleware.Authetication,
) UserController {
	return &UserControllerImpl{
		UserService: userService,
		Middleware:  middleware,
	}
}

func (controller *UserControllerImpl) Register(ctx *gin.Context) {
	userCreateRequest := request.UserCreateRequest{}
	err := ctx.ShouldBindJSON(&userCreateRequest)
	utils.PanicIfError(err)

	controller.UserService.Create(ctx, userCreateRequest)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *UserControllerImpl) Update(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	userUpdateRequest := request.UserUpdateRequest{}
	err = ctx.ShouldBindJSON(&userUpdateRequest)
	utils.PanicIfError(err)

	controller.UserService.Update(ctx, userUpdateRequest, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) Delete(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	param := request.UserPathParam{}
	err = ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.UserService.Delete(ctx, param.Id, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) FindAll(ctx *gin.Context) {
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

	userResponses, meta := controller.UserService.FindAll(ctx, page, perPage, querySearch)
	response.JsonPageData(ctx, http.StatusOK, "OK", userResponses, meta)
}

func (controller *UserControllerImpl) GetProfile(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	userResponse := controller.UserService.FindById(ctx, claims.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", userResponse)
}

func (controller *UserControllerImpl) VerifyEmail(ctx *gin.Context) {
	param := request.VerificationParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.UserService.VerifyEmail(ctx, param.VerificationCode)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) Login(ctx *gin.Context) {
	userLoginRequest := request.UserLoginRequest{}
	err := ctx.ShouldBindJSON(&userLoginRequest)
	utils.PanicIfError(err)

	token := controller.UserService.Login(ctx, userLoginRequest)
	response.JsonBasicData(ctx, http.StatusOK, "OK", token.Token)
}

func (controller *UserControllerImpl) ChangePassword(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	changePasswordRequest := request.ChangePasswordRequest{}
	err = ctx.ShouldBindJSON(&changePasswordRequest)
	utils.PanicIfError(err)

	controller.UserService.ChangePassword(context.Background(), changePasswordRequest, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) ResetPassword(ctx *gin.Context) {
	resetTokenRequest := request.ResetTokenRequest{}
	err := ctx.ShouldBindJSON(&resetTokenRequest)
	utils.PanicIfError(err)

	controller.UserService.SendResetToken(ctx, resetTokenRequest)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) ReedemResetToken(ctx *gin.Context) {
	reedemTokenRequest := request.RedeemTokenRequest{}
	err := ctx.ShouldBindJSON(&reedemTokenRequest)
	utils.PanicIfError(err)

	controller.UserService.RedeemToken(ctx, reedemTokenRequest)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *UserControllerImpl) GetTotal(ctx *gin.Context) {
	res := controller.UserService.GetTotal(ctx)
	response.JsonBasicData(ctx, http.StatusOK, "OK", res)
}
