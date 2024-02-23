package rating_repository

import (
	"context"

	"gorm.io/gorm"
)

type RatingRepository interface {
	SaveOrUpdate(ctx context.Context, tx *gorm.DB, rating Rating) (Rating, error)
	FindTotal(ctx context.Context, tx *gorm.DB) ([]TotalRating, error)
	FindTotalById(ctx context.Context, tx *gorm.DB, id uint) (TotalRating, error)
	FindByParam(ctx context.Context, tx *gorm.DB, bookId uint, userId string) (Rating, error)
}
