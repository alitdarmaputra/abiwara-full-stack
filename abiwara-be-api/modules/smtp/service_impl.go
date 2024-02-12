package smtp_service

import (
	"bytes"
	"crypto/tls"
	"path"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/k3a/html2text"
	"gopkg.in/gomail.v2"
)

type SMTPServiceImpl struct {
	cfg config.SMTP
}

func NewSMTPService(cfg config.SMTP) SmtpService {
	return &SMTPServiceImpl{
		cfg: cfg,
	}
}

func (service *SMTPServiceImpl) SendMail(member *member_repository.Member, data *EmailData) {
	from := service.cfg.EmailFrom
	smtpPass := service.cfg.Password
	smtpUser := service.cfg.Username
	to := member.Email
	smtpHost := service.cfg.Host
	smtpPort := service.cfg.Port

	var body bytes.Buffer
	template, err := utils.ParseTemplateDir(path.Join("modules", "smtp", "templates"))
	utils.PanicIfError(err)
	template.ExecuteTemplate(&body, "verification_code", data)

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", data.Subject)
	m.SetBody("text/html", body.String())
	m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	err = d.DialAndSend(m)
	if err != nil {
		panic(business.NewBadGateWayError(err.Error()))
	}
}

func (service *SMTPServiceImpl) SendResetToken(member *member_repository.Member, data *EmailData) {
	from := service.cfg.EmailFrom
	smtpPass := service.cfg.Password
	smtpUser := service.cfg.Username
	to := member.Email
	smtpHost := service.cfg.Host
	smtpPort := service.cfg.Port

	var body bytes.Buffer
	template, err := utils.ParseTemplateDir(path.Join("modules", "smtp", "templates"))
	utils.PanicIfError(err)
	template.ExecuteTemplate(&body, "reset_code", data)

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", data.Subject)
	m.SetBody("text/html", body.String())
	m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	err = d.DialAndSend(m)
	if err != nil {
		panic(business.NewBadGateWayError(err.Error()))
	}
}
