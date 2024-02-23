package image_upload

import (
	"context"
)

type ImageUploader interface {
	UploadImage(ctx context.Context, image []byte, name string) (string, error)
}

type ImgKitResp struct {
	Url string `json:"url"`
}
