package book_repository

import (
	"time"

	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
	"gorm.io/gorm"
)

type Book struct {
	gorm.Model
	CoverImg         string     `gorm:"column:cover_img"`
	InventoryNumber  string     `gorm:"column:inventory_number"`
	Author           string     `gorm:"column:author"`
	CallNumberAuthor string     `gorm:"column:call_number_author"`
	Title            string     `gorm:"column:title"`
	CallNumberTitle  string     `gorm:"column:call_number_title"`
	Publisher        string     `gorm:"column:publisher"`
	Year             *int       `gorm:"column:year"`
	City             string     `gorm:"column:city"`
	Price            *int       `gorm:"column:price"`
	Quantity         int        `gorm:"column:quantity"`
	Remain           int        `gorm:"column:remain"`
	TotalPage        *int       `gorm:"column:total_page"`
	EntryDate        *time.Time `gorm:"column:entry_date"`
	FundingSource    string     `gorm:"column:funding_source"`
	Summary          string     `gorm:"column:summary"`
	Status           string     `gorm:"column:status"`
	Rating           float64    `gorm:"column:rating"`
	CategoryId       string     `gorm:"column:category_id"`
	Category         category_repository.Category
}
