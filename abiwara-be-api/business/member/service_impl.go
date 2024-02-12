package member_service

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
	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
	token_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/token"
	smtp_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/smtp"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	defaultSecretKey  = "default-secret-key"
	defaultJWTExpired = 24 * time.Hour
)

type MemberServiceImpl struct {
	MemberRepository member_repository.MemberRepository
	RoleRepository   role_repository.RoleRepository
	TokenRepository  token_repository.TokenRepository
	SmtpService      smtp_service.SmtpService
	DB               *gorm.DB
	jwtSecretKey     string
	jwtExpired       time.Duration
	cfg              *config.Api
}

func NewMemberService(
	memberRepository member_repository.MemberRepository,
	roleRepository role_repository.RoleRepository,
	smtpService smtp_service.SmtpService,
	resetTokenRepository token_repository.TokenRepository,
	db *gorm.DB,
	cfg *config.Api,
) MemberService {
	return &MemberServiceImpl{
		MemberRepository: memberRepository,
		RoleRepository:   roleRepository,
		TokenRepository:  resetTokenRepository,
		SmtpService:      smtpService,
		DB:               db,
		jwtSecretKey:     defaultSecretKey,
		jwtExpired:       defaultJWTExpired,
		cfg:              cfg,
	}
}

func (service *MemberServiceImpl) SetJWTConfig(secret string, expired time.Duration) {
	service.jwtSecretKey = secret
	service.jwtExpired = expired
}

func (service *MemberServiceImpl) Create(
	ctx context.Context,
	request request.MemberCreateRequest,
) {
	var member member_repository.Member

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	// Check if member has register but not verified

	member, err := service.MemberRepository.FindOne(ctx, tx, request.Email, "")
	if err != nil {
		_, ok := err.(*business.NotFoundError)

		if ok {
			member = member_repository.Member{}
		} else {
			panic(err)
		}
	}

	if member.IsVerified {
		panic(business.NewDuplicateEntryError("Member exist"))
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.MinCost)
	utils.PanicIfError(err)

	role, err := service.RoleRepository.FindOne(ctx, tx, constant.MEMBER)
	utils.PanicIfError(err)

	member.Email = request.Email
	member.Password = string(hash)
	member.Class = request.Class
	member.Role = role
	member.Name = request.Name
	member.ProfileImg = "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"

	member, err = service.MemberRepository.SaveOrUpdate(ctx, tx, member)
	utils.PanicIfError(err)

	token, err := service.GenerateToken(member)
	utils.PanicIfError(err)

	data := smtp_service.EmailData{
		Name:    member.Name,
		URL:     service.cfg.SMTP.ClientOrigin + "/register/verification/" + token,
		Subject: "Verifikasi Email Abiwara App SMP Negeri 3 Kediri",
	}
	service.SmtpService.SendMail(&member, &data)
}

func (service *MemberServiceImpl) Update(
	ctx context.Context,
	request request.MemberUpdateRequest,
	memberId uint,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	member, err := service.MemberRepository.FindById(ctx, tx, memberId)
	utils.PanicIfError(err)

	member.Name = request.Name
	member.Class = request.Class
	member.ProfileImg = request.ProfileImg

	member, err = service.MemberRepository.Update(ctx, tx, member)
	utils.PanicIfError(err)
}

func (service *MemberServiceImpl) Delete(ctx context.Context, memberId uint, currMember uint) {
	if memberId != currMember {
		panic(business.NewUnauthorizedError("Unauthorized member"))
	}

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	member, err := service.MemberRepository.FindById(ctx, tx, memberId)
	utils.PanicIfError(err)

	err = service.MemberRepository.Delete(ctx, tx, member.ID)
	utils.PanicIfError(err)
}

func (service *MemberServiceImpl) FindById(
	ctx context.Context,
	memberId uint,
) response.MemberResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	member, err := service.MemberRepository.FindById(ctx, tx, memberId)
	utils.PanicIfError(err)

	return response.ToMemberResponse(member)
}

