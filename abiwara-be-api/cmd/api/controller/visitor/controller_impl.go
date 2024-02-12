package visitor_controller

import (
	"net/http"
	"strconv"
	"time"

	visitor_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type VisitorControllerImpl struct {
	VisitorService visitor_service.VisitorService
	Middleware     middleware.Authetication
}

func NewVisitorController(
	visitorService visitor_service.VisitorService,
	middleware middleware.Authetication,
) VisitorController {
	return &VisitorControllerImpl{
		VisitorService: visitorService,
		Middleware:     middleware,
	}
}

func (controller *VisitorControllerImpl) Create(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	visitorCreateRequest := request.VisitorCreateRequest{}
	err = ctx.ShouldBindJSON(&visitorCreateRequest)
	utils.PanicIfError(err)

	controller.VisitorService.Create(ctx, visitorCreateRequest, claims.Id)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *VisitorControllerImpl) FindAll(ctx *gin.Context) {
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

	visitorResponses, meta := controller.VisitorService.FindAll(
		ctx,
		page,
		perPage,
		querySearch,
		uint(claims.RoleId),
		uint(claims.Id),
	)
	response.JsonPageData(ctx, http.StatusOK, "OK", visitorResponses, meta)
}

func (controller *VisitorControllerImpl) GetTotal(ctx *gin.Context) {
	const dateFormat = "2006-01-02"
	var startDate, endDate time.Time
	var err error
	queryStartDate, ok := ctx.GetQuery("start_date")

	if !ok {
		startDate = time.Now().AddDate(0, 0, -7)
	} else {
		if startDate, err = time.Parse(dateFormat, queryStartDate); err != nil {
			response.JsonBasicResponse(ctx, http.StatusBadRequest, "Bad Request")
		}
	}

	queryEndDate, ok := ctx.GetQuery("end_date")

	if !ok {
		endDate = time.Now()
	} else {
		if endDate, err = time.Parse(dateFormat, queryEndDate); err != nil {
			response.JsonBasicResponse(ctx, http.StatusBadRequest, "Bad Request")
		}
	}

	totalVisitor := controller.VisitorService.GetTotal(ctx, startDate, endDate)

	response.JsonBasicData(ctx, http.StatusOK, "OK", totalVisitor)
}
