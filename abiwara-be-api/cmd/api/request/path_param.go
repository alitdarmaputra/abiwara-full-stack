package request

type PathParam struct {
	Id uint `uri:"id" binding:"required,numeric"`
}

type StringPathParam struct {
	Id string `uri:"id" binding:"required"`
}
