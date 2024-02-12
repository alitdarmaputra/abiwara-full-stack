hello:
	echo "hello"

run:
	cd ./abiwara-be-api && go run ./cmd/api/injector.go ./cmd/api/main.go

start:
	cd ./backoffice && npm start

seed:
	cd ./abiwara-be-api && go run ./db/seeds/main/seed.go seed 

migrate:
	cd ./abiwara-be-api && ./db/migrate -database "mysql://root:root123@tcp(localhost:3306)/dev_abiwara_db" -path "./db/migrations" up
