package user_repository

import (
	"context"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database"
	"gorm.io/gorm"
)

type UserRepositoryImpl struct{}

func NewUserRepository() UserRepository {
	return &UserRepositoryImpl{}
}

func (repository *UserRepositoryImpl) Save(
	ctx context.Context,
	tx *gorm.DB,
	user User,
) (User, error) {
	result := tx.Create(&user)
	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) SaveOrUpdate(
	ctx context.Context,
	tx *gorm.DB,
	user User,
) (User, error) {
	result := tx.Save(&user)

	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) Update(
	ctx context.Context,
	tx *gorm.DB,
	user User,
) (User, error) {
	result := tx.Updates(&user)
	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) Delete(
	ctx context.Context,
	tx *gorm.DB,
	userId string,
) error {
	result := tx.Delete(&User{}, userId)
	return database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) FindById(
	ctx context.Context,
	tx *gorm.DB,
	userId string,
) (User, error) {
	var user User
	result := tx.First(&user, "id = ? AND is_verified = ?", userId, true)
	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) FindUnverifiedById(
	ctx context.Context,
	tx *gorm.DB,
	userId string,
) (User, error) {
	var user User
	result := tx.First(&user, "id = ?", userId)
	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) FindOne(
	ctx context.Context,
	tx *gorm.DB,
	email string,
	name string,
) (User, error) {
	var user User
	result := tx.First(&user, "email = ? OR name = ?", email, name)
	return user, database.WrapError(result.Error)
}

func (repository *UserRepositoryImpl) FindAll(
	ctx context.Context,
	tx *gorm.DB,
	offset, limit int,
	search string,
) ([]User, int) {
	var users []User = []User{}
	var query *gorm.DB = tx

	if search != "" {
		search = "%" + search + "%"
		query = query.Where("name LIKE ?", search)
	}

	query = query.Where("role_id = ? AND is_verified = 1", 3)

	totalResult := query
	totalResult = totalResult.Find(&[]User{})

	totalUser := int(totalResult.RowsAffected)

	// Handle order and pagination

	query = query.Limit(limit).
		Offset(offset)

	if search == "" {
		query = query.Order("name asc")
	}

	query.Find(&users)

	return users, int(totalUser)
}

func (repository *UserRepositoryImpl) GetTotal(
	ctx context.Context,
	tx *gorm.DB,
) int64 {
	var total int64

	if err := tx.Model(&User{}).Where("role_id = ? AND is_verified = 1", 3).Count(&total).Error; err != nil {
		panic(err)
	}

	return total
}
