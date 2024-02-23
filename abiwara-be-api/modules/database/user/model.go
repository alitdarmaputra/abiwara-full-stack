package user_repository

import (
	"time"

	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	"gorm.io/gorm"
)

type User struct {
	ID         string               `gorm:"primarykey"`
	Email      string               `gorm:"column:email"`
	Password   string               `gorm:"column:password"`
	Name       string               `gorm:"column:name"`
	Class      string               `gorm:"column:class"`
	ProfileImg string               `gorm:"column:profile_img"`
	IsVerified bool                 `gorm:"is_verified"`
	RoleId     uint                 `gorm:"role_id"`
	Role       role_repository.Role `gorm:"foreignKey:RoleId"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}
