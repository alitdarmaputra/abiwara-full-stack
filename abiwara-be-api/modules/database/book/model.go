package book_repository

import (
	"time"

	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
	"gorm.io/gorm"
)

type Book struct {
	gorm.Model
	CoverImg   string    `gorm:"column:cover_img"`
	Price      int       `gorm:"column:price"`
	Title      string    `gorm:"column:title"`
	Authors    string    `gorm:"column:authors"`
	Publisher  string    `gorm:"column:publisher"`
	Published  int       `gorm:"column:published"`
	Quantity   int       `gorm:"column:quantity"`
	Remain     int       `gorm:"column:remain"`
	Page       int       `gorm:"column:page"`
	BuyDate    time.Time `gorm:"column:buy_date"`
	Summary    string    `gorm:"column:summary"`
	CategoryId string    `gorm:"column:category_id"`
	Category   category_repository.Category
}
