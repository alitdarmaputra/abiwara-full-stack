package router

import (
	user_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/user"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/gin-gonic/gin"
)

func UserRouter(
	v1JWTAuth gin.IRoutes,
	middleware middleware.Authorization,
	userController user_controller.UserController,
) {
	v1JWTAuth.GET("/user/me", userController.GetProfile)
	v1JWTAuth.PUT("/user/me", userController.Update)

	v1JWTAuth.GET("/member",
		middleware.PermissionMiddleware(constant.PermissionShowMember),
		userController.FindAll)

	v1JWTAuth.GET(
		"/total-member",
		middleware.PermissionMiddleware(constant.PermissionShowMember),
		userController.GetTotal,
	)
}
