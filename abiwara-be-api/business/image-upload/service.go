package image_upload_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
)

type ImageUploadService interface {
	Post(ctx context.Context, byteImage []byte, imageName string) (response.ImageUploadResponse, error)
}
