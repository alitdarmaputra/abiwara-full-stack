package borrower_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type BorrowerRepositoryImpl struct{}

func NewBorrowerRepository() BorrowerRepository {
	return &BorrowerRepositoryImpl{}
}

func (repository *BorrowerRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	borrower Borrower,
) (Borrower, error) {
	result := tx.Create(&borrower)
	return borrower, database.WrapError(result.Error)
}

func (repository *BorrowerRepositoryImpl) Update(
	ctx context.Context,
	tx *gorm.DB,
	borrower Borrower,
) (Borrower, error) {
	result := tx.Updates(&borrower)
	return borrower, database.WrapError(result.Error)
}

func (repository *BorrowerRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	search string,
	param Borrower,
) ([]Borrower, int) {
	var borrowers []Borrower

	query := tx.Preload("Book").
		Preload("User").
		Preload("Rating")

	query = tx.Where(param)

	if search != "" {
		search = "%" + search + "%"
		subqueryBook := tx.Model(&Borrower{}).
			Select("book_id").
			Joins("LEFT JOIN books ON borrowers.book_id = books.id").
			Where("books.title LIKE ?", search)

		subqueryUser := tx.Model(&Borrower{}).
			Select("user_id").
			Joins("LEFT JOIN users ON users.id = borrowers.user_id").
			Where("users.name LIKE ?", search)

		query = query.
			Where("book_id IN (?) OR user_id IN (?)", subqueryBook, subqueryUser)
	}

	totalResult := query

	// Handle order and pagination

	query = query.Limit(limit).
		Offset(offset)

	if search == "" {
		query = query.Order("created_at desc")
	}

	query.Find(&borrowers)

	totalResult = totalResult.Find(&[]Borrower{})

	return borrowers, int(totalResult.RowsAffected)
}

func (repository *BorrowerRepositoryImpl) FindById(
	ctx context.Context,
	tx *gorm.DB,
	borrowerId uint,
) (Borrower, error) {
	var borrower Borrower
	result := tx.First(&borrower, "id = ?", borrowerId)
	return borrower, database.WrapError(result.Error)
}

func (repository *BorrowerRepositoryImpl) GetTotal(
	ctx context.Context,
	tx *gorm.DB,
) int64 {
	var total int64
	if err := tx.Model(&Borrower{}).Count(&total).Error; err != nil {
		panic(err)
	}

	return total
}
