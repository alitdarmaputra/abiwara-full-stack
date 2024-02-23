package recommender

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
)

type BookRecommenderImpl struct {
	Token string
	Url   string
}

func NewBookRecommender(token, url string) BookRecommender {
	return &BookRecommenderImpl{
		Token: token,
		Url:   url,
	}
}

func (service *BookRecommenderImpl) Get(ctx context.Context, bookId uint) []BookRecommenderDetail {
	url := fmt.Sprintf("%s/recommendations/%d", service.Url, bookId)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	utils.PanicIfError(err)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", service.Token))
	res, err := http.DefaultClient.Do(req)
	utils.PanicIfError(err)

	resBody, _ := io.ReadAll(res.Body)

	bookRecommender := BookRecommenderResp{}
	err = json.Unmarshal(resBody, &bookRecommender)
	utils.PanicIfError(err)

	return bookRecommender.Data
}
