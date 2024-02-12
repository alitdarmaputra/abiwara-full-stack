package database

import (
	"errors"
	"strings"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/business"
	"gorm.io/gorm"
)

func WrapError(err error) error {
	if err == nil {
		return nil
	}

	if strings.Contains(err.Error(), "Duplicate entry") {
		return business.NewDuplicateEntryError("Duplicate entry")
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return business.NewNotFoundError("Data not found")
	}

	return err
}
