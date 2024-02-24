package book_repository

import (
	"context"
	"fmt"

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
	categories []string,
	best bool,
	exist bool,
	search string,
	order string,
	sort string,
) ([]Book, int) {
	var books []Book = []Book{}

	var result *gorm.DB = tx
	result = result.Preload("Category")

	// Handle filter

	if search != "" {
		search = "%" + search + "%"
		result = result.Where("title LIKE ? OR author LIKE ?", search, search)
	}

	if best {
		result = result.Where("rating >= 4")
	}

	if exist {
		result = result.Where("remain > 0")
	}

	if len(categories) > 0 {
		orResult := result
		for i, category := range categories {
			if i == 0 {
				orResult = orResult.Where("category_id LIKE %?", category)
				continue
			}
			orResult = orResult.Or("category_id LIKE %?", category)
		}
	}

	totalResult := result

	// Handle order and pagination

	result = result.Limit(limit).
		Offset(offset)

	if search == "" {
		result = result.Order(fmt.Sprintf("%s %s", order, sort))
	}

	result.Find(&books)

	totalResult = totalResult.Find(&[]Book{})

	return books, int(totalResult.RowsAffected)
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

func (repository *BookRepositoryImpl) FindIn(
	ctx context.Context,
	tx *gorm.DB,
	bookIds []uint,
) []Book {
	var books []Book = []Book{}
	tx.Where("(id) IN ?", bookIds).Find(&books)

	return books
}
