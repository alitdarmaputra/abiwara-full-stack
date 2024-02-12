package book_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type BookRepositoryImpl struct{}

func NewBookRepository() BookRepository {
	return &BookRepositoryImpl{}
}

func (repository *BookRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	book Book,
) (Book, error) {
	result := tx.Create(&book)
	return book, database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) Update(
	ctx context.Context,
	tx *gorm.DB,
	book Book,
) (Book, error) {
	result := tx.Save(&book)
	return book, database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) Delete(ctx context.Context, tx *gorm.DB, bookId uint) error {
	result := tx.Delete(&Book{}, bookId)
	return database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) FindById(
	ctx context.Context,
	tx *gorm.DB,
	bookId uint,
) (Book, error) {
	var book Book
	result := tx.Joins("Category").First(&book, "books.id = ?", bookId)
	return book, database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	search string,
) ([]Book, int) {
	var books []Book = []Book{}

	result := tx.Find(&books)

	if search != "" {
		search = "%" + search + "%"
		tx.Where("title LIKE ? OR authors LIKE ?", search, search).
			Limit(limit).
			Offset(offset).
			Order("updated_at desc").
			Find(&books)
	} else {
		tx.Limit(limit).Offset(offset).Order("updated_at desc").Find(&books)
	}

	return books, int(result.RowsAffected)
}

func (repository *BookRepositoryImpl) FindOne(
	ctx context.Context,
	tx *gorm.DB,
	title string,
) (Book, error) {
	var book Book
	result := tx.First(&book, "title = ?", title)
	return book, database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) FindAllWithoutParameter(
	ctx context.Context,
	tx *gorm.DB,
) []Book {
	var books []Book = []Book{}
	tx.Find(&books)
	return books
}
