package bookmark_controller

import "github.com/gin-gonic/gin"

type BookmarkController interface {
	Create(ctx *gin.Context)
	Delete(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	FindByBookId(ctx *gin.Context)
}
