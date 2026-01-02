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
	Pin      string `json:"pin,omitempty"`
	Hint     string `json:"hint,omitempty"`
}

type LoginResponse struct {
	User   *domain.User `json:"user"`
	Token  string       `json:"token,omitempty"`
	Status string       `json:"status"` // OK, PIN_REQUIRED, SET_PIN_REQUIRED
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

	resp, err := h.authService.Login(req.Username, req.Pin, req.Hint)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		User:   resp.User,
		Token:  resp.Token,
		Status: resp.Status,
	})
}

type UpdatePinRequest struct {
	Pin  string `json:"pin"`
	Hint string `json:"hint"`
}

func (h *UserHandler) UpdatePIN(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	var req UpdatePinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.Pin) < 4 {
		http.Error(w, "PIN must be at least 4 digits", http.StatusBadRequest)
		return
	}

	if err := h.authService.UpdatePIN(user.ID, req.Pin, req.Hint); err != nil {
		http.Error(w, "Failed to update PIN: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func (h *UserHandler) Me(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
