package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"example.com/memory/config"
	"example.com/memory/internal/http/handlers"
	authMw "example.com/memory/internal/middleware"
)

func NewRouter(
	cfg *config.Config,
	userHandler *handlers.UserHandler,
	scoreHandler *handlers.ScoreHandler,
	authMiddleware *authMw.AuthMiddleware,
) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin, "http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", handlers.Health)

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/users", userHandler.Login)
		r.Get("/leaderboard", scoreHandler.GetLeaderboard)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.Handle)
			r.Post("/scores", scoreHandler.AddScore)
			r.Get("/me", userHandler.GetMe)
		})
	})

	return r
}
