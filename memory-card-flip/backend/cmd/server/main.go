package main

import (
	"log"
	"net/http"

	"example.com/memory/config"
	"example.com/memory/internal/db"
	internalHttp "example.com/memory/internal/http"
	"example.com/memory/internal/http/handlers"
	"example.com/memory/internal/middleware"
	"example.com/memory/internal/repos"
	"example.com/memory/internal/services"
	"example.com/memory/migrations"
	"github.com/pressly/goose/v3"
)

func main() {
	cfg := config.Load()

	// DB
	database, err := db.Connect(cfg.DBPath)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer database.Close()

	// Ensure tables exist (Bootstrap)
	goose.SetBaseFS(migrations.Embed)

	if err := goose.SetDialect("sqlite3"); err != nil {
		log.Fatalf("Failed to set goose dialect: %v", err)
	}

	// goose.SetLogger(log.New(os.Stdout, "goose: ", log.LstdFlags)) // Optional: Enable detailed logs

	if err := goose.Up(database, "."); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Repos
	userRepo := repos.NewUserRepo(database)
	sessionRepo := repos.NewSessionRepo(database)
	scoreRepo := repos.NewScoreRepo(database)

	// Services
	userService := services.NewUserService(userRepo, sessionRepo)
	scoreService := services.NewScoreService(scoreRepo)

	// Handlers
	userHandler := handlers.NewUserHandler(userService)
	scoreHandler := handlers.NewScoreHandler(scoreService)

	// Middleware
	authMw := middleware.NewAuthMiddleware(sessionRepo)

	// Router
	r := internalHttp.NewRouter(cfg, userHandler, scoreHandler, authMw)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
