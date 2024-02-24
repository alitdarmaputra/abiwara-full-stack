package bookmark_service

import (
	"context"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type BookmarkService interface {
	Create(ctx context.Context, request request.BookmarkCreateRequest, userId string)
	Delete(ctx context.Context, bookmarkId uint)
	FindAll(ctx context.Context,
		page int,
		perPage int,
		userId string,
		search string,
	) ([]response.BookmarkResponse, common_response.Meta)
	FindByBookId(ctx context.Context, userId string, bookId uint) response.BookmarkResponse
}
