package borrower_service

import (
	"context"
	"database/sql"
	"time"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type BorrowerServiceImpl struct {
	DB                 *gorm.DB
	BorrowerRepository borrower_repository.BorrowerRepository
	BookRepository     book_repository.BookRepository
	RatingRepository   rating_repository.RatingRepository
}

func NewBorrowerService(
	borrowerRepository borrower_repository.BorrowerRepository,
	db *gorm.DB,
	bookRepository book_repository.BookRepository,
	ratingRepository rating_repository.RatingRepository,
) BorrowerService {
	return &BorrowerServiceImpl{
		DB:                 db,
		BorrowerRepository: borrowerRepository,
		BookRepository:     bookRepository,
		RatingRepository:   ratingRepository,
	}
}

func (service *BorrowerServiceImpl) Create(
	ctx context.Context,
	request request.BorrowerCreateRequest,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	book, err := service.BookRepository.FindById(ctx, tx, request.BookId)
	utils.PanicIfError(err)

	if book.Remain < 1 {
		panic(business.NewBadRequestError("Tidak ada buku yang tersedia"))
	}

	rating, err := service.RatingRepository.SaveOrUpdate(ctx, tx, rating_repository.Rating{
		UserId: request.UserId,
		BookId: request.BookId,
		Rating: 0,
	})
	utils.PanicIfError(err)

	borrower := borrower_repository.Borrower{}
	borrower.UserId = request.UserId
	borrower.BookId = request.BookId
	borrower.Status = false
	borrower.DueDate = request.DueDate
	borrower.RatingId = rating.ID

	borrower, err = service.BorrowerRepository.Save(ctx, tx, borrower)
	utils.PanicIfError(err)

	book.Remain -= 1

	book, err = service.BookRepository.Update(ctx, tx, book)
	utils.PanicIfError(err)
}

func (service *BorrowerServiceImpl) FindAll(
	ctx context.Context,
	page, perPage int,
	querySearch string,
	roleId uint,
	userId string,
) ([]response.BorrowerResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	param := borrower_repository.Borrower{}
	borrowers := []borrower_repository.Borrower{}
	total := 0

	if roleId == 1 || roleId == 2 {
		borrowers, total = service.BorrowerRepository.FindAll(
			ctx,
			tx,
			utils.CountOffset(page, perPage),
			perPage,
			querySearch,
			param,
		)
	} else {
		param.UserId = userId
		borrowers, total = service.BorrowerRepository.FindAll(ctx, tx, utils.CountOffset(page, perPage), perPage, querySearch, param)
	}

	return response.ToBorrowerResponses(borrowers), common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     total,
		TotalPage: utils.CountTotalPage(total, perPage),
	}
}

func (service *BorrowerServiceImpl) Update(ctx context.Context, borrowerId uint) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	borrower, err := service.BorrowerRepository.FindById(ctx, tx, borrowerId)
	utils.PanicIfError(err)

	borrower.Status = true
	borrower.ReturnDate = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}

	borrower, err = service.BorrowerRepository.Update(ctx, tx, borrower)
	utils.PanicIfError(err)

	book, err := service.BookRepository.FindById(ctx, tx, borrower.BookId)
	utils.PanicIfError(err)

	book.Remain += 1
	book, err = service.BookRepository.Update(ctx, tx, book)
	utils.PanicIfError(err)
}

func (service *BorrowerServiceImpl) GetTotal(ctx context.Context) response.TotalBorrowerResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	var res response.TotalBorrowerResponse
	res.Total = service.BorrowerRepository.GetTotal(ctx, tx)
	return res
}
