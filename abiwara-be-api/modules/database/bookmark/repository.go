package bookmark_repository

import (
	"context"

	"gorm.io/gorm"
)

type BookmarkRepository interface {
	Save(ctx context.Context, tx *gorm.DB, bookmark Bookmark) (Bookmark, error)
	Delete(ctx context.Context, tx *gorm.DB, bookmarkId uint) error
	FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, userId string, search string) ([]Bookmark, int)
	FindByBookId(ctx context.Context, tx *gorm.DB, userId string, bookId uint) (Bookmark, error)
}
