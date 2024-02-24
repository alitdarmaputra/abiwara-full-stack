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

	var query *gorm.DB = tx
	query = query.Preload("Category")

	// Handle filter

	if search != "" {
		search = "%" + search + "%"
		query = query.Where("title LIKE ? OR author LIKE ?", search, search)
	}

	if best {
		query = query.Where("rating >= 4")
	}

	if exist {
		query = query.Where("remain > 0")
	}

	if len(categories) > 0 {
		orQuery := query
		for i, category := range categories {
			if i == 0 {
				orQuery = orQuery.Where("category_id LIKE %?", category)
				continue
			}
			orQuery = orQuery.Or("category_id LIKE %?", category)
		}
		query = query.Where(orQuery)
	}

	totalResult := query

	// Handle order and pagination

	query = query.Limit(limit).
		Offset(offset)

	if search == "" {
		query = query.Order(fmt.Sprintf("%s %s", order, sort))
	}

	query.Find(&books)

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
