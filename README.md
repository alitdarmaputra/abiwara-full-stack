
# Abiwara Full Stack

<img src="https://github.com/alitdarmaputra/abiwara-full-stack/blob/master/abiwara-fe/src/assets/logo.svg" alt="logo" width="200"/>

### Description

A Recommender System with Collaborative Filtering and RSVD

### Tech Stack

- FE: React, Tailwind CSS
- BE: Go (Gin), Python (Flask)
- Database: MySQL

### How to run?

#### Recommender BE

1. Install Python Module
   ```
   cd abiwara-be-recommender && pip install -r requirements.txt
   ```
2. Change `.env.example` to `.env` and fill the env according to your own value.
3. Run the app
   ```
   flask run
   ```
   
#### API BE

1. Install Go Module
   ```
   cd abiwara-be-api && go mod tidy
   ```
2. Change `.env.example` to `.env` and fill the env according to your own value.
3. In the root directory, run migration
   ```
   make migrate
   ```
4. Run seeder
   ```
    go run ./db/seeds/main/seed.go seed RoleSeed PermissionSeed RolePermissionSeed
   ```
5. Insert category rows in categories.sql query file.
6. From the root directory, run the app
   ```
   make run
   ```
   
#### FE

1. Install node module
   ```
   cd abiwara-fe && npm install
   ```
2. Change `.env.example` to `.env` and fill the env according to your own value.
3. In the root directory, start the app
   ```
   make start
   ```
