package permission_repository

import (
	"gorm.io/gorm"
)

type Permission struct {
	gorm.Model
	Name string
}
