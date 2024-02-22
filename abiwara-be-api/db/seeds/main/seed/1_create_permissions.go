package seed

import (
	"fmt"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	permission_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/permission"
)

func (s Seed) PermissionSeed() {
	permissions := []permission_repository.Permission{
		{
			Name: constant.PermissionShowBook,
		}, {
			Name: constant.PermissionCreateBook,
		}, {
			Name: constant.PermissionDeleteBook,
		}, {
			Name: constant.PermissionUpdateBook,
		}, {
			Name: constant.PermissionShowVisitor,
		}, {
			Name: constant.PermissionCreateVisitor,
		}, {
			Name: constant.PermissionDeleteVisitor,
		}, {
			Name: constant.PermissionUpdateVisitor,
		}, {
			Name: constant.PermissionCreateBorrower,
		}, {
			Name: constant.PermissionUpdateBorrower,
		}, {
			Name: constant.PermissionShowBorrower,
		}, {
			Name: constant.PermissionShowMember,
		},
	}

	tx := s.db.CreateInBatches(permissions, len(permissions))
	if tx.Error != nil {
		fmt.Println(tx.Error.Error())
	}
}
