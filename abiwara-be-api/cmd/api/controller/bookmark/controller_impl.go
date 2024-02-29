package bookmark_controller

import (
	"net/http"
	"strconv"

	bookmark_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/bookmark"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type BookmarkControllerImpl struct {
	BookmarkService bookmark_service.BookmarkService
	Middleware      middleware.Authetication
}

func NewBookmarkController(bookmarkService bookmark_service.BookmarkService, middleware middleware.Authetication) BookmarkController {
	return &BookmarkControllerImpl{
		BookmarkService: bookmarkService,
		Middleware:      middleware,
	}
}

func (controller *BookmarkControllerImpl) Create(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	bookmarkCreateRequest := request.BookmarkCreateRequest{}
	err = ctx.ShouldBindJSON(&bookmarkCreateRequest)
	utils.PanicIfError(err)

	bookmarkResponse := controller.BookmarkService.Create(ctx, bookmarkCreateRequest, claims.Id)
	response.JsonBasicData(ctx, http.StatusCreated, "Created", bookmarkResponse)
}

func (controller *BookmarkControllerImpl) Delete(ctx *gin.Context) {
	param := request.PathParam{}

	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.BookmarkService.Delete(ctx, param.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *BookmarkControllerImpl) FindAll(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	var page, perPage int

	queryPage, ok := ctx.GetQuery("page")
	querySearh, _ := ctx.GetQuery("search")

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

	bookmarkResponses, meta := controller.BookmarkService.FindAll(ctx, page, perPage, claims.Id, querySearh)
	response.JsonPageData(ctx, http.StatusOK, "OK", bookmarkResponses, meta)
}

func (controller *BookmarkControllerImpl) FindByBookId(ctx *gin.Context) {
	param := request.PathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	bookmarkResponse := controller.BookmarkService.FindByBookId(ctx, claims.Id, param.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", bookmarkResponse)
}
