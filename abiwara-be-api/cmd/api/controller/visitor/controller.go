package visitor_controller

import "github.com/gin-gonic/gin"

type VisitorController interface {
	Create(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	GetTotal(ctx *gin.Context)
}
