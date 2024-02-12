package rating_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
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

func (repository *RatingRepositoryImpl) FindTotal(
	ctx context.Context,
	tx *gorm.DB,
) ([]TotalRating, error) {
	totalRatings := []TotalRating{}
	result := tx.Model(&book_repository.Book{}).
		Joins("left join ratings on books.id = ratings.book_id").
		Select("books.id as id, title as book_title, books.authors as book_authors, COALESCE(AVG(ratings.rating), 0) as average, COUNT(ratings.rating) as total").
		Group("books.id").
		Order("average DESC").
		Limit(10).
		Find(&totalRatings)
	return totalRatings, database.WrapError(result.Error)
}

func (repository *RatingRepositoryImpl) FindByParam(
	ctx context.Context,
	tx *gorm.DB,
	bookId, memberId uint,
) (Rating, error) {
	rating := Rating{}
	result := tx.Model(&Rating{}).
		Where("book_id = ? AND member_id = ?", bookId, memberId).
		First(&rating)
	return rating, database.WrapError(result.Error)
}

func (repository *RatingRepositoryImpl) FindTotalById(
	ctx context.Context,
	tx *gorm.DB,
	id uint,
) (TotalRating, error) {
	totalRating := TotalRating{}

	result := tx.Model(&Rating{}).
		Joins("join books on books.id = book_id").
		Select("books.title as book_title, books.authors as book_author, AVG(rating) as average, COUNT(rating) as total").
		Group("ratings.book_id").
		Where("ratings.book_id = ?", id).
		Find(&totalRating)
	return totalRating, database.WrapError(result.Error)
}
