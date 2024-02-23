package rating_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
)

type RatingService interface {
	CreateOrUpdate(ctx context.Context, userId string, request request.RatingCreateOrUpdateRequest)
}
