package category_service

import (
	"context"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type CategoryService interface {
	FindAll(ctx context.Context, page int, perPage int, search string) ([]response.CategoryResponse, common_response.Meta)
}
