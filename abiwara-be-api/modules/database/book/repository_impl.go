package book_repository

import (
	"context"
	"fmt"
	"strconv"

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
	result := tx.Joins("Category").Joins("Img").First(&book, "books.id = ?", bookId)
	return book, database.WrapError(result.Error)
}

func (repository *BookRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	categories []int,
	best bool,
	exist bool,
	search string,
	order string,
	sort string,
) ([]Book, int) {
	var books []Book = []Book{}

	var query *gorm.DB = tx
	query = query.Preload("Category").Preload("Img")

	firstGroup := tx.Preload("Category").Preload("Img")

	// Handle filter

	if search != "" {
		search = "%" + search + "%"
		firstGroup = firstGroup.Where("title LIKE ? OR author LIKE ?", search, search)
	}

	if best {
		firstGroup = firstGroup.Where("rating >= 4")
	}

	if exist {
		firstGroup = firstGroup.Where("remain > 0")
	}

	secondGroup := tx

	if len(categories) > 0 {
		for i, category := range categories {
			categoryString := strconv.Itoa(category) + "%"
			if i == 0 {
				secondGroup = secondGroup.Where("category_id LIKE ?", categoryString)
			} else {
				secondGroup = secondGroup.Or("category_id LIKE ?", categoryString)
			}
		}
	}

	query = firstGroup.Where(secondGroup)

	totalResult := query
	totalResult = totalResult.Find(&[]Book{})
	totalBook := int(totalResult.RowsAffected)

	// Handle order and pagination

	query = query.Limit(limit).
		Offset(offset)

	if search == "" {
		query = query.Order(fmt.Sprintf("%s %s", sort, order))
	}

	query.Find(&books)

	return books, int(totalBook)
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
	tx.Preload("Category").Preload("Img").Find(&books)
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

func (repository *BookRepositoryImpl) BulkCreate(
	ctx context.Context,
	tx *gorm.DB,
	books []Book,
) error {
	result := tx.CreateInBatches(&books, len(books))
	return result.Error
}
