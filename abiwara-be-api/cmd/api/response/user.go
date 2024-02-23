package response

import user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"

type UserResponse struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	Class      string `json:"class"`
	ProfileImg string `json:"profile_img"`
}

func ToUserResponse(user user_repository.User) UserResponse {
	return UserResponse{
		Id:         user.ID,
		Name:       user.Name,
		Class:      user.Class,
		ProfileImg: user.ProfileImg,
	}
}

func ToUserResponses(users []user_repository.User) []UserResponse {
	var usersResponses []UserResponse = []UserResponse{}
	for _, user := range users {
		usersResponses = append(usersResponses, ToUserResponse(user))
	}
	return usersResponses
}

type TotalUserResponse struct {
	Total int64 `json:"total"`
}
