package token_repository

import (
	"context"

	"gorm.io/gorm"
)

type TokenRepository interface {
	Save(ctx context.Context, tx *gorm.DB, resetToken Token)
	FindByToken(ctx context.Context, tx *gorm.DB, token string) (Token, error)
	DeleteAllByUserId(ctx context.Context, tx *gorm.DB, userId string)
}
