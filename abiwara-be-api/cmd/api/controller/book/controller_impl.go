package book_controller

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	book_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type BookControllerImpl struct {
	BookService book_service.BookService
}

func NewBookController(bookService book_service.BookService) BookController {
	return &BookControllerImpl{
		BookService: bookService,
	}
}

func (controller *BookControllerImpl) Create(ctx *gin.Context) {
	bookCreateRequest := request.BookCreateUpdateRequest{}
	err := ctx.ShouldBindJSON(&bookCreateRequest)
	utils.PanicIfError(err)

	controller.BookService.Create(ctx, bookCreateRequest)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *BookControllerImpl) Update(ctx *gin.Context) {
	param := request.PathParam{}

	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	bookUpdateRequest := request.BookCreateUpdateRequest{}
	err = ctx.ShouldBindJSON(&bookUpdateRequest)
	utils.PanicIfError(err)

	controller.BookService.Update(ctx, bookUpdateRequest, param.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *BookControllerImpl) Delete(ctx *gin.Context) {
	param := request.PathParam{}

	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.BookService.Delete(ctx, param.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}

func (controller *BookControllerImpl) FindAll(ctx *gin.Context) {
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

	categories := []string{}

	queryCategories, ok := ctx.GetQuery("categories")

	if ok {
		decodedCategories, err := url.QueryUnescape(queryCategories)
		utils.PanicIfError(err)

		err = json.Unmarshal([]byte(decodedCategories), &categories)
		utils.PanicIfError(err)
	}

	best := false
	_, ok = ctx.GetQuery("best")

	if ok {
		best = true
	}

	exist := false
	_, ok = ctx.GetQuery("exist")

	if ok {
		exist = true
	}

	var order string = "updated_at"
	var sort string = "desc"

	sortQuery, ok := ctx.GetQuery("sort")
	if ok {
		sort = sortQuery
	}

	orderQuery, ok := ctx.GetQuery("order")
	if ok {
		if orderQuery == "updated_at" || orderQuery == "rating" {
			order = orderQuery
		}
	}

	bookResponses, meta := controller.BookService.FindAll(ctx, page, perPage, categories, best, exist, querySearch, order, sort)
	response.JsonPageData(ctx, http.StatusOK, "OK", bookResponses, meta)
}

func (controller *BookControllerImpl) FindById(ctx *gin.Context) {
	param := request.PathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	bookResponse := controller.BookService.FindById(ctx, param.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", bookResponse)
}

func (controller *BookControllerImpl) GetFile(ctx *gin.Context) {
	bookData := controller.BookService.GetFile(ctx)
	ctx.Header("Content-Type", "text/csv")
	ctx.Header(
		"Content-Disposition",
		fmt.Sprintf("attachment;filename=%s.csv", "daftar buku - "+time.Now().Format("2006-01-02")),
	)

	wr := csv.NewWriter(ctx.Writer)
	if err := wr.WriteAll(bookData); err != nil {
		panic(err)
	}
}

func (controller *BookControllerImpl) GetRecommendation(ctx *gin.Context) {
	param := request.PathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	bookResponses := controller.BookService.GetRecommendation(ctx, param.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", bookResponses)
}
