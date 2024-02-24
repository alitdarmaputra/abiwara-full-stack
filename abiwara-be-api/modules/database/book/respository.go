package book_repository

import (
	"context"

	"gorm.io/gorm"
)

type BookRepository interface {
	Save(ctx context.Context, tx *gorm.DB, book Book) (Book, error)
	Update(ctx context.Context, tx *gorm.DB, book Book) (Book, error)
	Delete(ctx context.Context, tx *gorm.DB, bookId uint) error
	FindById(ctx context.Context, tx *gorm.DB, bookId uint) (Book, error)
	FindAll(ctx context.Context, tx *gorm.DB, offset, limit int,
		categories []string,
		best bool,
		exist bool,
		search string,
		order string,
		sort string) ([]Book, int)
	FindOne(ctx context.Context, tx *gorm.DB, title string) (Book, error)
	FindAllWithoutParameter(ctx context.Context, tx *gorm.DB) []Book
	FindIn(ctx context.Context, tx *gorm.DB, bookIds []uint) []Book
}
