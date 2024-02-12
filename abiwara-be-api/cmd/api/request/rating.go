package request

type RatingCreateOrUpdateRequest struct {
	BorrowerId uint `json:"borrower_id"`
	BookId     uint `json:"book_id"`
	Rating     int  `json:"rating"`
}
