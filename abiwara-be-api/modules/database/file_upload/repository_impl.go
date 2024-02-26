package file_upload_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type FileUploadRepositoryImpl struct{}

func NewFileUploadRepository() FileUploadRepository {
	return &FileUploadRepositoryImpl{}
}

func (repository *FileUploadRepositoryImpl) Create(
	ctx context.Context,
	tx *gorm.DB,
	fileUpload FileUpload,
) (FileUpload, error) {
	result := tx.Create(&fileUpload)
	return fileUpload, database.WrapError(result.Error)
}

func (repository *FileUploadRepositoryImpl) Delete(
	ctx context.Context,
	tx *gorm.DB,
	fileUploadId string,
) error {
	result := tx.Delete(&FileUpload{}, "id = ?", fileUploadId)
	return database.WrapError(result.Error)
}
