package recommender

import (
	"bytes"
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

func (service *BookRecommenderImpl) GetBookRecs(ctx context.Context, bookId uint) []BookRecommenderDetail {
	url := fmt.Sprintf("%s/book-recommendations/%d", service.Url, bookId)
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

func (service *BookRecommenderImpl) GetUserRecs(ctx context.Context, userId string, bookIds []uint, page int) ([]UserRecommenderDetail, int) {
	var body bytes.Buffer
	err := json.NewEncoder(&body).Encode(UserRecommenderReq{RatedBookIds: bookIds})
	utils.PanicIfError(err)

	url := fmt.Sprintf("%s/user-recommendations/%s?page=%d", service.Url, userId, page)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, &body)
	utils.PanicIfError(err)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", service.Token))
	req.Header.Add("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	utils.PanicIfError(err)

	resBody, _ := io.ReadAll(res.Body)

	userRecommender := UserRecommenderResp{}
	err = json.Unmarshal(resBody, &userRecommender)
	utils.PanicIfError(err)

	return userRecommender.Data, userRecommender.Meta.Total
}
