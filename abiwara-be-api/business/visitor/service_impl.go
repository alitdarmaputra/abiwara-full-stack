package visitor_service

import (
	"context"
	"time"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	visitor_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/visitor"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type VisitorServiceImpl struct {
	DB                *gorm.DB
	VisitorRepository visitor_repository.VisitorRepository
}

func NewVisitorService(
	visitorRepository visitor_repository.VisitorRepository,
	db *gorm.DB,
) VisitorService {
	return &VisitorServiceImpl{
		DB:                db,
		VisitorRepository: visitorRepository,
	}
}

func (service *VisitorServiceImpl) Create(
	ctx context.Context,
	request request.VisitorCreateRequest,
	userId string,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	if time.Now().Hour() < 7 || time.Now().Hour() > 13 || time.Now().Weekday() == time.Sunday {
		panic(business.NewBadRequestError("Invalid check in time"))
	}

	param := visitor_repository.Visitor{}
	param.Name = request.Name

	visitor, err := service.VisitorRepository.FindOne(ctx, tx, param)
	if err != nil {
		// Create if user still not check in at the same day
		_, ok := err.(*business.NotFoundError)

		if ok {
			visitor = visitor_repository.Visitor{}
			visitor.VisitTime = time.Now()
			visitor.Name = request.Name
			visitor.Class = request.Class
			visitor.PIC = request.PIC
			visitor.Description = request.Description
			visitor.UserId = userId

			visitor, err = service.VisitorRepository.Save(ctx, tx, visitor)
			utils.PanicIfError(err)
		} else {
			panic(err)
		}
	}
}

func (service *VisitorServiceImpl) FindAll(
	ctx context.Context,
	page, perPage int,
	querySearch string,
	roleId uint,
	userId string,
	startDate,
	endDate *time.Time,
) ([]response.VisitorResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	param := visitor_repository.Visitor{}
	visitors := []visitor_repository.Visitor{}
	total := 0

	if roleId == 1 || roleId == 2 {
		visitors, total = service.VisitorRepository.FindAll(
			ctx,
			tx,
			utils.CountOffset(page, perPage),
			perPage,
			querySearch,
			param,
			startDate,
			endDate,
		)
	} else {
		param.UserId = userId
		visitors, total = service.VisitorRepository.FindAll(ctx, tx, utils.CountOffset(page, perPage), perPage, querySearch, param, startDate, endDate)
	}

	return response.ToVisitorResponses(visitors), common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     total,
		TotalPage: utils.CountTotalPage(total, perPage),
	}
}

func (service *VisitorServiceImpl) GetTotal(
	ctx context.Context,
	startDate, endDate time.Time,
) []response.TotalVisitorResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	totalVisitors := service.VisitorRepository.GetTotal(ctx, tx, startDate, endDate)

	return response.ToTotalVisitorResponse(totalVisitors)
}
