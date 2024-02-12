package smtp_service

import member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"

type SmtpService interface {
	SendMail(member *member_repository.Member, data *EmailData)
	SendResetToken(member *member_repository.Member, data *EmailData)
}
