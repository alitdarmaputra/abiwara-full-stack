package book_controller

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	book_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type BookControllerImpl struct {
	BookService book_service.BookService
	Middleware  middleware.Authetication
}

func NewBookController(bookService book_service.BookService, middleware middleware.Authetication) BookController {
	return &BookControllerImpl{
		BookService: bookService,
		Middleware:  middleware,
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

	categories := []int{}

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

	var sort string = "updated_at"
	var order string = "desc"

	orderQuery, ok := ctx.GetQuery("order")
	if ok {
		order = orderQuery
	}

	sortQuery, ok := ctx.GetQuery("sort")
	if ok {
		if sortQuery == "updated_at" || sortQuery == "rating" || sortQuery == "title" || sortQuery == "author" || sortQuery == "id" || sortQuery == "created_at" {
			if sortQuery == "id" {
				sort = "ID"
			} else {
				sort = sortQuery
			}
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
		fmt.Sprintf("attachment;filename="+"daftar buku - "+time.Now().String()+".csv"),
	)
	wr := csv.NewWriter(ctx.Writer)
	if err := wr.WriteAll(bookData); err != nil {
		panic(err)
	}
}

func (controller *BookControllerImpl) GetBookRecommendation(ctx *gin.Context) {
	param := request.PathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	bookResponses := controller.BookService.GetBookRecommendation(ctx, param.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", bookResponses)
}

func (controller *BookControllerImpl) GetUserRecommendation(ctx *gin.Context) {
	var page int
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	queryPage, ok := ctx.GetQuery("page")

	if !ok {
		page = 1
	} else {
		page, err = strconv.Atoi(queryPage)
		utils.PanicIfError(err)
	}

	bookResponses, meta := controller.BookService.GetUserRecommendation(ctx, claims.Id, page)
	response.JsonPageData(ctx, http.StatusOK, "OK", bookResponses, meta)
}

func (controller *BookControllerImpl) BulkCreate(ctx *gin.Context) {
	fileHeader, _ := ctx.FormFile("file")

	if fileHeader.Size > (4 << 20) {
		response.JsonErrorResponse(ctx, http.StatusRequestEntityTooLarge, "Payload too large", strconv.FormatInt(fileHeader.Size, 10)+" size are exceed file size 4 mb")
		return
	}

	file, err := fileHeader.Open()
	utils.PanicIfError(err)
	defer file.Close()

	records, err := csv.NewReader(file).ReadAll()
	utils.PanicIfError(err)

	var books []book_repository.Book
	for i, record := range records {
		if i != 0 {
			var year int
			entryDate, err := time.Parse("02-01-2006", record[0])
			utils.PanicIfError(err)

			if record[6] != "" {
				year, err = strconv.Atoi(record[6])
				utils.PanicIfError(err)
			}

			quantity, err := strconv.Atoi(record[11])
			utils.PanicIfError(err)
			book := book_repository.Book{
				EntryDate:        &entryDate,
				InventoryNumber:  record[1],
				Author:           record[2],
				Title:            record[3],
				Publisher:        record[4],
				City:             record[5],
				Year:             &year,
				CategoryId:       record[7],
				CallNumberAuthor: record[8],
				CallNumberTitle:  record[9],
				Source:           record[10],
				Quantity:         quantity,
				Remain:           quantity,
				Status:           strings.ToLower(record[12]),
			}
			books = append(books, book)
		}
	}
	controller.BookService.BulkCreate(ctx, books)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *BookControllerImpl) BulkCreateFile(ctx *gin.Context) {
	data := [][]string{}
	data = append(data, []string{
		"Tanggal Masuk",
		"No Inventaris",
		"Penulis",
		"Judul Buku",
		"Penerbit",
		"Kota Terbit",
		"Tahun Terbit",
		"Klasifikasi",
		"Nomor Panggil Penulis",
		"Nomor Panggil Judul Buku",
		"Asal",
		"Eks",
		"Status",
	})

	data = append(data, []string{
		"31-01-2006",
		"No Inventaris",
		"Penulis",
		"Judul Buku",
		"Penerbit",
		"Kota Terbit",
		"2003",
		"000",
		"TES",
		"TES",
		"Asal",
		"5",
		"baik/tidak baik",
	})
	ctx.Header("Content-Type", "text/csv")
	ctx.Header(
		"Content-Disposition",
		fmt.Sprintf("attachment;filename=%s.csv", "contoh-format-bulk-create-buku"),
	)

	wr := csv.NewWriter(ctx.Writer)
	if err := wr.WriteAll(data); err != nil {
		panic(err)
	}
}
