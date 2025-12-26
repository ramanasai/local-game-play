package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"example.com/tictactoe/config"
	"example.com/tictactoe/internal/http/handlers"
	authMw "example.com/tictactoe/internal/middleware"
)

func NewRouter(cfg *config.Config, userH *handlers.UserHandler, matchH *handlers.MatchHandler, auth *authMw.AuthMiddleware) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{cfg.CorsOrigin},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/health", handlers.Health)

		r.Post("/users", userH.Login)
		r.Post("/play", matchH.SuggestMove)

		r.Group(func(r chi.Router) {
			r.Use(auth.Handle)
			r.Get("/me", userH.GetMe)
			r.Post("/matches", matchH.Create)
			r.Get("/stats/summary", matchH.GetStats)
		})
	})

	return r
}
