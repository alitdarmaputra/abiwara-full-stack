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

	result := tx.
		Where(param).
		Find(&borrowers)

	if search != "" {
		search = "%" + search + "%"
		subqueryBook := tx.Model(&Borrower{}).
			Select("book_id").
			Joins("LEFT JOIN books ON borrowers.book_id = books.id").
			Where("books.title LIKE ?", search)

		subqueryMember := tx.Model(&Borrower{}).
			Select("member_id").
			Joins("LEFT JOIN members ON members.id = borrowers.member_id").
			Where("members.name LIKE ?", search)

		_ = tx.
			Preload("Book").
			Preload("Member").
			Preload("Rating").
			Where("book_id IN (?) OR member_id IN (?)", subqueryBook, subqueryMember).
			Where(param).
			Limit(limit).
			Offset(offset).
			Order("created_at desc").
			Find(&borrowers)

		return borrowers, int(result.RowsAffected)
	}

	_ = tx.
		Preload("Book").
		Preload("Member").
		Preload("Rating").
		Limit(limit).
		Offset(offset).
		Order("created_at desc").
		Where(param).
		Find(&borrowers)

	return borrowers, int(result.RowsAffected)
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
