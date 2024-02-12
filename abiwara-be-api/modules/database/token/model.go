package token_repository

import (
	"time"

	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model
	MemberId    uint                     `gorm:"column:member_id"`
	Token       string                   `gorm:"column:token"`
	TokenExpiry time.Time                `gorm:"column:token_expiry"`
	Member      member_repository.Member `gorm:"foreignKey:RoleId"`
}
