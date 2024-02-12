package seeds

import (
	"fmt"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/constant"
	role_repository "github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/modules/database/role"
)

func (s Seed) RoleSeed() {
	roles := []role_repository.Role{
		{
			Name: constant.ADMIN,
		},
		{
			Name: constant.MEMBER,
		},
		{
			Name: constant.OPERATOR,
		},
	}

	tx := s.db.CreateInBatches(roles, 3)
	if tx.Error != nil {
		fmt.Println(tx.Error.Error())
	}
}
