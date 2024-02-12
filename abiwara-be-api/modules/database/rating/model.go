package rating_repository

import (
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	"gorm.io/gorm"
)

type Rating struct {
	gorm.Model
	MemberId uint `gorm:"column:member_id"`
	BookId   uint `gorm:"column:book_id"`
	Rating   int  `gorm:"column:rating"`
	Member   member_repository.Member
	Book     book_repository.Book
}

type TotalRating struct {
	Id          uint
	BookTitle   string
	BookAuthors string
	Average     float64
	Total       int
}
