package smtp_service

import user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"

type SmtpService interface {
	SendMail(user *user_repository.User, data *EmailData)
	SendResetToken(user *user_repository.User, data *EmailData)
}
