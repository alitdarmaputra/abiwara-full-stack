package book_controller

import "github.com/gin-gonic/gin"

type BookController interface {
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	Delete(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	FindById(ctx *gin.Context)
	GetFile(ctx *gin.Context)
	GetRecommendation(ctx *gin.Context)
	BulkCreate(ctx *gin.Context)
	BulkCreateFile(ctx *gin.Context)
}
