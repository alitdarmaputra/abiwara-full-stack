package role_repository

import (
	"context"

	"gorm.io/gorm"
)

type RoleRepository interface {
	FindById(ctx context.Context, tx *gorm.DB, roleId uint) (Role, error)
	FindOne(ctx context.Context, tx *gorm.DB, roleName string) (Role, error)
}
