package rating_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type RatingServiceImpl struct {
	RatingRepository   rating_repository.RatingRepository
	BorrowerRepository borrower_repository.BorrowerRepository
	BookRepository     book_repository.BookRepository
	DB                 *gorm.DB
}

func NewRatingService(
	ratingRepository rating_repository.RatingRepository,
	borrowerRepository borrower_repository.BorrowerRepository,
	bookRepository book_repository.BookRepository,
	db *gorm.DB,
) RatingService {
	return &RatingServiceImpl{
		RatingRepository:   ratingRepository,
		DB:                 db,
		BorrowerRepository: borrowerRepository,
		BookRepository:     bookRepository,
	}
}

func (service *RatingServiceImpl) CreateOrUpdate(
	ctx context.Context,
	userId string,
	request request.RatingCreateOrUpdateRequest,
) {
	rating := rating_repository.Rating{}
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	rating, err := service.RatingRepository.FindByParam(ctx, tx, request.BookId, userId)

	rating.UserId = userId
	rating.BookId = request.BookId
	rating.Rating = request.Rating

	rating, err = service.RatingRepository.SaveOrUpdate(ctx, tx, rating)
	utils.PanicIfError(err)

	borrower, err := service.BorrowerRepository.FindById(ctx, tx, request.BorrowerId)
	utils.PanicIfError(err)

	borrower.RatingId = &rating.ID
	borrower, err = service.BorrowerRepository.Update(ctx, tx, borrower)
	utils.PanicIfError(err)

	book, err := service.BookRepository.FindById(ctx, tx, rating.BookId)
	utils.PanicIfError(err)

	totalRating, err := service.RatingRepository.FindTotalByBookId(ctx, tx, book.ID)
	utils.PanicIfError(err)

	book.Rating = totalRating.Average

	service.BookRepository.Update(ctx, tx, book)
}
