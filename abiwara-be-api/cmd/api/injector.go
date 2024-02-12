package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	book_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/book"
	borrower_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/borrower"
	category_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/category"
	member_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/member"
	rating_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/rating"
	visitor_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/visitor"
	book_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/book"
	borrower_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/borrower"
	category_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/category"
	member_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/member"
	rating_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/rating"
	visitor_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/router"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config/db"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	token_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/token"
	visitor_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/visitor"
	smtp_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/smtp"
	"github.com/gin-gonic/gin"
)

const (
	production = "production"
)

func InitializeServer() *http.Server {
	cfg := config.LoadConfigAPI("./config")

	db, err := db.NewMySQL(&cfg.Database)
	if err != nil {
		log.Fatalln(err.Error())
	}

	if cfg.Env == production {
		gin.SetMode(gin.ReleaseMode)
	}

	memberRepository := member_repository.NewMemberRepository()
	bookRepository := book_repository.NewBookRepository()
	roleRepository := role_repository.NewRoleRepository()
	resetTokenRepository := token_repository.NewTokenRepository()
	categoryRepository := category_repository.NewCategoryRepository()
	visitorRepository := visitor_repository.NewVisitorRepository()
	borrowerRepository := borrower_repository.NewBorrowerRepository()
	ratingRepository := rating_repository.NewRatingRepository()

	smtpService := smtp_service.NewSMTPService(cfg.SMTP)

	authMiddleware := middleware.NewAuthentication(cfg.JWTSecretKey)
	permissionMiddleware := middleware.NewAuthorizationMiddleware(
		roleRepository,
		authMiddleware,
		db,
	)

	memberService := member_service.NewMemberService(
		memberRepository,
		roleRepository,
		smtpService,
		resetTokenRepository,
		db,
		cfg,
	)
	memberService.SetJWTConfig(cfg.JWTSecretKey, time.Duration(cfg.JWTExpiredTime)*time.Minute)
	bookService := book_service.NewBookService(bookRepository, db)
	categoryService := category_service.NewCategoryService(categoryRepository, db)
	visitorService := visitor_service.NewVisitorService(visitorRepository, db)
	borrowerService := borrower_service.NewBorrowerService(
		borrowerRepository,
		db,
		bookRepository,
		ratingRepository,
	)
	ratingService := rating_service.NewRatingService(ratingRepository, borrowerRepository, db)

	bookController := book_controller.NewBookController(bookService)
	memberController := member_controller.NewMemberController(memberService, authMiddleware)
	categoryController := category_controller.NewCategoryController(categoryService)
	visitorController := visitor_controller.NewVisitorController(visitorService, authMiddleware)
	borrowerController := borrower_controller.NewBorrowerController(borrowerService, authMiddleware)
	ratingController := rating_controller.NewRatingController(ratingService, authMiddleware)

	handler := router.NewRouter(
		cfg,
		permissionMiddleware,
		memberController,
		bookController,
		categoryController,
		visitorController,
		borrowerController,
		ratingController,
	)

	server := http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: handler,
	}
	log.Println("server is listening on port :", cfg.Port)

	return &server
}
