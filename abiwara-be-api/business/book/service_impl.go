package book_service

import (
	"context"
	"fmt"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/recommender"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type BookServiceImpl struct {
	BookRepository book_repository.BookRepository
	DB             *gorm.DB
	Recommender    recommender.BookRecommender
}

func NewBookService(db *gorm.DB, recommender recommender.BookRecommender, bookRepository book_repository.BookRepository) BookService {
	return &BookServiceImpl{
		DB:             db,
		Recommender:    recommender,
		BookRepository: bookRepository,
	}
}

func (service *BookServiceImpl) Create(
	ctx context.Context,
	request request.BookCreateUpdateRequest,
) {
	book := book_repository.Book{
		CoverImg:         request.CoverImg,
		InventoryNumber:  request.InventoryNumber,
		Author:           request.Author,
		CallNumberAuthor: request.CallNumberAuthor,
		Title:            request.Title,
		CallNumberTitle:  request.CallNumberTitle,
		Price:            request.Price,
		Publisher:        request.Publisher,
		Year:             request.Year,
		City:             request.City,
		Quantity:         request.Quantity,
		Remain:           request.Quantity,
		TotalPage:        request.TotalPage,
		EntryDate:        request.EntryDate,
		FundingSource:    request.FundingSource,
		Status:           request.Status,
		Summary:          request.Summary,
		CategoryId:       request.CategoryId,
	}

	if book.CoverImg == "" {
		book.CoverImg = "https://ik.imagekit.io/pohfq3xvx/book-cover_7yiR3zQdQ.png?updatedAt=1708666722422"
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

	book.CoverImg = request.CoverImg
	book.InventoryNumber = request.InventoryNumber
	book.Author = request.Author
	book.CallNumberAuthor = request.CallNumberAuthor
	book.Title = request.Title
	book.CallNumberTitle = request.CallNumberTitle
	book.Publisher = request.Publisher
	book.Year = request.Year
	book.City = request.City
	book.Remain = book.Remain + (book.Quantity - request.Quantity)
	book.Quantity = request.Quantity
	book.Price = request.Price
	book.TotalPage = request.TotalPage
	book.EntryDate = request.EntryDate
	book.FundingSource = request.FundingSource
	book.Summary = request.Summary
	book.Status = request.Status
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
	categories []string,
	best bool,
	exist bool,
	search string,
	order string,
	sort string,
) ([]response.BookResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	books, total := service.BookRepository.FindAll(
		ctx,
		tx,
		utils.CountOffset(page, perPage),
		perPage,
		categories,
		best,
		exist,
		search,
		order,
		sort,
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
			"Id",
			"Tanggal Masuk",
			"No Inventaris",
			"Penyusun",
			"Judul Buku",
			"Penerbit",
			"Kota Terbit",
			"Tahun Terbit",
			"Call Number Klasifikasi",
			"Call Number Pengarang",
			"Call Number Klasifikasi Judul",
			"Subyek",
			"Asal",
			"Eks",
			"Status",
			"Tanggal Pembelian",
		},
	)

	for _, book := range books {
		data = append(
			data,
			[]string{
				fmt.Sprintf("%d", book.ID),
				book.EntryDate.String(),
				string(book.InventoryNumber),
				string(book.Author),
				string(book.Title),
				string(book.Publisher),
				string(book.City),
				fmt.Sprintf("%d", book.Year),
				string(book.CategoryId),
				string(book.CallNumberAuthor),
				string(book.CallNumberTitle),
				string(book.Category.Name),
				string(book.FundingSource),
				fmt.Sprintf("%d", book.Quantity),
				string(book.Status),
				book.EntryDate.String(),
			},
		)
	}

	return data
}

func (service *BookServiceImpl) GetRecommendation(ctx context.Context, bookId uint) []response.BookResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	recommenders := service.Recommender.Get(ctx, bookId)

	bookIds := []uint{}
	for _, recommender := range recommenders {
		// TODO: Filter by cosine distance
		bookIds = append(bookIds, recommender.BookId)
	}

	books := service.BookRepository.FindIn(ctx, tx, bookIds)

	return response.ToBookResponses(books)
}
