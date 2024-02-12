package request

type VerificationParam struct {
	VerificationCode string `uri:"verification_code" binding:"required"`
}
