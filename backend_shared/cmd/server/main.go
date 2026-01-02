package main

import (
	"net/http"
	"os"

	"github.com/joho/godotenv"
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
	"github.com/ramanasai/local-game-play/pkg/logger"
	"github.com/rs/zerolog/log"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Error().Err(err).Msg("Failed to load .env file")
	}

	// Init Logger
	logger.Init(os.Getenv("LOG_LEVEL"))
	log.Info().Str("log_level", os.Getenv("LOG_LEVEL")).Msg("Logger initialized")

	cfg := config.Load()

	// Connect to DB
	database, err := db.Connect(cfg.DBPath)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to DB")
	}
	defer database.Close()

	// Run Migrations
	goose.SetBaseFS(migrations.Embed)
	if err := goose.SetDialect("sqlite3"); err != nil {
		log.Fatal().Err(err).Msg("Failed to set goose dialect")
	}
	if err := goose.Up(database, "."); err != nil {
		log.Fatal().Err(err).Msg("Failed to run migrations")
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

	log.Info().Str("port", cfg.Port).Msg("Server starting")
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatal().Err(err).Msg("Server failed")
	}
}
