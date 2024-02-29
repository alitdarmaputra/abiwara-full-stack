package book_service

import (
	"context"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
)

type BookService interface {
	Create(ctx context.Context, request request.BookCreateUpdateRequest)
	Update(ctx context.Context, request request.BookCreateUpdateRequest, bookId uint)
	Delete(ctx context.Context, bookId uint)
	FindById(ctx context.Context, bookId uint) response.DetailBookResponse
	FindAll(
		ctx context.Context,
		page int,
		perPage int,
		categories []int,
		best bool,
		exist bool,
		search string,
		order string,
		sort string,
	) ([]response.BookResponse, common_response.Meta)
	GetFile(ctx context.Context) [][]string
	GetRecommendation(ctx context.Context, bookId uint) []response.BookResponse
	BulkCreate(ctx context.Context, books []book_repository.Book)
}
