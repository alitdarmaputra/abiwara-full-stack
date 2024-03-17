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
		userController.FindAll)

	v1JWTAuth.DELETE("/member/:id",
		middleware.PermissionMiddleware(constant.PermissionDeleteMember),
		userController.Delete)

	v1JWTAuth.PATCH("/member/:id",
		middleware.PermissionMiddleware(constant.PermissionEditMember),
		userController.UpdateRole)

	v1JWTAuth.GET(
		"/total-member",
		userController.GetTotal,
	)
}
