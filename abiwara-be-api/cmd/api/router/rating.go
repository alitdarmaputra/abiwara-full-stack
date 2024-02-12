package router

import (
	rating_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/rating"
	"github.com/gin-gonic/gin"
)

func RatingRouter(
	v1JWTAuth gin.IRoutes,
	ratingController rating_controller.RatingController,
) {
	v1JWTAuth.POST("/rating", ratingController.CreateOrUpdate)
	v1JWTAuth.GET("/rating", ratingController.FindTotal)
	v1JWTAuth.GET("/rating/:id", ratingController.FindTotalByBookId)
}
