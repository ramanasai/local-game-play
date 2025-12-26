package handlers

import (
	"encoding/json"
	"net/http"
	"example.com/memory/internal/services"
)

type ScoreHandler struct {
	Service *services.ScoreService
}

func NewScoreHandler(s *services.ScoreService) *ScoreHandler {
	return &ScoreHandler{Service: s}
}

type AddScoreRequest struct {
	Moves       int `json:"moves"`
	TimeSeconds int `json:"time_seconds"`
}

func (h *ScoreHandler) AddScore(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string) // Middleware will set this

	var req AddScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.Service.AddScore(userID, req.Moves, req.TimeSeconds); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *ScoreHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	scores, err := h.Service.GetLeaderboard(10)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}
