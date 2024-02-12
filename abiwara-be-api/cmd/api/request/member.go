package request

type MemberCreateRequest struct {
	Email           string `json:"email"            binding:"required,email"`
	Password        string `json:"password"         binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
	Name            string `json:"name"             binding:"required"`
	Class           string `json:"class"            binding:"required"`
}

type MemberUpdateRequest struct {
	Name       string `json:"name"        binding:"required"`
	Class      string `json:"class"       binding:"required"`
	ProfileImg string `json:"profile_img"`
}

type MemberLoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordRequest struct {
	NewPassword     string `json:"new_password"     binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=NewPassword"`
}

type ResetTokenRequest struct {
	Email string `json:"email" binding:"required"`
}

type RedeemTokenRequest struct {
	NewPassword string `json:"new_password" binding:"required"`
	Token       string `json:"token"        binding:"required"`
}
