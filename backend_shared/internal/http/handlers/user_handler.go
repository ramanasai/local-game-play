package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ramanasai/local-game-play/internal/auth"
	"github.com/ramanasai/local-game-play/internal/domain"
)

type UserHandler struct {
	authService *auth.AuthService
}

func NewUserHandler(authService *auth.AuthService) *UserHandler {
	return &UserHandler{authService: authService}
}

type LoginRequest struct {
	Username string `json:"username"`
}

type LoginResponse struct {
	User  *domain.User `json:"user"`
	Token string       `json:"token"`
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Username == "" {
		http.Error(w, "Username required", http.StatusBadRequest)
		return
	}

	user, session, err := h.authService.LoginOrCreate(req.Username)
	if err != nil {
		http.Error(w, "Failed to login/create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		User:  user,
		Token: session.Token,
	})
}

func (h *UserHandler) Me(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
