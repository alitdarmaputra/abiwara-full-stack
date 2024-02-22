package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/db/seeds/main/seed"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	charset   = "utf8mb4"
	parseTime = "True"
)

func main() {
	viper.AutomaticEnv()

	viper.AddConfigPath("./config")
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	if err := viper.ReadInConfig(); err != nil {
		log.Println("read config failed:", err.Error())
	}

	username := viper.Get("DATABASE_USERNAME")
	password := viper.Get("DATABASE_PASSWORD")
	host := viper.Get("DATABASE_HOST")
	port := viper.Get("DATABASE_PORT")
	schema := viper.Get("DATABASE_SCHEMA")
	loc := viper.Get("DATABASE_LOC")

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=%s&loc=%s",
		username, password, host, port, schema, charset, parseTime, loc,
	)

	db, err := gorm.Open(mysql.Open(dsn), nil)
	if err != nil {
		panic(err)
	}

	handleArgs(db)
}

func handleArgs(db *gorm.DB) {
	flag.Parse()
	args := flag.Args()

	if len(args) >= 1 {
		switch args[0] {
		case "seed":
			seed.Execute(db, args[1:]...)
			os.Exit(0)
		}
	}
	fmt.Println("done")
}
