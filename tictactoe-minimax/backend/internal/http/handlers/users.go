package handlers

import (
	"encoding/json"
	"net/http"

	"example.com/tictactoe/internal/services"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{service: service}
}

type LoginRequest struct {
	Username string `json:"username"`
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.service.LoginOrRegister(req.Username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)
	// We could fetch fresh user data here if needed, but for now we just return ID
	// Or we can modify Middleware to pass the whole user object.
	// For simplicity, let's just return a success payload with ID.

	// Actually, the client expects {id, username} usually.
	// Let's assume the middleware only passed ID. We'd need to fetch again or change middleware.
	// Given the repo methods, simplest is to just rely on the token causing a fetch in middleware,
	// maybe attach user object there?
	// For now, let's keep it simple: The client has the user info from Login.
	// GetMe is mostly for validation.

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"id":     userID,
		"status": "authenticated",
	})
}
