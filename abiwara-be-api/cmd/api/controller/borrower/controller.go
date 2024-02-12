package borrower_controller

import "github.com/gin-gonic/gin"

type BorrowerController interface {
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	GetTotal(ctx *gin.Context)
}
