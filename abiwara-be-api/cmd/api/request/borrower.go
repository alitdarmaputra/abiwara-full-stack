package request

import "time"

type BorrowerCreateRequest struct {
	UserId  string    `json:"user_id" binding:"required"`
	BookId  uint      `json:"book_id"   binding:"required"`
	DueDate time.Time `json:"due_date"  binding:"required"`
}
