package router

import (
	book_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/book"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/gin-gonic/gin"
)

func BookRouter(
	v1JWTAuth gin.IRoutes,
	middleware middleware.Authorization,
	book book_controller.BookController,
) {
	v1JWTAuth.POST("/book",
		middleware.PermissionMiddleware(constant.PermissionCreateBook),
		book.Create,
	)
	v1JWTAuth.PUT("/book/:id",
		middleware.PermissionMiddleware(constant.PermissionUpdateBook),
		book.Update,
	)
	v1JWTAuth.DELETE("/book/:id",
		middleware.PermissionMiddleware(constant.PermissionDeleteBook),
		book.Delete,
	)
	v1JWTAuth.GET("/book-file",
		middleware.PermissionMiddleware(constant.PermissionShowBook),
		book.GetFile,
	)
}
