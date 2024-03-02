package borrower_service

import (
	"context"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type BorrowerService interface {
	Create(ctx context.Context, request request.BorrowerCreateRequest)
	FindAll(
		ctx context.Context,
		page, perPage int,
		querySearch string,
		roleId uint,
		userId string,
		status *string,
	) ([]response.BorrowerResponse, common_response.Meta)
	Update(ctx context.Context, borrowerId uint)
	GetTotal(ctx context.Context) response.TotalBorrowerResponse
}
