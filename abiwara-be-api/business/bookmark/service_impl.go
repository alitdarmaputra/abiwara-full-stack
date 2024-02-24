package bookmark_service

import (
	common_response "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/common/response"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/request"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/cmd/api/response"
	bookmark_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/bookmark"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"golang.org/x/net/context"
	"gorm.io/gorm"
)

type BookmarkServiceImpl struct {
	BookmarkRepository bookmark_repository.BookmarkRepository
	DB                 *gorm.DB
}

func NewBookmarkService(bookmarkRepository bookmark_repository.BookmarkRepository, db *gorm.DB) BookmarkService {
	return &BookmarkServiceImpl{
		BookmarkRepository: bookmarkRepository,
		DB:                 db,
	}
}

func (service *BookmarkServiceImpl) Create(
	ctx context.Context,
	request request.BookmarkCreateRequest,
	userId string,
) {
	bookmark := bookmark_repository.Bookmark{
		BookId: request.BookId,
		UserId: userId,
	}
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	_, err := service.BookmarkRepository.Save(ctx, tx, bookmark)
	utils.PanicIfError(err)
}

func (service *BookmarkServiceImpl) Delete(
	ctx context.Context,
	bookId uint,
) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	err := service.BookmarkRepository.Delete(ctx, tx, bookId)
	utils.PanicIfError(err)
}

func (service *BookmarkServiceImpl) FindAll(
	ctx context.Context,
	page int,
	perPage int,
	userId string,
	search string,
) ([]response.BookmarkResponse, common_response.Meta) {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	bookmarks, total := service.BookmarkRepository.FindAll(
		ctx,
		tx,
		utils.CountOffset(page, perPage),
		perPage,
		userId,
		search,
	)

	return response.ToBookmarkResponses(bookmarks), common_response.Meta{
		Page:      page,
		PerPage:   perPage,
		Total:     total,
		TotalPage: utils.CountTotalPage(total, perPage),
	}
}

func (service *BookmarkServiceImpl) FindByBookId(ctx context.Context, userId string, bookId uint) response.BookmarkResponse {
	tx := service.DB.Begin()
	defer utils.CommitOrRollBack(tx)

	bookmark, err := service.BookmarkRepository.FindByBookId(ctx, tx, userId, bookId)
	utils.PanicIfError(err)

	return response.ToBookmarkResponse(bookmark)
}
