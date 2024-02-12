package category_controller

import "github.com/gin-gonic/gin"

type CategoryController interface {
    FindAll(ctx *gin.Context)
}
