package borrower_repository

import (
	"context"

	"gorm.io/gorm"
)

type BorrowerRepository interface {
	Save(ctx context.Context, tx *gorm.DB, borrower Borrower) (Borrower, error)
	Update(ctx context.Context, tx *gorm.DB, borrower Borrower) (Borrower, error)
	FindAll(
		ctx context.Context,
		tx *gorm.DB,
		offset, limit int,
		search string,
		param Borrower,
	) ([]Borrower, int)
	FindById(ctx context.Context, tx *gorm.DB, borrowerId uint) (Borrower, error)
	GetTotal(ctx context.Context, tx *gorm.DB) int64
}
