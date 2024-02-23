package image_upload_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	image_upload "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/image-upload"
)

type ImageUploadServiceImpl struct {
	ImageUploader image_upload.ImageUploader
}

func NewImageUploadService(imageUploader image_upload.ImageUploader) ImageUploadService {
	return &ImageUploadServiceImpl{
		ImageUploader: imageUploader,
	}
}

func (service *ImageUploadServiceImpl) Post(ctx context.Context, byteImage []byte, imageName string) (response.ImageUploadResponse, error) {
	url, err := service.ImageUploader.UploadImage(ctx, byteImage, imageName)
	if err != nil {
		return response.ImageUploadResponse{}, err
	}

	return response.ToImageUploadResponse(url), nil
}
