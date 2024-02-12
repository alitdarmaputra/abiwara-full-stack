package member_repository

import (
	"context"

	"gorm.io/gorm"
)

type MemberRepository interface {
	Save(ctx context.Context, tx *gorm.DB, member Member) (Member, error)
	SaveOrUpdate(ctx context.Context, tx *gorm.DB, member Member) (Member, error)
	Update(ctx context.Context, tx *gorm.DB, member Member) (Member, error)
	Delete(ctx context.Context, tx *gorm.DB, memberId uint) error
	FindById(ctx context.Context, tx *gorm.DB, memberId uint) (Member, error)
	FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, search string) ([]Member, int)
	FindOne(ctx context.Context, tx *gorm.DB, email string, name string) (Member, error)
	FindUnverifiedById(ctx context.Context, tx *gorm.DB, memberId uint) (Member, error)
	GetTotal(ctx context.Context, tx *gorm.DB) int64
}
