package request

type PathParam struct {
	Id uint `uri:"id" binding:"required,numeric"`
}

type UserPathParam struct {
	Id string `uri:"id" binding:"required,numeric"`
}
