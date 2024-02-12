package response

import rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"

type RatingResponse struct {
	Id          uint    `json:"id"`
	BookTitle   string  `json:"book_title"`
	BookAuthors string  `json:"book_authors"`
	Rating      float64 `json:"rating"`
	Total       int     `json:"total"`
}

func ToRatingResponse(rating rating_repository.TotalRating) RatingResponse {
	return RatingResponse{
		Id:          rating.Id,
		BookTitle:   rating.BookTitle,
		BookAuthors: rating.BookAuthors,
		Rating:      rating.Average,
		Total:       rating.Total,
	}
}

func ToRatingResponses(ratings []rating_repository.TotalRating) []RatingResponse {
	ratingResponses := []RatingResponse{}

	for _, rating := range ratings {
		ratingResponses = append(ratingResponses, ToRatingResponse(rating))
	}
	return ratingResponses
}
