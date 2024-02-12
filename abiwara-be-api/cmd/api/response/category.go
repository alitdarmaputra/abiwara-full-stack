package response

import category_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/category"

type CategoryResponse struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func ToCategoryResponse(category category_repository.Category) CategoryResponse {
	return CategoryResponse{
		Id:   category.ID,
		Name: category.Name,
	}
}

func ToCategoryResponses(categories []category_repository.Category) []CategoryResponse {
	categoryResponses := []CategoryResponse{}

	for _, category := range categories {
		categoryResponses = append(categoryResponses, ToCategoryResponse(category))
	}
	return categoryResponses
}
