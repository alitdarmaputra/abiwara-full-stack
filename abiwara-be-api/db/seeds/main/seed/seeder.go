package seed

import (
	"log"
	"reflect"

	"gorm.io/gorm"
)

type Seed struct {
	db *gorm.DB
}

func seed(s Seed, seedMethodName string) {
	m := reflect.ValueOf(s).MethodByName(seedMethodName)

	if !m.IsValid() {
		log.Fatal("No method called", seedMethodName)
	}

	log.Println("Seeding", seedMethodName, "...")
	m.Call(nil)
	log.Println("Seed", seedMethodName, "succedd")
}

func Execute(db *gorm.DB, seedMethodName ...string) {
	s := Seed{db}

	for _, item := range seedMethodName {
		seed(s, item)
	}
}
