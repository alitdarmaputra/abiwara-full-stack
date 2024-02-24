package bookmark_repository

import (
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
)

type Bookmark struct {
	ID        uint      `gorm:"primarykey"`
	UserId    string    `gorm:"column:user_id"`
	BookId    uint      `gorm:"column:book_id"`
	CreatedAt time.Time `gorm:"column:created_at"`
	User      user_repository.User
	Book      book_repository.Book
}
