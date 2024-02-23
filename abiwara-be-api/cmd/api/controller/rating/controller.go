package rating_controller

import "github.com/gin-gonic/gin"

type RatingController interface {
	CreateOrUpdate(ctx *gin.Context)
}
