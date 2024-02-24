package response

import (
	bookmark_respository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/bookmark"
)

type BookmarkResponse struct {
	ID   uint         `json:"id"`
	Book BookResponse `json:"book"`
}

func ToBookmarkResponse(bookmark bookmark_respository.Bookmark) BookmarkResponse {
	return BookmarkResponse{
		ID: bookmark.ID,
		Book: BookResponse{
			ID:         bookmark.Book.ID,
			CoverImage: bookmark.Book.CoverImg,
			Title:      bookmark.Book.Title,
			Author:     bookmark.Book.Author,
			Year:       bookmark.Book.Year,
			Rating:     bookmark.Book.Rating,
			Remain:     bookmark.Book.Remain,
			Quantity:   bookmark.Book.Quantity,
		},
	}
}

func ToBookmarkResponses(bookmarks []bookmark_respository.Bookmark) []BookmarkResponse {
	var bookmarkResponses []BookmarkResponse = []BookmarkResponse{}
	for _, bookmark := range bookmarks {
		bookmarkResponses = append(bookmarkResponses, ToBookmarkResponse(bookmark))
	}
	return bookmarkResponses
}
