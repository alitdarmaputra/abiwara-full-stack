package rating_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type RatingServiceImpl struct {
	RatingRepository   rating_repository.RatingRepository
	BorrowerRepository borrower_repository.BorrowerRepository
	DB                 *gorm.DB
}

func NewRatingService(
	ratingRepository rating_repository.RatingRepository,
	borrowerRepository borrower_repository.BorrowerRepository,
	db *gorm.DB,
) RatingService {
	return &RatingServiceImpl{
		RatingRepository:   ratingRepository,
		DB:                 db,
		BorrowerRepository: borrowerRepository,
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

	borrower.RatingId = rating.ID
	borrower, err = service.BorrowerRepository.Update(ctx, tx, borrower)
	utils.PanicIfError(err)
}

func (service *RatingServiceImpl) FindTotal(ctx context.Context) []response.RatingResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	totalRatings, err := service.RatingRepository.FindTotal(ctx, tx)
	utils.PanicIfError(err)

	return response.ToRatingResponses(totalRatings)
}

func (service *RatingServiceImpl) FindTotalByBookId(
	ctx context.Context,
	bookId uint,
) response.RatingResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	totalRating, err := service.RatingRepository.FindTotalById(ctx, tx, bookId)
	utils.PanicIfError(err)

	return response.ToRatingResponse(totalRating)
}
