package router

import (
	member_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/member"
	"github.com/gin-gonic/gin"
)

func AuthRouter(
	v1 *gin.RouterGroup,
	memberController member_controller.MemberController,
) {
	v1.POST("/auth/login", memberController.Login)
	v1.POST("/auth/register", memberController.Register)
	v1.GET("/verifyemail/:verification_code", memberController.VerifyEmail)
	v1.POST("/auth/reset-password", memberController.ResetPassword)
	v1.PATCH("/auth/redeem-reset-token", memberController.ReedemResetToken)
}
