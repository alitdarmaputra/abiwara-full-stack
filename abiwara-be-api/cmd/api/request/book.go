package request

import "time"

type BookCreateUpdateRequest struct {
	Title      string    `json:"title"       binding:"required"`
	Price      int       `json:"price"`
	Authors    string    `json:"authors"     binding:"required"`
	Publisher  string    `json:"publisher"   binding:"required"`
	Published  int       `json:"published"   binding:"required"`
	Quantity   int       `json:"quantity"    binding:"required"`
	Page       int       `json:"page"`
	BuyDate    time.Time `json:"buy_date"    binding:"required"`
	Summary    string    `json:"summary"`
	CategoryId string    `json:"category_id"`
}
