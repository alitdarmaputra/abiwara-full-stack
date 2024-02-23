package visitor_repository

import (
	"time"

	user_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/user"
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
	UserId      string    `gorm:"column:user_id"`
	User        user_repository.User
}

type TotalVisitor struct {
	VisitDate time.Time `gorm:"column:visit_date"`
	Total     int
}
