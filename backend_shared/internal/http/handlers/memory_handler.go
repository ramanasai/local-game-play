package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/games/memory"
)

type MemoryHandler struct {
	service *memory.Service
}

func NewMemoryHandler(service *memory.Service) *MemoryHandler {
	return &MemoryHandler{service: service}
}

type SubmitScoreRequest struct {
	Moves       int `json:"moves"`
	TimeSeconds int `json:"time_seconds"`
}

func (h *MemoryHandler) SubmitScore(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	var req SubmitScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.service.SubmitScore(user.ID, req.Moves, req.TimeSeconds); err != nil {
		http.Error(w, "Failed to submit score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *MemoryHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	scores, err := h.service.GetLeaderboard(limit)
	if err != nil {
		http.Error(w, "Failed to get leaderboard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}
