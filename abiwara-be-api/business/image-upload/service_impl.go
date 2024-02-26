package image_upload_service

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	file_upload_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/file_upload"
	image_upload "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/image-upload"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type ImageUploadServiceImpl struct {
	ImageUploader        image_upload.ImageUploader
	FileUploadRepository file_upload_repository.FileUploadRepository
	DB                   *gorm.DB
}

func NewImageUploadService(imageUploader image_upload.ImageUploader, fileUploadRepository file_upload_repository.FileUploadRepository, db *gorm.DB) ImageUploadService {
	return &ImageUploadServiceImpl{
		ImageUploader:        imageUploader,
		FileUploadRepository: fileUploadRepository,
		DB:                   db,
	}
}

func (service *ImageUploadServiceImpl) Post(ctx context.Context, byteImage []byte, imageName string) (response.ImageUploadResponse, error) {
	res, err := service.ImageUploader.UploadImage(ctx, byteImage, imageName)
	if err != nil {
		return response.ImageUploadResponse{}, err
	}

	fileUpload := file_upload_repository.FileUpload{
		ID:  res.FileId,
		Url: res.Url,
	}

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	imageUpload, err := service.FileUploadRepository.Create(ctx, tx, fileUpload)
	if err != nil {
		return response.ImageUploadResponse{}, err
	}

	return response.ToImageUploadResponse(imageUpload), nil
}

func (service *ImageUploadServiceImpl) Delete(ctx context.Context, imgId string) {
	err := service.ImageUploader.DeleteImage(ctx, imgId)
	utils.PanicIfError(err)

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	err = service.FileUploadRepository.Delete(ctx, tx, imgId)
	utils.PanicIfError(err)
}
