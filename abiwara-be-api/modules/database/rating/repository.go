package rating_repository

import (
	"context"

	"gorm.io/gorm"
)

type RatingRepository interface {
	SaveOrUpdate(ctx context.Context, tx *gorm.DB, rating Rating) (Rating, error)
	FindByParam(ctx context.Context, tx *gorm.DB, bookId uint, userId string) (Rating, error)
	FindTotalByBookId(ctx context.Context, tx *gorm.DB, bookId uint) (TotalRating, error)
	FindByUserId(ctx context.Context, tx *gorm.DB, userId string) []uint
}
