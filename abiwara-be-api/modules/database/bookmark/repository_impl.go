package bookmark_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type BookmarkRepositoryImpl struct{}

func NewBookmarkRepository() BookmarkRepository {
	return &BookmarkRepositoryImpl{}
}

func (repository *BookmarkRepositoryImpl) Save(ctx context.Context, tx *gorm.DB, bookmark Bookmark) (Bookmark, error) {
	result := tx.Create(&bookmark)
	return bookmark, database.WrapError(result.Error)
}

func (respoitory *BookmarkRepositoryImpl) Delete(ctx context.Context, tx *gorm.DB, bookmarkId uint) error {
	result := tx.Delete(&Bookmark{}, bookmarkId)
	return database.WrapError(result.Error)
}

func (repository *BookmarkRepositoryImpl) FindAll(ctx context.Context, tx *gorm.DB, offset, limit int, userId string, search string) ([]Bookmark, int) {
	var bookmarks []Bookmark = []Bookmark{}

	result := tx.Find(&bookmarks)

	if search != "" {
		search = "%" + search + "%"
		tx.Preload("Book").
			Where("user_id = ? AND (title LIKE ? OR authors LIKE ?)", userId, search, search).
			Limit(limit).
			Offset(offset).
			Order("created_at desc").
			Find(&bookmarks)
	} else {
		tx.Preload("Book").
			Where("user_id = ?", userId).Limit(limit).Offset(offset).Order("created_at desc").Find(&bookmarks)
	}

	return bookmarks, int(result.RowsAffected)
}

func (repository *BookmarkRepositoryImpl) FindByBookId(ctx context.Context, tx *gorm.DB, userId string, bookId uint) (Bookmark, error) {
	var bookmark Bookmark
	result := tx.Joins("Book").First(&bookmark, "user_id = ? AND book_id = ?", userId, bookId)
	return bookmark, database.WrapError(result.Error)
}
