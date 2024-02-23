package user_repository

import (
	"context"

	"gorm.io/gorm"
)

type UserRepository interface {
	Save(ctx context.Context, tx *gorm.DB, user User) (User, error)
	SaveOrUpdate(ctx context.Context, tx *gorm.DB, user User) (User, error)
	Update(ctx context.Context, tx *gorm.DB, user User) (User, error)
	Delete(ctx context.Context, tx *gorm.DB, userId string) error
	FindById(ctx context.Context, tx *gorm.DB, userId string) (User, error)
	FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, search string) ([]User, int)
	FindOne(ctx context.Context, tx *gorm.DB, email string, name string) (User, error)
	FindUnverifiedById(ctx context.Context, tx *gorm.DB, userId string) (User, error)
	GetTotal(ctx context.Context, tx *gorm.DB) int64
}
