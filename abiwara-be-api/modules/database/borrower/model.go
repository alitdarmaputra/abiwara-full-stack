package borrower_repository

import (
	"database/sql"
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	"gorm.io/gorm"
)

type Borrower struct {
	gorm.Model
	MemberId   uint         `gorm:"column:member_id"`
	BookId     uint         `gorm:"column:book_id"`
	RatingId   uint         `gorm:"column:rating_id"`
	Status     bool         `gorm:"column:status"`
	ReturnDate sql.NullTime `gorm:"column:return_date"`
	DueDate    time.Time    `gorm:"column:due_date"`
	Member     member_repository.Member
	Book       book_repository.Book
	Rating     rating_repository.Rating
}
