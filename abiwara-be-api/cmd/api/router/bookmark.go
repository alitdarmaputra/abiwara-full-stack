package router

import (
	bookmark_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/bookmark"
	"github.com/gin-gonic/gin"
)

func BookmarkRouter(
	v1JWTAuth gin.IRoutes,
	bookmark bookmark_controller.BookmarkController,
) {
	v1JWTAuth.POST("/bookmark", bookmark.Create)
	v1JWTAuth.GET("/bookmark", bookmark.FindAll)
	v1JWTAuth.GET("/bookmark/:id", bookmark.FindByBookId)
	v1JWTAuth.DELETE("/bookmark/:id", bookmark.Delete)
}
