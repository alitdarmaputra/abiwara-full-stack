package router

import (
	borrower_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/borrower"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/gin-gonic/gin"
)

func BorrowerRouter(
	v1JwtAuth gin.IRoutes,
	middleware middleware.Authorization,
	borrowerController borrower_controller.BorrowerController,
) {
	v1JwtAuth.POST(
		"/borrower",
		middleware.PermissionMiddleware(constant.PermissionCreateBorrower),
		borrowerController.Create,
	)

	v1JwtAuth.GET(
		"/borrower",
		middleware.PermissionMiddleware(constant.PermissionShowBorrower),
		borrowerController.FindAll,
	)

	v1JwtAuth.PUT(
		"/borrower/:id",
		middleware.PermissionMiddleware(constant.PermissionUpdateBorrower),
		borrowerController.Update,
	)

	v1JwtAuth.GET(
		"/total-borrower",
		middleware.PermissionMiddleware(constant.PermissionShowBorrower),
		borrowerController.GetTotal,
	)
}
