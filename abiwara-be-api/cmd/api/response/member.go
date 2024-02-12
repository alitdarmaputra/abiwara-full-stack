package response

import member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"

type MemberResponse struct {
	Id         uint   `json:"id"`
	Name       string `json:"name"`
	Class      string `json:"class"`
	ProfileImg string `json:"profile_img"`
}

func ToMemberResponse(member member_repository.Member) MemberResponse {
	return MemberResponse{
		Id:         member.ID,
		Name:       member.Name,
		Class:      member.Class,
		ProfileImg: member.ProfileImg,
	}
}

func ToMemberResponses(members []member_repository.Member) []MemberResponse {
	var membersResponses []MemberResponse = []MemberResponse{}
	for _, member := range members {
		membersResponses = append(membersResponses, ToMemberResponse(member))
	}
	return membersResponses
}

type TotalMemberResponse struct {
	Total int64 `json:"total"`
}
