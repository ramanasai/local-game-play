package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/ramanasai/local-game-play/config"
	"github.com/ramanasai/local-game-play/internal/http/handlers"
	authMw "github.com/ramanasai/local-game-play/internal/http/middleware"
)

func NewRouter(cfg *config.Config, userHandler *handlers.UserHandler, memHandler *handlers.MemoryHandler, tttHandler *handlers.TicTacToeHandler, game2048Handler *handlers.Game2048Handler, blockBlastHandler *handlers.BlockBlastHandler, auth *authMw.AuthMiddleware) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(authMw.RequestLogger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin, "http://localhost:5173", "http://localhost:4173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api/v1", func(r chi.Router) {
		// Public Routes
		r.Post("/users", userHandler.Login) // This is login/create
		r.Get("/leaderboard", memHandler.GetLeaderboard)
		r.Get("/leaderboard/tictactoe", tttHandler.GetLeaderboard)
		r.Get("/leaderboard/2048", game2048Handler.GetLeaderboard)
		r.Get("/leaderboard/blockblast", blockBlastHandler.GetLeaderboard)
		r.Post("/play", tttHandler.GetMove) // Minimax

		// Protected Routes
		r.Group(func(r chi.Router) {
			r.Use(auth.Handle)
			r.Get("/me", userHandler.Me)
			r.Put("/users/pin", userHandler.UpdatePIN)

			// Memory
			r.Post("/scores", memHandler.SubmitScore)

			// TicTacToe
			r.Post("/matches", tttHandler.SaveMatch)
			r.Get("/stats", tttHandler.GetStats)

			// 2048
			r.Post("/2048/scores", game2048Handler.SubmitScore)

			// Block Blast
			r.Post("/blockblast/scores", blockBlastHandler.SubmitScore)
		})
	})

	return r
}
