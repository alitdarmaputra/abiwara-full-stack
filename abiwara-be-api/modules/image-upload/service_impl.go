package image_upload

import (
	"context"
	"encoding/base64"
	"encoding/json"

	"github.com/imagekit-developer/imagekit-go"
	"github.com/imagekit-developer/imagekit-go/api/uploader"
)

type ImageUploaderImpl struct {
	Ik *imagekit.ImageKit
}

func NewImageUploader(ik *imagekit.ImageKit) ImageUploader {
	return &ImageUploaderImpl{
		Ik: ik,
	}
}

func (u *ImageUploaderImpl) UploadImage(ctx context.Context, image []byte, name string) (string, error) {
	// Encode Image to Base64String
	base64Image := base64.StdEncoding.EncodeToString(image)

	// Upload Image
	resp, err := u.Ik.Uploader.Upload(ctx, base64Image, uploader.UploadParam{
		FileName: name,
	})
	if err != nil {
		return "", err
	}

	// Parse Resp to Json
	imgKitResp := &ImgKitResp{}

	err = json.Unmarshal(resp.Body(), imgKitResp)
	if err != nil {
		return "", err
	}

	return imgKitResp.Url, nil
}
