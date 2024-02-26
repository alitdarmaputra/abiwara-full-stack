package file_upload_repository

import (
	"context"

	"gorm.io/gorm"
)

type FileUploadRepository interface {
	Create(ctx context.Context, tx *gorm.DB, fileUpload FileUpload) (FileUpload, error)
	Delete(ctx context.Context, tx *gorm.DB, fileUploadId string) error
}
