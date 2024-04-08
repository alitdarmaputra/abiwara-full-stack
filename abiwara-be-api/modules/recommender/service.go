package recommender

import "context"

type BookRecommender interface {
	GetBookRecs(ctx context.Context, bookId uint) []BookRecommenderDetail
	GetUserRecs(ctx context.Context, userId string, bookIds []uint) []UserRecommenderDetail
}

type BookRecommenderResp struct {
	Code int                     `json:"code"`
	Data []BookRecommenderDetail `json:"data"`
}

type UserRecommenderResp struct {
	Code int                     `json:"code"`
	Data []UserRecommenderDetail `json:"data"`
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
