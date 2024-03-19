package response

import (
	"time"

	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
)

type BorrowerResponse struct {
	Id         uint      `json:"id"`
	BookId     uint      `json:"book_id"`
	Name       string    `json:"name"`
	Class      string    `json:"class"`
	Title      string    `json:"title"`
	Status     bool      `json:"status"`
	Rating     int       `json:"rating"`
	ReturnDate time.Time `json:"return_date"`
	DueDate    time.Time `json:"due_date"`
	CreatedAt  time.Time `json:"created_at"`
}

func ToBorrowerResponse(borrower borrower_repository.Borrower) BorrowerResponse {
	rating := 0

	if borrower.RatingId != nil {
		rating = borrower.Rating.Rating
	}

	return BorrowerResponse{
		Id:         borrower.ID,
		BookId:     borrower.BookId,
		Name:       borrower.User.Name,
		Class:      borrower.User.Class,
		Title:      borrower.Book.Title,
		Status:     borrower.Status,
		Rating:     rating,
		ReturnDate: borrower.ReturnDate.Time,
		CreatedAt:  borrower.CreatedAt,
		DueDate:    borrower.DueDate,
	}
}

func ToBorrowerResponses(borrowers []borrower_repository.Borrower) []BorrowerResponse {
	borrowerResponses := []BorrowerResponse{}
	for _, borrower := range borrowers {
		borrowerResponses = append(borrowerResponses, ToBorrowerResponse(borrower))
	}
	return borrowerResponses
}

type TotalBorrowerResponse struct {
	Total int64 `json:"total"`
}
