package middleware

import (
	"fmt"
	"net/http"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func ErrorHandler(ctx *gin.Context, err any) {
	if notFoundError(ctx, err) {
		return
	}

	if validationError(ctx, err) {
		return
	}

	if unauthorizedError(ctx, err) {
		return
	}

	if duplicateEntryError(ctx, err) {
		return
	}

	if badGateWayError(ctx, err) {
		return
	}

	if badRequestError(ctx, err) {
		return
	}

	internalServerError(ctx, err)
}

func notFoundError(ctx *gin.Context, err any) bool {
	execption, ok := err.(*business.NotFoundError)
	if ok {
		response.JsonBasicData(ctx, http.StatusNotFound, "Not found", execption.Error())
		return true
	} else {
		return false
	}
}

func validationError(ctx *gin.Context, err any) bool {
	exception, ok := err.(validator.ValidationErrors)
	if ok {
		var messages []string
		for _, fieldErr := range exception {
			messages = append(
				messages,
				fmt.Sprintf(
					"Validation error for field %s on tag %s",
					fieldErr.Field(),
					fieldErr.Tag(),
				),
			)
		}
		response.JsonErrorResponse(ctx, http.StatusBadRequest, "Bad request", messages)
		return true
	} else {
		return false
	}
}

func unauthorizedError(ctx *gin.Context, err any) bool {
	exception, ok := err.(*business.UnauthorizedError)
	if ok {
		response.JsonErrorResponse(ctx, http.StatusUnauthorized, "Unauthorized", exception.Error())
		return true
	} else {
		return false
	}
}

func internalServerError(ctx *gin.Context, err any) {
	// TODO: Custom logger
	response.JsonErrorResponse(
		ctx,
		http.StatusInternalServerError,
		"Internal server error",
		"Internal server error",
	)
}

func duplicateEntryError(ctx *gin.Context, err any) bool {
	exception, ok := err.(*business.DuplicateEntryError)
	if ok {
		response.JsonErrorResponse(ctx, http.StatusConflict, "Conflict", exception.Error())
		return true
	} else {
		return false
	}
}

func badGateWayError(ctx *gin.Context, err any) bool {
	exception, ok := err.(*business.BadGateWayError)
	if ok {
		response.JsonErrorResponse(ctx, http.StatusBadGateway, "Bad Gateway", exception.Error())
		return true
	} else {
		return false
	}
}

func badRequestError(ctx *gin.Context, err any) bool {
	exception, ok := err.(*business.BadRequestError)
	if ok {
		response.JsonErrorResponse(ctx, http.StatusBadRequest, "Bad Request", exception.Error())
		return true
	} else {
		return false
	}
}
