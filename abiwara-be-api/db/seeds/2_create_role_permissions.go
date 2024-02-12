package seeds

import (
	"fmt"

	role_permission_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role_permission"
)

func (s Seed) RolePermissionSeed() {
	temp := [][]uint{
		{1, 1},
		{1, 2},
		{1, 3},
		{1, 4},
		{1, 5},
		{1, 6},
		{1, 7},
		{1, 8},
		{1, 9},
		{1, 10},
		{1, 11},
		{1, 12},
		{2, 1},
		{2, 5},
		{2, 6},
		{2, 11},
		{3, 1},
		{3, 2},
		{3, 3},
		{3, 4},
		{3, 5},
		{3, 6},
		{3, 7},
		{3, 8},
		{3, 9},
		{3, 10},
		{3, 11},
		{3, 12},
	}

	rolePermissions := []role_permission_repository.RolePermission{}

	for _, data := range temp {
		rolePermissions = append(rolePermissions, role_permission_repository.RolePermission{
			RoleId:       data[0],
			PermissionId: data[1],
		})
	}

	tx := s.db.CreateInBatches(rolePermissions, len(rolePermissions))
	if tx.Error != nil {
		fmt.Println(tx.Error.Error())
	}
}
