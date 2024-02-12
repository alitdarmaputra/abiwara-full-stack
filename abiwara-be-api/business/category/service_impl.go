package category_service

import (
	"context"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type CategoryServiceImpl struct {
	CategoryRepository category_repository.CategoryRepository
	DB                 *gorm.DB
}

func NewCategoryService(categoryRepository category_repository.CategoryRepository, db *gorm.DB) CategoryService {
	return &CategoryServiceImpl{
		CategoryRepository: categoryRepository,
		DB:                 db,
	}
}

func (service *CategoryServiceImpl) FindAll(ctx context.Context, page int, perPage int, search string) ([]response.CategoryResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	categories, total := service.CategoryRepository.FindAll(ctx, tx, utils.CountOffset(page, perPage), perPage, search)
	return response.ToCategoryResponses(categories), common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     total,
		TotalPage: utils.CountTotalPage(total, perPage),
	}
}
