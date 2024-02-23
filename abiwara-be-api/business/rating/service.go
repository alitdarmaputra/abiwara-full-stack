package rating_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type RatingService interface {
	CreateOrUpdate(ctx context.Context, userId string, request request.RatingCreateOrUpdateRequest)
	FindTotal(ctx context.Context) []response.RatingResponse
	FindTotalByBookId(ctx context.Context, bookId uint) response.RatingResponse
}
