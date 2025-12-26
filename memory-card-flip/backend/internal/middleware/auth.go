package middleware

import (
	"context"
	"net/http"
	"strings"
	"example.com/memory/internal/repos"
)

type AuthMiddleware struct {
	SessionRepo *repos.SessionRepo
}

func NewAuthMiddleware(s *repos.SessionRepo) *AuthMiddleware {
	return &AuthMiddleware{SessionRepo: s}
}

func (m *AuthMiddleware) Handle(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		token := parts[1]
		session, err := m.SessionRepo.GetByToken(token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "user_id", session.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
