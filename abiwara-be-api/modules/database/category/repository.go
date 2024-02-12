package category_repository 

import (
	"context"

	"gorm.io/gorm"
)

type CategoryRepository interface {
	FindById(ctx context.Context, tx *gorm.DB, categoryId uint) (Category, error)
	FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, search string) ([]Category, int)
}
