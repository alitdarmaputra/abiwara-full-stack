package router

import (
	member_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/member"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/gin-gonic/gin"
)

func MemberRouter(
	v1JWTAuth gin.IRoutes,
	middleware middleware.Authorization,
	memberController member_controller.MemberController,
) {
	v1JWTAuth.GET("/member/me", memberController.GetProfile)
	v1JWTAuth.PUT("/member/me", memberController.Update)

	v1JWTAuth.GET("/member",
		middleware.PermissionMiddleware(constant.PermissionShowMember),
		memberController.FindAll)

	v1JWTAuth.GET(
		"/total-member",
		middleware.PermissionMiddleware(constant.PermissionShowMember),
		memberController.GetTotal,
	)
}
