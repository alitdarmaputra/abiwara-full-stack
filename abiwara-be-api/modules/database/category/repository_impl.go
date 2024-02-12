package category_repository

import (
	"context"
	"strings"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type CategoryRepositoryImpl struct{}

func NewCategoryRepository() CategoryRepository {
	return &CategoryRepositoryImpl{}
}

func (repository *CategoryRepositoryImpl) FindById(ctx context.Context, tx *gorm.DB, categoryId uint) (Category, error) {
	var category Category
	result := tx.First(&category, "id = ?", categoryId)
	return category, database.WrapError(result.Error)
}

func (repository *CategoryRepositoryImpl) FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, search string) ([]Category, int) {
	var categories []Category
	result := tx.Find(&categories)

	categories = []Category{}

	if search != "" {
		searchParam := "%" + strings.ToLower(search) + "%"
		tx.Limit(limit).Offset(offset).Where("LOWER(name) LIKE ? OR id LIKE ?", searchParam, searchParam).Find(&categories)
	} else {
		tx.Limit(limit).Offset(offset).Find(&categories)
	}

	return categories, int(result.RowsAffected)
}
