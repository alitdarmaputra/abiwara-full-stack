package visitor_repository

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type VisitorRepository interface {
	Save(ctx context.Context, tx *gorm.DB, visitor Visitor) (Visitor, error)
	FindAll(
		ctx context.Context,
		tx *gorm.DB,
		offset, limit int,
		search string,
		param Visitor,
	) ([]Visitor, int)
	FindOne(ctx context.Context, tx *gorm.DB, param Visitor) (Visitor, error)
	GetTotal(ctx context.Context, tx *gorm.DB, startDate, endDate time.Time) []TotalVisitor
}
