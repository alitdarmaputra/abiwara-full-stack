package middleware

type ErrResponse struct {
	Code    uint16 `json:"code"`
	Status  string `json:"status"`
	Message string `json:"message"`
}
