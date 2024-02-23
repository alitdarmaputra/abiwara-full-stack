package router

import (
	image_upload_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/image-upload"
	"github.com/gin-gonic/gin"
)

func ImageUploadRouter(
	v1JWTAuth gin.IRoutes,
	imageUploadController image_upload_controller.ImageUploadController,
) {
	v1JWTAuth.POST("/image-upload", imageUploadController.Post)
}
