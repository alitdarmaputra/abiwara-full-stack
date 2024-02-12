package member_service

import (
	"context"
	"time"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type MemberService interface {
	Create(ctx context.Context, request request.MemberCreateRequest)
	Update(
		ctx context.Context,
		request request.MemberUpdateRequest,
		memberId uint,
	)
	Delete(ctx context.Context, memberId uint, currMember uint)
	FindById(ctx context.Context, memberId uint) response.MemberResponse
	FindAll(
		ctx context.Context,
		page int,
		perPage int,
		querySearch string,
	) ([]response.MemberResponse, common_response.Meta)
	Login(ctx context.Context, request request.MemberLoginRequest) *Token
	SetJWTConfig(secret string, expired time.Duration)
	ChangePassword(ctx context.Context, request request.ChangePasswordRequest, memberId uint)
	VerifyEmail(ctx context.Context, verificationCode string)
	SendResetToken(ctx context.Context, request request.ResetTokenRequest)
	RedeemToken(ctx context.Context, request request.RedeemTokenRequest)
	GetTotal(ctx context.Context) response.TotalMemberResponse
}
