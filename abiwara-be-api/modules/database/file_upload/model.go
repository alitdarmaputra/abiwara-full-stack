package file_upload_repository

import (
	"time"
)

type FileUpload struct {
	ID        string `gorm:"primaryKey"`
	Url       string `gorm:"column:url"`
	CreatedAt time.Time
}
