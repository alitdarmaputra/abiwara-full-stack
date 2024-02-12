package visitor_service

import (
	"context"
	"time"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type VisitorService interface {
	Create(ctx context.Context, request request.VisitorCreateRequest, memberId uint)
	FindAll(
		ctx context.Context,
		page, perPage int,
		querySearch string,
		roleId,
		memberId uint,
	) ([]response.VisitorResponse, common_response.Meta)
	GetTotal(
		ctx context.Context,
		startDate time.Time,
		endDate time.Time,
	) []response.TotalVisitorResponse
}
