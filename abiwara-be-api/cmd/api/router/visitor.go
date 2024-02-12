package router

import (
	visitor_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/gin-gonic/gin"
)

func VisitorRouter(
	v1JWTAuth gin.IRoutes,
	middleware middleware.Authorization,
	visitorController visitor_controller.VisitorController,
) {
	v1JWTAuth.GET(
		"/visitor",
		middleware.PermissionMiddleware(constant.PermissionShowVisitor),
		visitorController.FindAll,
	)
	v1JWTAuth.POST("/visitor",
		middleware.PermissionMiddleware(constant.PermissionCreateVisitor),
		visitorController.Create,
	)
	v1JWTAuth.GET("/total-visitor",
		middleware.PermissionMiddleware(constant.PermissionShowVisitor),
		visitorController.GetTotal)
}
