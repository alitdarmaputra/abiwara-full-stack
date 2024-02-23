package token_repository

import (
	"time"

	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model
	UserId      string               `gorm:"column:user_id"`
	Token       string               `gorm:"column:token"`
	TokenExpiry time.Time            `gorm:"column:token_expiry"`
	User        user_repository.User `gorm:"foreignKey:RoleId"`
}
