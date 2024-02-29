package user_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	token_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/token"
	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
	smtp_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/smtp"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	defaultSecretKey  = "default-secret-key"
	defaultJWTExpired = 24 * time.Hour
)

type UserServiceImpl struct {
	UserRepository  user_repository.UserRepository
	RoleRepository  role_repository.RoleRepository
	TokenRepository token_repository.TokenRepository
	SmtpService     smtp_service.SmtpService
	DB              *gorm.DB
	jwtSecretKey    string
	jwtExpired      time.Duration
	cfg             *config.Api
}

func NewUserService(
	userRepository user_repository.UserRepository,
	roleRepository role_repository.RoleRepository,
	smtpService smtp_service.SmtpService,
	resetTokenRepository token_repository.TokenRepository,
	db *gorm.DB,
	cfg *config.Api,
) UserService {
	return &UserServiceImpl{
		UserRepository:  userRepository,
		RoleRepository:  roleRepository,
		TokenRepository: resetTokenRepository,
		SmtpService:     smtpService,
		DB:              db,
		jwtSecretKey:    defaultSecretKey,
		jwtExpired:      defaultJWTExpired,
		cfg:             cfg,
	}
}

func (service *UserServiceImpl) SetJWTConfig(secret string, expired time.Duration) {
	service.jwtSecretKey = secret
	service.jwtExpired = expired
}

func (service *UserServiceImpl) Create(
	ctx context.Context,
	request request.UserCreateRequest,
) {
	var user user_repository.User

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	// Check if user has register but not verified

	user, err := service.UserRepository.FindOne(ctx, tx, request.Email, "")
	if err != nil {
		_, ok := err.(*business.NotFoundError)

		if ok {
			user = user_repository.User{}
		} else {
			panic(err)
		}
	}

	if user.IsVerified {
		panic(business.NewDuplicateEntryError("User exist"))
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.MinCost)
	utils.PanicIfError(err)

	role, err := service.RoleRepository.FindOne(ctx, tx, constant.MEMBER)
	utils.PanicIfError(err)

	user.ID = uuid.New().String()
	user.Email = request.Email
	user.Password = string(hash)
	user.Class = request.Class
	user.Role = role
	user.Name = request.Name

	user, err = service.UserRepository.SaveOrUpdate(ctx, tx, user)
	utils.PanicIfError(err)

	token, err := service.GenerateToken(user)
	utils.PanicIfError(err)

	data := smtp_service.EmailData{
		Name:    user.Name,
		URL:     service.cfg.SMTP.ClientOrigin + "/register/verification/" + token,
		Subject: "Verifikasi Email Abiwara App SMP Negeri 3 Kediri",
	}
	service.SmtpService.SendMail(&user, &data)
}

func (service *UserServiceImpl) Update(
	ctx context.Context,
	request request.UserUpdateRequest,
	userId string,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindById(ctx, tx, userId)
	utils.PanicIfError(err)

	user.Name = request.Name
	user.Class = request.Class
	user.ProfileImg = &request.ProfileImg

	user, err = service.UserRepository.Update(ctx, tx, user)
	utils.PanicIfError(err)
}

func (service *UserServiceImpl) Delete(ctx context.Context, userId string, currUser string) {
	if userId != currUser {
		panic(business.NewUnauthorizedError("Unauthorized user"))
	}

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindById(ctx, tx, userId)
	utils.PanicIfError(err)

	err = service.UserRepository.Delete(ctx, tx, user.ID)
	utils.PanicIfError(err)
}

func (service *UserServiceImpl) FindById(
	ctx context.Context,
	userId string,
) response.UserResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindById(ctx, tx, userId)
	utils.PanicIfError(err)

	return response.ToUserResponse(user)
}

func (service *UserServiceImpl) FindAll(
	ctx context.Context,
	page, perPage int,
	querySearch string,
) ([]response.UserResponse, common_response.Meta) {
	offset := utils.CountOffset(page, perPage)

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	users, count := service.UserRepository.FindAll(ctx, tx, offset, perPage, querySearch)

	meta := common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     count,
		TotalPage: utils.CountTotalPage(count, perPage),
	}
	return response.ToUserResponses(users), meta
}

