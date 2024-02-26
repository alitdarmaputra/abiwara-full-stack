package image_upload

import (
	"context"
)

type ImageUploader interface {
	UploadImage(ctx context.Context, image []byte, name string) (ImgKitResp, error)
	DeleteImage(ctx context.Context, imgId string) error
}

type ImgKitResp struct {
	Url    string `json:"url"`
	FileId string `json:"fileId"`
}
