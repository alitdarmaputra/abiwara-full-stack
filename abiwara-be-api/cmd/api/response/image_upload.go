package response

import file_upload_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/file_upload"

type ImageUploadResponse struct {
	ID       string `json:"id"`
	ImageUrl string `json:"image_url"`
}

func ToImageUploadResponse(imageUpload file_upload_repository.FileUpload) ImageUploadResponse {
	return ImageUploadResponse{
		ID:       imageUpload.ID,
		ImageUrl: imageUpload.Url,
	}
}
