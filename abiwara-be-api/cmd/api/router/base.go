package router

import (
	book_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/book"
	borrower_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/borrower"
	category_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/category"
	image_upload_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/image-upload"
	rating_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/rating"
	user_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/user"
	visitor_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/gin-gonic/gin"
)

func NewRouter(
	cfg *config.Api,
	permissionMiddleware middleware.Authorization,
	userController user_controller.UserController,
	bookController book_controller.BookController,
	categoryController category_controller.CategoryController,
	visitorController visitor_controller.VisitorController,
	borrowerController borrower_controller.BorrowerController,
	ratingController rating_controller.RatingController,
	imageUploadController image_upload_controller.ImageUploadController,
) *gin.Engine {
	r := gin.New()
	r.Use(gin.CustomRecovery(middleware.ErrorHandler))
	r.Use(middleware.CORSMiddleware())
	r.Use(gin.Logger())

	api := r.Group("/api")
	v1 := api.Group("/v1")
	AuthRouter(v1, userController)

	v1.GET("/health-check", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	v1JWTAuth := v1.Use(middleware.JWTMiddlewareAuth(cfg.JWTSecretKey))

	UserRouter(v1JWTAuth, permissionMiddleware, userController)
	BookRouter(v1JWTAuth, permissionMiddleware, bookController)
	CategoryRouter(v1JWTAuth, categoryController)
	VisitorRouter(v1JWTAuth, permissionMiddleware, visitorController)
	BorrowerRouter(v1JWTAuth, permissionMiddleware, borrowerController)
	RatingRouter(v1JWTAuth, ratingController)
	ImageUploadRouter(v1JWTAuth, imageUploadController)

	return r
}
