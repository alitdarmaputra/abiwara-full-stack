package router

import (
	user_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/user"
	"github.com/gin-gonic/gin"
)

func AuthRouter(
	v1 *gin.RouterGroup,
	userController user_controller.UserController,
) {
	v1.POST("/auth/login", userController.Login)
	v1.POST("/auth/register", userController.Register)
	v1.GET("/verifyemail/:verification_code", userController.VerifyEmail)
	v1.POST("/auth/reset-password", userController.ResetPassword)
	v1.PATCH("/auth/redeem-reset-token", userController.ReedemResetToken)
}
