package request

import "time"

type BookCreateUpdateRequest struct {
	CoverImg         string    `json:"cover_img"`
	InventoryNumber  string    `json:"inventory_number"`
	Title            string    `json:"title"       binding:"required"`
	CallNumberTitle  string    `json:"call_number_title"       binding:"required"`
	Price            int       `json:"price"`
	Author           string    `json:"author"     binding:"required"`
	CallNumberAuthor string    `json:"call_number_author"       binding:"required"`
	Publisher        string    `json:"publisher"   binding:"required"`
	Year             int       `json:"year"   binding:"required"`
	City             string    `json:"city"   binding:"required"`
	Quantity         int       `json:"quantity"    binding:"required"`
	TotalPage        int       `json:"total_page"`
	EntryDate        time.Time `json:"entry_date"    binding:"required"`
	FundingSource    string    `json:"funding_source"    binding:"required"`
	Summary          string    `json:"summary"`
	Status           string    `json:"status" binding:"required"`
	CategoryId       string    `json:"category_id"`
}
