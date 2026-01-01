package main

import (
	"log"
	"net/http"

	"github.com/pressly/goose/v3"
	"github.com/ramanasai/local-game-play/config"
	"github.com/ramanasai/local-game-play/internal/auth"
	"github.com/ramanasai/local-game-play/internal/db"
	"github.com/ramanasai/local-game-play/internal/games/blockblast"
	"github.com/ramanasai/local-game-play/internal/games/game2048"
	"github.com/ramanasai/local-game-play/internal/games/memory"
	"github.com/ramanasai/local-game-play/internal/games/tictactoe"
	internalHttp "github.com/ramanasai/local-game-play/internal/http"
	"github.com/ramanasai/local-game-play/internal/http/handlers"
	"github.com/ramanasai/local-game-play/internal/http/middleware"
	"github.com/ramanasai/local-game-play/internal/repos"
	"github.com/ramanasai/local-game-play/migrations"
)

func main() {
	cfg := config.Load()

	// Connect to DB
	database, err := db.Connect(cfg.DBPath)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer database.Close()

	// Run Migrations
	goose.SetBaseFS(migrations.Embed)
	if err := goose.SetDialect("sqlite3"); err != nil {
		log.Fatalf("Failed to set goose dialect: %v", err)
	}
	if err := goose.Up(database, "."); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Repositories
	userRepo := repos.NewUserRepo(database)
	sessionRepo := repos.NewSessionRepo(database)
	scoreRepo := repos.NewScoreRepo(database)
	matchRepo := repos.NewMatchRepo(database)
	game2048Repo := repos.NewGame2048Repo(database)
	blockBlastRepo := repos.NewBlockBlastRepo(database)

	// Services
	authService := auth.NewAuthService(userRepo, sessionRepo)
	memService := memory.NewService(scoreRepo)
	tttService := tictactoe.NewService(matchRepo)
	game2048Service := game2048.NewService(game2048Repo)
	blockBlastService := blockblast.NewService(blockBlastRepo)

	// Middleware
	authMw := middleware.NewAuthMiddleware(authService)

	// Handlers
	userHandler := handlers.NewUserHandler(authService)
	memHandler := handlers.NewMemoryHandler(memService)
	tttHandler := handlers.NewTicTacToeHandler(tttService)
	game2048Handler := handlers.NewGame2048Handler(game2048Service)
	blockBlastHandler := handlers.NewBlockBlastHandler(blockBlastService)

	// Router
	r := internalHttp.NewRouter(cfg, userHandler, memHandler, tttHandler, game2048Handler, blockBlastHandler, authMw)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
