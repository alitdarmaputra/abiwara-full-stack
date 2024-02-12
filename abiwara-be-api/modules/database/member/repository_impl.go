package member_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type MemberRepositoryImpl struct{}

func NewMemberRepository() MemberRepository {
	return &MemberRepositoryImpl{}
}

func (repository *MemberRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	member Member,
) (Member, error) {
	result := tx.Create(&member)
	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) SaveOrUpdate(
	ctx context.Context,
	tx *gorm.DB,
	member Member,
) (Member, error) {
	result := tx.Save(&member)

	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) Update(
	ctx context.Context,
	tx *gorm.DB,
	member Member,
) (Member, error) {
	result := tx.Updates(&member)
	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) Delete(
	ctx context.Context,
	tx *gorm.DB,
	memberId uint,
) error {
	result := tx.Delete(&Member{}, memberId)
	return database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) FindById(
	ctx context.Context,
	tx *gorm.DB,
	memberId uint,
) (Member, error) {
	var member Member
	result := tx.First(&member, "id = ? AND is_verified = ?", memberId, true)
	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) FindUnverifiedById(
	ctx context.Context,
	tx *gorm.DB,
	memberId uint,
) (Member, error) {
	var member Member
	result := tx.First(&member, "id = ?", memberId)
	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) FindOne(
	ctx context.Context,
	tx *gorm.DB,
	email string,
	name string,
) (Member, error) {
	var member Member
	result := tx.First(&member, "email = ? OR name = ?", email, name)
	return member, database.WrapError(result.Error)
}

func (repository *MemberRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	search string,
) ([]Member, int) {
	var members []Member = []Member{}
	result := tx.Find(&members)

	if search != "" {
		search = "%" + search + "%"
		result = tx.Limit(limit).
			Offset(offset).
			Where("name LIKE ? AND role_id = ? AND is_verified = 1", search, 2).
			Find(&members)
	} else {
		tx.Where("role_id = ? AND is_verified = 1", 2).Limit(limit).Offset(offset).Find(&members)
	}

	return members, int(result.RowsAffected)
}

func (repository *MemberRepositoryImpl) GetTotal(
	ctx context.Context,
	tx *gorm.DB,
) int64 {
	var total int64

	if err := tx.Model(&Member{}).Where("role_id = ? AND is_verified = 1", 2).Count(&total).Error; err != nil {
		panic(err)
	}

	return total
}
