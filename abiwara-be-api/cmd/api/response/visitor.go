package response

import (
	"time"

	visitor_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/visitor"
)

type VisitorResponse struct {
	Id          uint      `json:"id"`
	Name        string    `json:"name"`
	Class       string    `json:"class"`
	PIC         string    `json:"pic"`
	Description string    `json:"description"`
	VisitTime   time.Time `json:"visit_time"`
}

func ToVisitorResponse(visitor visitor_repository.Visitor) VisitorResponse {
	return VisitorResponse{
		Id:          visitor.ID,
		Name:        visitor.Name,
		Class:       visitor.Class,
		PIC:         visitor.PIC,
		Description: visitor.Description,
		VisitTime:   visitor.VisitTime,
	}
}

func ToVisitorResponses(visitors []visitor_repository.Visitor) []VisitorResponse {
	visitorResponses := []VisitorResponse{}
	for _, visitor := range visitors {
		visitorResponses = append(visitorResponses, ToVisitorResponse(visitor))
	}
	return visitorResponses
}

type TotalVisitorResponse struct {
	VisitDate time.Time `json:"visit_date"`
	Total     int       `json:"total"`
}

func ToTotalVisitorResponse(
	totalVisitors []visitor_repository.TotalVisitor,
) []TotalVisitorResponse {
	totalVisitorResponses := []TotalVisitorResponse{}

	for _, totalVisitor := range totalVisitors {
		totalVisitorResponses = append(totalVisitorResponses, TotalVisitorResponse{
			VisitDate: totalVisitor.VisitDate,
			Total:     totalVisitor.Total,
		})
	}

	return totalVisitorResponses
}
