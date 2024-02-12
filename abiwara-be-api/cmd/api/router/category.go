package router

import (
	category_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/category"
	"github.com/gin-gonic/gin"
)

func CategoryRouter(v1JwtAuth gin.IRoutes, CategoryController category_controller.CategoryController) {
	v1JwtAuth.GET("/category", CategoryController.FindAll)
}
