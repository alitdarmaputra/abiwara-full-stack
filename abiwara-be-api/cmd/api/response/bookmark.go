package response

import (
	bookmark_respository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/bookmark"
)

type BookmarkResponse struct {
	ID   uint         `json:"id"`
	Book BookResponse `json:"book"`
}

func ToBookmarkResponse(bookmark bookmark_respository.Bookmark) BookmarkResponse {
	if bookmark.Book.Img.ID == "" {
		bookmark.Book.Img.Url = "https://ik.imagekit.io/pohfq3xvx/book-cover_7yiR3zQdQ.png?updatedAt=1708666722422"
	}

	return BookmarkResponse{
		ID: bookmark.ID,
		Book: BookResponse{
			ID:       bookmark.Book.ID,
			Title:    bookmark.Book.Title,
			Author:   bookmark.Book.Author,
			Year:     bookmark.Book.Year,
			Rating:   bookmark.Book.Rating,
			Remain:   bookmark.Book.Remain,
			Quantity: bookmark.Book.Quantity,
			Img:      ToImageUploadResponse(bookmark.Book.Img),
			Category: ToCategoryResponse(bookmark.Book.Category),
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
