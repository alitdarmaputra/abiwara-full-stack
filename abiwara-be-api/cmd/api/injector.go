package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	book_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/book"
	borrower_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/borrower"
	category_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/category"
	image_upload_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/image-upload"
	rating_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/rating"
	user_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/user"
	visitor_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/visitor"
	book_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/book"
	borrower_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/borrower"
	category_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/category"
	image_upload_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/image-upload"
	rating_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/rating"
	user_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/user"
	visitor_controller "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/controller/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/router"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config/db"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config/imgkit"
	book_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/book"
	borrower_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/borrower"
	category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"
	rating_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/rating"
	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	token_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/token"
	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
	visitor_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/visitor"
	upload_image_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/image-upload"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/recommender"
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

	ik := imgkit.NewImgKit(&cfg.ImgKit)

	if cfg.Env == production {
		gin.SetMode(gin.ReleaseMode)
	}

	userRepository := user_repository.NewUserRepository()
	bookRepository := book_repository.NewBookRepository()
	roleRepository := role_repository.NewRoleRepository()
	resetTokenRepository := token_repository.NewTokenRepository()
	categoryRepository := category_repository.NewCategoryRepository()
	visitorRepository := visitor_repository.NewVisitorRepository()
	borrowerRepository := borrower_repository.NewBorrowerRepository()
	ratingRepository := rating_repository.NewRatingRepository()

	smtpService := smtp_service.NewSMTPService(cfg.SMTP)
	imageUploader := upload_image_service.NewImageUploader(ik)
	recommender := recommender.NewBookRecommender(cfg.Recommender.Token, cfg.Recommender.Url)

	authMiddleware := middleware.NewAuthentication(cfg.JWTSecretKey)
	permissionMiddleware := middleware.NewAuthorizationMiddleware(
		roleRepository,
		authMiddleware,
		db,
	)

	userService := user_service.NewUserService(
		userRepository,
		roleRepository,
		smtpService,
		resetTokenRepository,
		db,
		cfg,
	)
	userService.SetJWTConfig(cfg.JWTSecretKey, time.Duration(cfg.JWTExpiredTime)*time.Minute)
	bookService := book_service.NewBookService(db, recommender, bookRepository)
	categoryService := category_service.NewCategoryService(categoryRepository, db)
	visitorService := visitor_service.NewVisitorService(visitorRepository, db)
	borrowerService := borrower_service.NewBorrowerService(
		borrowerRepository,
		db,
		bookRepository,
		ratingRepository,
	)
	ratingService := rating_service.NewRatingService(ratingRepository, borrowerRepository, bookRepository, db)
	imageUploadService := image_upload_service.NewImageUploadService(imageUploader)

	bookController := book_controller.NewBookController(bookService)
	userController := user_controller.NewUserController(userService, authMiddleware)
	categoryController := category_controller.NewCategoryController(categoryService)
	visitorController := visitor_controller.NewVisitorController(visitorService, authMiddleware)
	borrowerController := borrower_controller.NewBorrowerController(borrowerService, authMiddleware)
	ratingController := rating_controller.NewRatingController(ratingService, authMiddleware)
	imageUploadController := image_upload_controller.NewImageUploadController(imageUploadService)

	handler := router.NewRouter(
		cfg,
		permissionMiddleware,
		userController,
		bookController,
		categoryController,
		visitorController,
		borrowerController,
		ratingController,
		imageUploadController,
	)

	server := http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: handler,
	}
	log.Println("server is listening on port :", cfg.Port)

	return &server
}
