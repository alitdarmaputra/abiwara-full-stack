package recommender

import "context"

type BookRecommender interface {
	Get(ctx context.Context, bookId uint) []BookRecommenderDetail
}

type BookRecommenderResp struct {
	Code int                     `json:"code"`
	Data []BookRecommenderDetail `json:"data"`
}

type BookRecommenderDetail struct {
	BookId               uint    `json:"book_id"`
	VectorCosineDistance float64 `json:"vector_cosine_distance"`
}
