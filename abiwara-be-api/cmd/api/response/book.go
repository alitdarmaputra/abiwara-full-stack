package response

import (
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
)

type BookResponse struct {
	ID         uint   `json:"id"`
	CoverImage string `json:"cover_img"`
	Title      string `json:"title"`
	Author     string `json:"author"`
	Year       int    `json:"year"`
	Remain     int    `json:"remain"`
	Quantity   int    `json:"quantity"`
}

type DetailBookResponse struct {
	ID               uint                         `json:"id"`
	CoverImage       string                       `json:"cover_img"`
	Title            string                       `json:"title"`
	InventoryNumber  string                       `json:"inventory_number"`
	CallNumberTitle  string                       `json:"call_number_title"`
	Price            int                          `json:"price"`
	Author           string                       `json:"author"`
	CallNumberAuthor string                       `json:"call_number_author"`
	Publisher        string                       `json:"publisher"`
	Year             int                          `json:"year"`
	City             string                       `json:"city"`
	Quantity         int                          `json:"quantity"`
	Remain           int                          `json:"remain"`
	TotalPage        int                          `json:"total_page"`
	EntryDate        time.Time                    `json:"entry_date"`
	Summary          string                       `json:"summary"`
	Cateogry         category_repository.Category `json:"category"`
}

func ToBookResponse(book book_repository.Book) BookResponse {
	return BookResponse{
		ID:         book.ID,
		CoverImage: book.CoverImg,
		Title:      book.Title,
		Author:     book.Author,
		Year:       book.Year,
		Remain:     book.Remain,
		Quantity:   book.Quantity,
	}
}

func ToDetailBookResponse(book book_repository.Book) DetailBookResponse {
	return DetailBookResponse{
		ID:               book.ID,
		InventoryNumber:  book.InventoryNumber,
		CoverImage:       book.CoverImg,
		Title:            book.Title,
		CallNumberTitle:  book.CallNumberTitle,
		City:             book.City,
		Price:            book.Price,
		Author:           book.Author,
		CallNumberAuthor: book.CallNumberAuthor,
		Publisher:        book.Publisher,
		Year:             book.Year,
		Quantity:         book.Quantity,
		Remain:           book.Remain,
		TotalPage:        book.TotalPage,
		EntryDate:        book.EntryDate,
		Summary:          book.Summary,
		Cateogry:         book.Category,
	}
}

func ToBookResponses(books []book_repository.Book) []BookResponse {
	var bookResponses []BookResponse = []BookResponse{}
	for _, book := range books {
		bookResponses = append(bookResponses, ToBookResponse(book))
	}
	return bookResponses
}