func (service *UserServiceImpl) Login(
	ctx context.Context,
	request request.UserLoginRequest,
) *Token {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindOne(ctx, tx, request.Email, "")
	if errors.Is(err, gorm.ErrRecordNotFound) {
		panic(business.NewUnauthorizedError("Incorrect email and password entered"))
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		panic(business.NewUnauthorizedError("Incorrect email and password entered"))
	}

	token, err := service.GenerateToken(user)
	utils.PanicIfError(err)

	return &Token{
		Token: token,
	}
}

func (service *UserServiceImpl) GenerateToken(user user_repository.User) (string, error) {
	eJWT := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":   user.ID,
			"exp":  time.Now().Add(service.jwtExpired).Unix(),
			"role": user.RoleId,
		},
	)

	return eJWT.SignedString([]byte(service.jwtSecretKey))
}

func (service *UserServiceImpl) ChangePassword(
	ctx context.Context,
	request request.ChangePasswordRequest,
	userId string,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindById(ctx, tx, userId)
	utils.PanicIfError(err)

	hash, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.MinCost)
	utils.PanicIfError(err)

	user.Password = string(hash)

	_, err = service.UserRepository.Update(ctx, tx, user)
	utils.PanicIfError(err)
}

func (service *UserServiceImpl) VerifyEmail(
	ctx context.Context,
	verificationCode string,
) {
	// Deocde token
	if verificationCode == "" {
		panic(business.NewBadRequestError("Invalid URL"))
	}

	token, err := jwt.Parse(verificationCode, func(t *jwt.Token) (interface{}, error) {
		if method, ok := t.Method.(*jwt.SigningMethodHMAC); !ok ||
			method != jwt.SigningMethodHS256 {
			return nil, errors.New("Signing method invalid")
		}

		return []byte(service.jwtSecretKey), nil
	})
	if err != nil {
		panic(business.NewUnauthorizedError(err.Error()))
	}

	claims := token.Claims.(jwt.MapClaims)
	res := new(middleware.Token)
	buff := new(bytes.Buffer)
	json.NewEncoder(buff).Encode(&claims)
	json.NewDecoder(buff).Decode(&res)

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindUnverifiedById(ctx, tx, res.Id)
	utils.PanicIfError(err)

	user.IsVerified = true

	_, err = service.UserRepository.Update(ctx, tx, user)
	utils.PanicIfError(err)
}

func (service *UserServiceImpl) SendResetToken(
	ctx context.Context,
	request request.ResetTokenRequest,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	// check if user exist
	user, err := service.UserRepository.FindOne(ctx, tx, request.Email, "")
	utils.PanicIfError(err)
	// generate reset token
	token := utils.RandStringRunes(30)

	// store token in database
	resetToken := token_repository.Token{
		UserId:      user.ID,
		Token:       token,
		TokenExpiry: time.Now().Add(time.Minute * time.Duration(service.cfg.ResetTokenExpiredTime)),
	}

	service.TokenRepository.Save(ctx, tx, resetToken)

	// send email with password reset link
	data := smtp_service.EmailData{
		Name:    user.Name,
		URL:     service.cfg.SMTP.ClientOrigin + "/reset-password/" + resetToken.Token,
		Subject: "Reset Password Abiwara App SMP Negeri 3 Kediri",
	}
	service.SmtpService.SendResetToken(&user, &data)
}

func (service *UserServiceImpl) RedeemToken(
	ctx context.Context,
	request request.RedeemTokenRequest,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	token, err := service.TokenRepository.FindByToken(ctx, tx, request.Token)
	utils.PanicIfError(err)

	if time.Now().After(token.TokenExpiry) {
		panic(business.NewUnauthorizedError("Invalid token"))
	}

	user, err := service.UserRepository.FindById(ctx, tx, token.UserId)
	if err != nil {
		return
	}

	service.TokenRepository.DeleteAllByUserId(ctx, tx, user.ID)

	hash, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.MinCost)
	utils.PanicIfError(err)

	user.Password = string(hash)

	_, err = service.UserRepository.Update(ctx, tx, user)
	utils.PanicIfError(err)
}

func (service *UserServiceImpl) GetTotal(ctx context.Context) response.TotalUserResponse {
	var res response.TotalUserResponse
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	res.Total = service.UserRepository.GetTotal(ctx, tx)
	return res
}
