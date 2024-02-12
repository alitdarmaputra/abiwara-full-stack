package response

import (
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
)

type BookResponse struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	Authors   string `json:"authors"`
	Published int    `json:"published"`
	Remain    int    `json:"remain"`
	Quantity  int    `json:"quantity"`
}

type DetailBookResponse struct {
	ID        uint                         `json:"id"`
	Title     string                       `json:"title"`
	Price     int                          `json:"price"`
	Authors   string                       `json:"authors"`
	Publisher string                       `json:"publisher"`
	Published int                          `json:"published"`
	Quantity  int                          `json:"quantity"`
	Remain    int                          `json:"remain"`
	Page      int                          `json:"page"`
	BuyDate   time.Time                    `json:"buy_date"`
	Summary   string                       `json:"summary"`
	Cateogry  category_repository.Category `json:"category"`
}

func ToBookResponse(book book_repository.Book) BookResponse {
	return BookResponse{
		ID:        book.ID,
		Title:     book.Title,
		Authors:   book.Authors,
		Published: book.Published,
		Remain:    book.Remain,
		Quantity:  book.Quantity,
	}
}

func ToDetailBookResponse(book book_repository.Book) DetailBookResponse {
	return DetailBookResponse{
		ID:        book.ID,
		Title:     book.Title,
		Price:     book.Page,
		Authors:   book.Authors,
		Publisher: book.Publisher,
		Published: book.Published,
		Quantity:  book.Quantity,
		Remain:    book.Remain,
		Page:      book.Page,
		BuyDate:   book.BuyDate,
		Summary:   book.Summary,
		Cateogry:  book.Category,
	}
}

func ToBookResponses(books []book_repository.Book) []BookResponse {
	var bookResponses []BookResponse = []BookResponse{}
	for _, book := range books {
		bookResponses = append(bookResponses, ToBookResponse(book))
	}
	return bookResponses
}
