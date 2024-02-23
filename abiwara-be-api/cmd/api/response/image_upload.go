package response

type ImageUploadResponse struct {
	ImageUrl string `json:"image_url"`
}

func ToImageUploadResponse(url string) ImageUploadResponse {
	return ImageUploadResponse{
		ImageUrl: url,
	}
}
