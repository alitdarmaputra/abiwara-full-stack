package router

import (
	book_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/book"
	borrower_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/borrower"
	category_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/category"
	member_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/member"
	rating_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/rating"
	visitor_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/gin-gonic/gin"
)

func NewRouter(
	cfg *config.Api,
	permissionMiddleware middleware.Authorization,
	memberController member_controller.MemberController,
	bookController book_controller.BookController,
	categoryController category_controller.CategoryController,
	visitorController visitor_controller.VisitorController,
	borrowerController borrower_controller.BorrowerController,
	ratingController rating_controller.RatingController,
) *gin.Engine {
	r := gin.New()
	r.Use(gin.CustomRecovery(middleware.ErrorHandler))
	r.Use(middleware.CORSMiddleware())
	r.Use(gin.Logger())

	api := r.Group("/api")
	v1 := api.Group("/v1")
	AuthRouter(v1, memberController)

	v1JWTAuth := v1.Use(middleware.JWTMiddlewareAuth(cfg.JWTSecretKey))

	MemberRouter(v1JWTAuth, permissionMiddleware, memberController)
	BookRouter(v1JWTAuth, permissionMiddleware, bookController)
	CategoryRouter(v1JWTAuth, categoryController)
	VisitorRouter(v1JWTAuth, permissionMiddleware, visitorController)
	BorrowerRouter(v1JWTAuth, permissionMiddleware, borrowerController)
	RatingRouter(v1JWTAuth, ratingController)

	return r
}
