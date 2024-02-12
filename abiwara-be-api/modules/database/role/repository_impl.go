package role_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type RoleRepositoryImpl struct{}

func NewRoleRepository() RoleRepository {
	return &RoleRepositoryImpl{}
}

func (repository *RoleRepositoryImpl) FindById(
	ctx context.Context,
	tx *gorm.DB,
	roleId uint,
) (Role, error) {
	var role Role
	result := tx.Preload("Permissions").First(&role, roleId)
	return role, database.WrapError(result.Error)
}

func (repository *RoleRepositoryImpl) FindOne(
	ctx context.Context,
	tx *gorm.DB,
	roleName string,
) (Role, error) {
	var role Role
	result := tx.First(&role, "name = ?", roleName)
	return role, database.WrapError(result.Error)
}
