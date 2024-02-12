package visitor_repository

import (
	"time"

	member_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/member"
	"gorm.io/gorm"
)

type Visitor struct {
	gorm.Model
	Name        string    `gorm:"column:name"`
	Class       string    `gorm:"column:class"`
	PIC         string    `gorm:"column:pic"`
	Description string    `gorm:"column:description"`
	VisitTime   time.Time `gorm:"column:visit_time"`
	VisitDate   time.Time `gorm:"column:visit_date"`
	MemberId    uint      `gorm:"column:member_id"`
	Member      member_repository.Member
}

type TotalVisitor struct {
	VisitDate time.Time `gorm:"column:visit_date"`
	Total     int
}
