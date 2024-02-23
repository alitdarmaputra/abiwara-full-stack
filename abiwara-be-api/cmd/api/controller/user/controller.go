package user_controller

import "github.com/gin-gonic/gin"

type UserController interface {
	Register(ctx *gin.Context)
	Update(ctx *gin.Context)
	Delete(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	GetProfile(ctx *gin.Context)
	VerifyEmail(ctx *gin.Context)
	Login(ctx *gin.Context)
	ChangePassword(ctx *gin.Context)
	ResetPassword(ctx *gin.Context)
	ReedemResetToken(ctx *gin.Context)
	GetTotal(ctx *gin.Context)
}
