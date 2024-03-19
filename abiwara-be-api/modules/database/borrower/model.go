package borrower_repository

import (
	"database/sql"
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
	"gorm.io/gorm"
)

type Borrower struct {
	gorm.Model
	UserId     string       `gorm:"column:user_id"`
	BookId     uint         `gorm:"column:book_id"`
	RatingId   *uint        `gorm:"column:rating_id"`
	Status     bool         `gorm:"column:status"`
	ReturnDate sql.NullTime `gorm:"column:return_date"`
	DueDate    time.Time    `gorm:"column:due_date"`
	User       user_repository.User
	Book       book_repository.Book
	Rating     rating_repository.Rating
}
