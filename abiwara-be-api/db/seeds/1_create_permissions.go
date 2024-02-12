package seeds

import (
	"fmt"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	permission_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/permission"
)

func (s Seed) PermissionSeed() {
	permissions := []permission_repository.Permission{
		{
			Key:  constant.PermissionShowBook,
			Name: constant.PermissionShowBook,
		}, {
			Key:  constant.PermissionCreateBook,
			Name: constant.PermissionCreateBook,
		}, {
			Key:  constant.PermissionDeleteBook,
			Name: constant.PermissionDeleteBook,
		}, {
			Key:  constant.PermissionUpdateBook,
			Name: constant.PermissionUpdateBook,
		}, {
			Key:  constant.PermissionShowVisitor,
			Name: constant.PermissionShowVisitor,
		}, {
			Key:  constant.PermissionCreateVisitor,
			Name: constant.PermissionCreateVisitor,
		}, {
			Key:  constant.PermissionDeleteVisitor,
			Name: constant.PermissionDeleteVisitor,
		}, {
			Key:  constant.PermissionUpdateVisitor,
			Name: constant.PermissionUpdateVisitor,
		}, {
			Key:  constant.PermissionCreateBorrower,
			Name: constant.PermissionCreateBorrower,
		}, {
			Key:  constant.PermissionUpdateBorrower,
			Name: constant.PermissionUpdateBorrower,
		}, {
			Key:  constant.PermissionShowBorrower,
			Name: constant.PermissionShowBorrower,
		}, {
			Key:  constant.PermissionShowMember,
			Name: constant.PermissionShowMember,
		},
	}

	tx := s.db.CreateInBatches(permissions, len(permissions))
	if tx.Error != nil {
		fmt.Println(tx.Error.Error())
	}
}
