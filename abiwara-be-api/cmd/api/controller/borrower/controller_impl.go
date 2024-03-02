package borrower_controller

import (
	"net/http"
	"strconv"

	borrower_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/borrower"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type BorrowerControllerImpl struct {
	BorrowerService borrower_service.BorrowerService
	Middleware      middleware.Authetication
}

func NewBorrowerController(
	borrowerService borrower_service.BorrowerService,
	middleware middleware.Authetication,
) BorrowerController {
	return &BorrowerControllerImpl{
		BorrowerService: borrowerService,
		Middleware:      middleware,
	}
}

func (controller *BorrowerControllerImpl) Create(ctx *gin.Context) {
	borrowerCreateRequest := request.BorrowerCreateRequest{}
	err := ctx.ShouldBindJSON(&borrowerCreateRequest)
	utils.PanicIfError(err)

	controller.BorrowerService.Create(ctx, borrowerCreateRequest)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *BorrowerControllerImpl) Update(ctx *gin.Context) {
	param := request.PathParam{}

	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.BorrowerService.Update(ctx, param.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *BorrowerControllerImpl) FindAll(ctx *gin.Context) {
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

	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	var status *string
	queryStatus, ok := ctx.GetQuery("status")

	if ok {
		status = &queryStatus
	}

	borrowerResponses, meta := controller.BorrowerService.FindAll(
		ctx,
		page,
		perPage,
		querySearch,
		uint(claims.RoleId),
		claims.Id,
		status,
	)
	response.JsonPageData(ctx, http.StatusOK, "OK", borrowerResponses, meta)
}

func (controller *BorrowerControllerImpl) GetTotal(ctx *gin.Context) {
	res := controller.BorrowerService.GetTotal(ctx)
	response.JsonBasicData(ctx, http.StatusOK, "OK", res)
}
