package image_upload_controller

import "github.com/gin-gonic/gin"

type ImageUploadController interface {
	Post(ctx *gin.Context)
	Delete(ctx *gin.Context)
}
