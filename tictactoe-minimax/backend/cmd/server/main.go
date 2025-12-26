package main

import (
	"log"
	"net/http"

	"example.com/tictactoe/config"
	"example.com/tictactoe/internal/db"
	internalHttp "example.com/tictactoe/internal/http"
	"example.com/tictactoe/internal/http/handlers"
	"example.com/tictactoe/internal/middleware"
	"example.com/tictactoe/internal/repos"
	"example.com/tictactoe/internal/services"
	"example.com/tictactoe/migrations"
	"github.com/pressly/goose/v3"
)

func main() {
	cfg := config.Load()

	// DB connection
	database, err := db.Connect(cfg.DBPath)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer database.Close()

	// Migrations
	goose.SetBaseFS(migrations.Embed)
	if err := goose.SetDialect("sqlite3"); err != nil {
		log.Fatalf("Failed to set goose dialect: %v", err)
	}
	if err := goose.Up(database, "."); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Layers
	userRepo := repos.NewUserRepo(database)
	matchRepo := repos.NewMatchRepo(database)

	userService := services.NewUserService(userRepo)
	matchService := services.NewMatchService(matchRepo)

	authMw := middleware.NewAuthMiddleware(userService)

	userHandler := handlers.NewUserHandler(userService)
	matchHandler := handlers.NewMatchHandler(matchService)

	// Router
	r := internalHttp.NewRouter(cfg, userHandler, matchHandler, authMw)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
