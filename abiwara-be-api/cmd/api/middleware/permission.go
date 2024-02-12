package middleware

import (
	"net/http"

	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Authorization interface {
	PermissionMiddleware(permissions ...string) gin.HandlerFunc
}

type AuthorizationImpl struct {
	RoleRepository role_repository.RoleRepository
	DB             *gorm.DB
	Authentication Authetication
}

func NewAuthorizationMiddleware(
	roleRepository role_repository.RoleRepository,
	authentication Authetication,
	db *gorm.DB,
) Authorization {
	return &AuthorizationImpl{
		RoleRepository: roleRepository,
		DB:             db,
		Authentication: authentication,
	}
}

func (middleware *AuthorizationImpl) PermissionMiddleware(
	permissions ...string,
) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, err := middleware.Authentication.ExtractJWTUser(ctx)
		if err != nil {
			ctx.AbortWithStatusJSON(
				http.StatusUnauthorized,
				ErrResponse{
					Code:    http.StatusUnauthorized,
					Status:  "Unauthorized",
					Message: "Permissions not found",
				},
			)
			return
		}

		tx := middleware.DB.Begin()
		defer utils.CommitOrRollBack(tx)

		role, err := middleware.RoleRepository.FindById(ctx, tx, token.RoleId)
		utils.PanicIfError(err)

		counter := 0
		for _, permission := range permissions {
			for _, rolePermission := range role.Permissions {
				if permission == rolePermission.Name {
					counter++
					break
				}
			}
		}

		if counter != len(permissions) {
			ctx.AbortWithStatusJSON(
				http.StatusUnauthorized,
				ErrResponse{
					Code:    http.StatusUnauthorized,
					Status:  "Unauthorized",
					Message: "Permissions not found",
				},
			)
			return
		}

		ctx.Next()
	}
}
