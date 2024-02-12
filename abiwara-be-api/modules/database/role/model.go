package role_repository

import (
	permission_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/permission"
	"gorm.io/gorm"
)

type Role struct {
	gorm.Model
	Name        string                             `gorm:"column:name"`
	Permissions []permission_repository.Permission `gorm:"many2many:role_permissions;"`
}
