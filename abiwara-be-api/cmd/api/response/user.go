package response

import (
	"time"

	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
)

type UserResponse struct {
	Id         string              `json:"id"`
	Name       string              `json:"name"`
	Class      string              `json:"class"`
	IsVerified bool                `json:"is_verified"`
	CreatedAt  time.Time           `json:"created_at"`
	DeletedAt  *time.Time          `json:"deleted_at"`
	Img        ImageUploadResponse `json:"img"`
}

func ToUserResponse(user user_repository.User) UserResponse {
	if user.Img.Url == "" {
		user.Img.Url = "https://ik.imagekit.io/pohfq3xvx/default-avatar_MvtamjwS3.png?updatedAt=1708938962261"
	}

	var deletedAt *time.Time

	if user.DeletedAt.Valid {
		deletedAt = &user.DeletedAt.Time
	}

	return UserResponse{
		Id:         user.ID,
		Name:       user.Name,
		Class:      user.Class,
		IsVerified: user.IsVerified,
		Img:        ToImageUploadResponse(user.Img),
		CreatedAt:  user.CreatedAt,
		DeletedAt:  deletedAt,
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
