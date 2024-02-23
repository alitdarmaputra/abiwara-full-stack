package rating_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type RatingRepositoryImpl struct{}

func NewRatingRepository() RatingRepository {
	return &RatingRepositoryImpl{}
}

func (repository *RatingRepositoryImpl) SaveOrUpdate(
	ctx context.Context,
	tx *gorm.DB,
	rating Rating,
) (Rating, error) {
	result := tx.Save(&rating)
	return rating, database.WrapError(result.Error)
}

func (repository *RatingRepositoryImpl) FindByParam(
	ctx context.Context,
	tx *gorm.DB,
	bookId uint,
	userId string,
) (Rating, error) {
	rating := Rating{}
	result := tx.Model(&Rating{}).
		Where("book_id = ? AND user_id = ?", bookId, userId).
		First(&rating)
	return rating, database.WrapError(result.Error)
}

func (repository *RatingRepositoryImpl) FindTotalByBookId(
	ctx context.Context,
	tx *gorm.DB,
	bookId uint,
) (TotalRating, error) {
	totalRating := TotalRating{}

	result := tx.Model(&Rating{}).
		Joins("join books on books.id = book_id").
		Select("books.id, books.title, AVG(ratings.rating) as average, SUM(ratings.rating) as total, COUNT(ratings.rating) as count").
		Group("ratings.book_id").
		Where("ratings.book_id = ?", bookId).
		Find(&totalRating)
	return totalRating, database.WrapError(result.Error)
}
