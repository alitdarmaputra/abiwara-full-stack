package rating_controller

import (
	"net/http"

	rating_service "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business/rating"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/middleware"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"github.com/gin-gonic/gin"
)

type RatingControllerImpl struct {
	RatingService rating_service.RatingService
	Middleware    middleware.Authetication
}

func NewRatingController(
	ratingService rating_service.RatingService,
	middleware middleware.Authetication,
) RatingController {
	return &RatingControllerImpl{
		RatingService: ratingService,
		Middleware:    middleware,
	}
}

func (controller *RatingControllerImpl) CreateOrUpdate(ctx *gin.Context) {
	claims, err := controller.Middleware.ExtractJWTUser(ctx)
	utils.PanicIfError(err)

	ratingCreateOrUpdateRequest := request.RatingCreateOrUpdateRequest{}
	err = ctx.ShouldBindJSON(&ratingCreateOrUpdateRequest)
	utils.PanicIfError(err)

	controller.RatingService.CreateOrUpdate(ctx, claims.Id, ratingCreateOrUpdateRequest)
	response.JsonBasicResponse(ctx, http.StatusCreated, "Created")
}

func (controller *RatingControllerImpl) FindTotal(ctx *gin.Context) {
	ratingResponses := controller.RatingService.FindTotal(ctx)
	response.JsonBasicData(ctx, http.StatusOK, "OK", ratingResponses)
}

func (controller *RatingControllerImpl) FindTotalByBookId(ctx *gin.Context) {
	param := request.PathParam{}
	err := ctx.ShouldBindUri(&param)
	utils.PanicIfError(err)

	ratingResponse := controller.RatingService.FindTotalByBookId(ctx, param.Id)
	response.JsonBasicData(ctx, http.StatusOK, "OK", ratingResponse)
}
