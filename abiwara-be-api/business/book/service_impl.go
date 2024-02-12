package book_service

import (
	"context"
	"fmt"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type BookServiceImpl struct {
	BookRepository book_repository.BookRepository
	DB             *gorm.DB
}

func NewBookService(bookRepository book_repository.BookRepository, db *gorm.DB) BookService {
	return &BookServiceImpl{
		BookRepository: bookRepository,
		DB:             db,
	}
}

func (service *BookServiceImpl) Create(
	ctx context.Context,
	request request.BookCreateUpdateRequest,
) {
	book := book_repository.Book{
		Price:      request.Price,
		Title:      request.Title,
		Authors:    request.Authors,
		Publisher:  request.Publisher,
		Published:  request.Published,
		Quantity:   request.Quantity,
		Remain:     request.Quantity,
		Page:       request.Page,
		BuyDate:    request.BuyDate,
		Summary:    request.Summary,
		CategoryId: request.CategoryId,
	}

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	_, err := service.BookRepository.Save(ctx, tx, book)
	utils.PanicIfError(err)
}

func (service *BookServiceImpl) Update(
	ctx context.Context,
	request request.BookCreateUpdateRequest,
	bookId uint,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	book := book_repository.Book{}

	book, err := service.BookRepository.FindById(ctx, tx, bookId)
	utils.PanicIfError(err)

	book.Price = request.Price
	book.Title = request.Title
	book.Authors = request.Authors
	book.Publisher = request.Publisher
	book.Published = request.Published
	book.Page = request.Page
	book.BuyDate = request.BuyDate
	book.Summary = request.Summary
	book.CategoryId = request.CategoryId
	book.Category.ID = request.CategoryId

	_, err = service.BookRepository.Update(ctx, tx, book)
}

func (service *BookServiceImpl) Delete(ctx context.Context, bookId uint) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	err := service.BookRepository.Delete(ctx, tx, bookId)
	utils.PanicIfError(err)
}

func (service *BookServiceImpl) FindById(
	ctx context.Context,
	bookId uint,
) response.DetailBookResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	book, err := service.BookRepository.FindById(ctx, tx, bookId)
	utils.PanicIfError(err)

	return response.ToDetailBookResponse(book)
}

func (service *BookServiceImpl) FindAll(
	ctx context.Context,
	page int,
	perPage int,
	search string,
) ([]response.BookResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	books, total := service.BookRepository.FindAll(
		ctx,
		tx,
		utils.CountOffset(page, perPage),
		perPage,
		search,
	)

	return response.ToBookResponses(books), common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     total,
		TotalPage: utils.CountTotalPage(total, perPage),
	}
}

func (service *BookServiceImpl) GetFile(ctx context.Context) [][]string {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	books := service.BookRepository.FindAllWithoutParameter(ctx, tx)
	data := [][]string{}
	data = append(
		data,
		[]string{
			"ID",
			"Judul Buku",
			"Pengarang",
			"Penerbit",
			"Tahun Terbit",
			"Jumlah",
			"Tanggal Pembelian",
			"Kategori",
		},
	)

	for _, book := range books {
		data = append(
			data,
			[]string{
				fmt.Sprintf("%d", book.ID),
				string(book.Title),
				string(book.Authors),
				string(book.Publisher),
				fmt.Sprintf("%d", book.Published),
				fmt.Sprintf("%d", book.Quantity),
				book.BuyDate.String(),
				string(book.CategoryId),
			},
		)
	}

	return data
}
