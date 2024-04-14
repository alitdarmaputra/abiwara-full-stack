package recommender

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
)

type BookRecommender interface {
	GetBookRecs(ctx context.Context, bookId uint) []BookRecommenderDetail
	GetUserRecs(ctx context.Context, userId string, bookIds []uint, page int) ([]UserRecommenderDetail, int)
}

type BookRecommenderResp struct {
	Code int                     `json:"code"`
	Data []BookRecommenderDetail `json:"data"`
}

type UserRecommenderResp struct {
	Code int                     `json:"code"`
	Data []UserRecommenderDetail `json:"data"`
	Meta response.Meta           `json:"meta"`
}

type UserRecommenderReq struct {
	RatedBookIds []uint `json:"rated_book_ids"`
}

type BookRecommenderDetail struct {
	BookId               uint    `json:"book_id"`
	VectorCosineDistance float64 `json:"vector_cosine_distance"`
}

type UserRecommenderDetail struct {
	BookId uint    `json:"book_id"`
	Est    float64 `json:"est"`
}
