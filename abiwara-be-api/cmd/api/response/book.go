package response

import (
	"time"

	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
)

type BookResponse struct {
	ID       uint                `json:"id"`
	Title    string              `json:"title"`
	Author   string              `json:"author"`
	Year     *int                `json:"year"`
	Rating   float64             `json:"rating"`
	Remain   int                 `json:"remain"`
	Quantity int                 `json:"quantity"`
	Category CategoryResponse    `json:"category"`
	Img      ImageUploadResponse `json:"img"`
}

type DetailBookResponse struct {
	ID               uint                `json:"id"`
	Title            string              `json:"title"`
	InventoryNumber  string              `json:"inventory_number"`
	CallNumberTitle  string              `json:"call_number_title"`
	Price            *int                `json:"price"`
	Author           string              `json:"author"`
	CallNumberAuthor string              `json:"call_number_author"`
	Publisher        string              `json:"publisher"`
	Year             *int                `json:"year"`
	City             string              `json:"city"`
	Quantity         int                 `json:"quantity"`
	Remain           int                 `json:"remain"`
	TotalPage        *int                `json:"total_page"`
	EntryDate        *time.Time          `json:"entry_date"`
	Source           string              `json:"source"`
	Rating           float64             `json:"rating"`
	Status           string              `json:"status"`
	Summary          string              `json:"summary"`
	Category         CategoryResponse    `json:"category"`
	Img              ImageUploadResponse `json:"img"`
}

func ToBookResponse(book book_repository.Book) BookResponse {
	if book.Img.Url == "" {
		book.Img.Url = "https://ik.imagekit.io/pohfq3xvx/book-cover_7yiR3zQdQ.png?updatedAt=1708666722422"
	}

	return BookResponse{
		ID:       book.ID,
		Title:    book.Title,
		Author:   book.Author,
		Year:     book.Year,
		Remain:   book.Remain,
		Quantity: book.Quantity,
		Rating:   book.Rating,
		Category: ToCategoryResponse(book.Category),
		Img:      ToImageUploadResponse(book.Img),
	}
}

func ToDetailBookResponse(book book_repository.Book) DetailBookResponse {
	if book.Img.Url == "" {
		book.Img.Url = "https://ik.imagekit.io/pohfq3xvx/book-cover_7yiR3zQdQ.png?updatedAt=1708666722422"
	}

	return DetailBookResponse{
		ID:               book.ID,
		InventoryNumber:  book.InventoryNumber,
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
		Source:           book.Source,
		TotalPage:        book.TotalPage,
		EntryDate:        book.EntryDate,
		Rating:           book.Rating,
		Summary:          book.Summary,
		Status:           book.Status,
		Category:         ToCategoryResponse(book.Category),
		Img:              ToImageUploadResponse(book.Img),
	}
}

func ToBookResponses(books []book_repository.Book) []BookResponse {
	var bookResponses []BookResponse = []BookResponse{}
	for _, book := range books {
		bookResponses = append(bookResponses, ToBookResponse(book))
	}
	return bookResponses
}
