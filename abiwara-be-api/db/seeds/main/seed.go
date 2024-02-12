package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/alitdarmaputra/abiwara-full-stack/apps/api/config"
	"github.com/alitdarmaputra/abiwara-full-stack/apps/api/config/db"
	"github.com/alitdarmaputra/abiwara-full-stack/apps/api/db/seeds"
	"github.com/alitdarmaputra/abiwara-full-stack/apps/api/utils"
)

func main() {
	cfg := config.LoadConfigAPI("./config")
	handleArgs(cfg)
}

func handleArgs(cfg *config.Api) {
	flag.Parse()
	args := flag.Args()

	if len(args) >= 1 {
		switch args[0] {
		case "seed":
			db, err := db.NewMySQL(&cfg.Database)
			utils.PanicIfError(err)
			seeds.Execute(db, args[1:]...)
			os.Exit(0)
		}
	}
	fmt.Println("done")
}
