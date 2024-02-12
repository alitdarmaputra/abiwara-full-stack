package token_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type TokenRepositoryImpl struct{}

func NewTokenRepository() TokenRepository {
	return &TokenRepositoryImpl{}
}

func (repository *TokenRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	resetToken Token,
) {
	_ = tx.Create(&resetToken)
}

func (repository *TokenRepositoryImpl) FindByToken(
	ctx context.Context,
	tx *gorm.DB,
	token string,
) (Token, error) {
	var resetToken Token
	result := tx.First(&resetToken, "token = ?", token)
	return resetToken, database.WrapError(result.Error)
}

func (repository *TokenRepositoryImpl) DeleteAllByUserId(
	ctx context.Context,
	tx *gorm.DB,
	memberId uint,
) {
	tx.Delete(&[]Token{}, "member_id", memberId)
}
