package visitor_repository

import (
	"context"
	"time"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/utils"
	"gorm.io/gorm"
)

type VisitorRepositoryImpl struct{}

func NewVisitorRepository() VisitorRepository {
	return &VisitorRepositoryImpl{}
}

func (repository *VisitorRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	visitor Visitor,
) (Visitor, error) {
	result := tx.Create(&visitor)
	return visitor, database.WrapError(result.Error)
}

func (repository *VisitorRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	search string,
	param Visitor,
	startDate,
	endDate *time.Time,
) ([]Visitor, int) {
	var visitors []Visitor
	query := tx.Model(&[]Visitor{})

	query = query.Where(param)

	if search != "" {
		search = "%" + search + "%"
		query = query.Where("name LIKE ?", search)
	}

	if startDate != nil {
		start := startDate.Truncate(24 * time.Hour)
		query = query.Where(
			"visit_time >= ?",
			start.Format(constant.DDMMYYYYhhmmss),
		)
	}

	if endDate != nil {
		end := endDate.Add(24 * time.Hour).Truncate(24 * time.Hour)
		query = query.Where(
			"visit_time < ?",
			end.Format(constant.DDMMYYYYhhmmss),
		)
	}

	totalResult := query.Find(&[]Visitor{})
	query.Limit(limit).Offset(offset).Order("created_at desc").Find(&visitors)
	return visitors, int(totalResult.RowsAffected)
}

func (repository *VisitorRepositoryImpl) FindOne(
	ctx context.Context,
	tx *gorm.DB,
	param Visitor,
) (Visitor, error) {
	var visitor Visitor
	query := tx.Model(&Visitor{})

	startDate := time.Date(
		time.Now().Year(),
		time.Now().Month(),
		time.Now().Day(),
		0,
		0,
		0,
		0,
		time.Local,
	)
	endDate := startDate.Add(24 * time.Hour)

	// Filter query for curr day
	query = query.Where(
		"visit_time >= ? AND visit_time < ?",
		startDate.Format(constant.DDMMYYYYhhmmss),
		endDate.Format(constant.DDMMYYYYhhmmss),
	)

	result := query.First(&visitor, param)
	return visitor, database.WrapError(result.Error)
}

func (repository *VisitorRepositoryImpl) GetTotal(
	ctx context.Context,
	tx *gorm.DB,
	startDate, endDate time.Time,
) []TotalVisitor {
	var totalVisitors []TotalVisitor = []TotalVisitor{}

	rows, err := tx.Model(&Visitor{}).
		Select("DATE(visit_time), COUNT(*)").
		Where("DATE(visit_time) >= ? AND DATE(visit_time) <= ?", startDate.Format("2006-01-02"), endDate.Format("2006-01-02")).
		Group("DATE(visit_time)").
		Rows()

	utils.PanicIfError(err)
	defer rows.Close()

	for rows.Next() {
		totalVisitor := TotalVisitor{}
		rows.Scan(&totalVisitor.VisitDate, &totalVisitor.Total)
		totalVisitors = append(totalVisitors, totalVisitor)
	}

	return totalVisitors
}