func (service *MemberServiceImpl) FindAll(
	ctx context.Context,
	page, perPage int,
	querySearch string,
) ([]response.MemberResponse, common_response.Meta) {
	offset := utils.CountOffset(page, perPage)

	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	members, count := service.MemberRepository.FindAll(ctx, tx, offset, perPage, querySearch)

	meta := common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     count,
		TotalPage: utils.CountTotalPage(count, perPage),
	}
	return response.ToMemberResponses(members), meta
}

func (service *MemberServiceImpl) Login(
	ctx context.Context,
	request request.MemberLoginRequest,
) *Token {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	member, err := service.MemberRepository.FindOne(ctx, tx, request.Email, "")
	if errors.Is(err, gorm.ErrRecordNotFound) {
		panic(business.NewUnauthorizedError("Incorrect email and password entered"))
	}

	if err := bcrypt.CompareHashAndPassword([]byte(member.Password), []byte(request.Password)); err != nil {
		panic(business.NewUnauthorizedError("Incorrect email and password entered"))
	}

	token, err := service.GenerateToken(member)
	utils.PanicIfError(err)

	return &Token{
		Token: token,
	}
}

func (service *MemberServiceImpl) GenerateToken(member member_repository.Member) (string, error) {
	eJWT := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":   member.ID,
			"exp":  time.Now().Add(service.jwtExpired).Unix(),
			"role": member.RoleId,
		},
	)

	return eJWT.SignedString([]byte(service.jwtSecretKey))
}

func (service *MemberServiceImpl) ChangePassword(
	ctx context.Context,
	request request.ChangePasswordRequest,
	memberId uint,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	member, err := service.MemberRepository.FindById(ctx, tx, memberId)
	utils.PanicIfError(err)

	hash, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.MinCost)
	utils.PanicIfError(err)

	member.Password = string(hash)

	_, err = service.MemberRepository.Update(ctx, tx, member)
	utils.PanicIfError(err)
}

func (service *MemberServiceImpl) VerifyEmail(
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

	member, err := service.MemberRepository.FindUnverifiedById(ctx, tx, res.Id)
	utils.PanicIfError(err)

	member.IsVerified = true

	_, err = service.MemberRepository.Update(ctx, tx, member)
	utils.PanicIfError(err)
}

func (service *MemberServiceImpl) SendResetToken(
	ctx context.Context,
	request request.ResetTokenRequest,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	// check if member exist
	member, err := service.MemberRepository.FindOne(ctx, tx, request.Email, "")
	utils.PanicIfError(err)
	// generate reset token
	token := utils.RandStringRunes(30)

	// store token in database
	resetToken := token_repository.Token{
		MemberId:    member.ID,
		Token:       token,
		TokenExpiry: time.Now().Add(time.Minute * time.Duration(service.cfg.ResetTokenExpiredTime)),
	}

	service.TokenRepository.Save(ctx, tx, resetToken)

	// send email with password reset link
	data := smtp_service.EmailData{
		Name:    member.Name,
		URL:     service.cfg.SMTP.ClientOrigin + "/reset-password/" + resetToken.Token,
		Subject: "Reset Password Abiwara App SMP Negeri 3 Kediri",
	}
	service.SmtpService.SendResetToken(&member, &data)
}

func (service *MemberServiceImpl) RedeemToken(
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

	member, err := service.MemberRepository.FindById(ctx, tx, token.MemberId)
	if err != nil {
		return
	}

	service.TokenRepository.DeleteAllByUserId(ctx, tx, member.ID)

	hash, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.MinCost)
	utils.PanicIfError(err)

	member.Password = string(hash)

	_, err = service.MemberRepository.Update(ctx, tx, member)
	utils.PanicIfError(err)
}

func (service *MemberServiceImpl) GetTotal(ctx context.Context) response.TotalMemberResponse {
	var res response.TotalMemberResponse
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	res.Total = service.MemberRepository.GetTotal(ctx, tx)
	return res
}
