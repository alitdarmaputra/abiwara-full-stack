package user_service

import (
	"context"
	"time"

	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type UserService interface {
	Create(ctx context.Context, request request.UserCreateRequest)
	Update(
		ctx context.Context,
		request request.UserUpdateRequest,
		userId string,
	)
	Delete(ctx context.Context, userId string, currUser string)
	FindById(ctx context.Context, userId string) response.UserResponse
	FindAll(
		ctx context.Context,
		page int,
		perPage int,
		querySearch string,
	) ([]response.UserResponse, common_response.Meta)
	Login(ctx context.Context, request request.UserLoginRequest) *Token
	SetJWTConfig(secret string, expired time.Duration)
	ChangePassword(ctx context.Context, request request.ChangePasswordRequest, userId string)
	VerifyEmail(ctx context.Context, verificationCode string)
	SendResetToken(ctx context.Context, request request.ResetTokenRequest)
	RedeemToken(ctx context.Context, request request.RedeemTokenRequest)
	GetTotal(ctx context.Context) response.TotalUserResponse
}
