package image_upload_controller

import (
	"context"
	"io"
	"net/http"
	"path"
	"strconv"

	image_upload_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/image-upload"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ImageUploadControllerImpl struct {
	ImageUploadService image_upload_service.ImageUploadService
}

func NewImageUploadController(imageUploadService image_upload_service.ImageUploadService) ImageUploadController {
	return &ImageUploadControllerImpl{
		ImageUploadService: imageUploadService,
	}
}

func (controller *ImageUploadControllerImpl) Post(ctx *gin.Context) {
	fileHeader, _ := ctx.FormFile("image")

	if fileHeader.Size > (4 << 20) {
		response.JsonErrorResponse(ctx, http.StatusBadRequest, "Bad Request", strconv.FormatInt(fileHeader.Size, 10)+" size are exceed file size 4 MiB")
		return
	}

	file, err := fileHeader.Open()
	utils.PanicIfError(err)
	defer file.Close()

	byteImage, err := io.ReadAll(file)
	utils.PanicIfError(err)

	mimeType := http.DetectContentType(byteImage)
	if (mimeType != "image/png") && (mimeType != "image/jpeg") {
		response.JsonErrorResponse(ctx, http.StatusBadRequest, "Bad Request", "File type not supported")
		return
	}

	fileName := uuid.NewString() + path.Ext(fileHeader.Filename)

	imageUploadResp, err := controller.ImageUploadService.Post(context.Background(), byteImage, fileName)
	utils.PanicIfError(err)

	response.JsonBasicData(ctx, http.StatusOK, "OK", imageUploadResp)
}

func (controller *ImageUploadControllerImpl) Delete(ctx *gin.Context) {
	param := request.StringPathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	controller.ImageUploadService.Delete(ctx, param.Id)
	response.JsonBasicResponse(ctx, http.StatusOK, "OK")
}
