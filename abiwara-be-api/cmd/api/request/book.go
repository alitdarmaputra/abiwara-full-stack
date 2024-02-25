package request

import "time"

type BookCreateUpdateRequest struct {
	CoverImg         string     `json:"cover_img"`
	InventoryNumber  string     `json:"inventory_number" binding:"required"`
	Title            string     `json:"title"       binding:"required"`
	CallNumberTitle  string     `json:"call_number_title"       binding:"required"`
	Price            *int       `json:"price"`
	Author           string     `json:"author"`
	CallNumberAuthor string     `json:"call_number_author"   `
	Publisher        string     `json:"publisher"`
	Year             *int       `json:"year"`
	City             string     `json:"city"`
	Quantity         int        `json:"quantity"    binding:"required"`
	TotalPage        *int       `json:"total_page"`
	EntryDate        *time.Time `json:"entry_date"`
	FundingSource    string     `json:"funding_source"`
	Summary          string     `json:"summary"`
	Status           string     `json:"status"`
	CategoryId       string     `json:"category_id"`
}
