package request

type VisitorCreateRequest struct {
	Name        string `json:"name"        binding:"required"`
	Class       string `json:"class"       binding:"required"`
	PIC         string `json:"pic"`
	Description string `json:"description"`
}

type VisitorGetAllRequest struct {
	StartDate string `form:"start_date" time_format:"2006-02-01"`
	EndDate   string `form:"end_date"   time_format:"2006-02-01"`
}
