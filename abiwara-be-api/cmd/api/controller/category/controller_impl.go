package category_controller

import (
	"net/http"
	"strconv"

	category_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/category"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type CategoryControllerImpl struct {
	CategoryService category_service.CategoryService
}

func NewCategoryController(categoryService category_service.CategoryService) CategoryController {
	return &CategoryControllerImpl{
		CategoryService: categoryService,
	}
}

func (controller *CategoryControllerImpl) FindAll(ctx *gin.Context) {
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

	categoryResponses, meta := controller.CategoryService.FindAll(ctx, page, perPage, querySearch)
	response.JsonPageData(ctx, http.StatusOK, "OK", categoryResponses, meta)
}
