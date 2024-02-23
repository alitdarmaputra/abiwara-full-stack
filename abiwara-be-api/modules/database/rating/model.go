package rating_repository

import (
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
	"gorm.io/gorm"
)

type Rating struct {
	gorm.Model
	UserId string `gorm:"column:user_id"`
	BookId uint   `gorm:"column:book_id"`
	Rating int    `gorm:"column:rating"`
	User   user_repository.User
	Book   book_repository.Book
}

type TotalRating struct {
	Id          uint
	BookTitle   string
	BookAuthors string
	Average     float64
	Total       int
}
