package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/games/memory"
	"github.com/rs/zerolog/log"
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
		log.Warn().Err(err).Msg("Invalid SubmitScore request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Info().Str("user_id", user.ID).Int("moves", req.Moves).Int("time", req.TimeSeconds).Msg("Submitting Memory game score")
	if err := h.service.SubmitScore(user.ID, req.Moves, req.TimeSeconds); err != nil {
		log.Error().Err(err).Msg("Failed to submit memory score")
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

	// log.Debug().Int("limit", limit).Msg("Fetching Memory leaderboard") // Optional
	scores, err := h.service.GetLeaderboard(limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get memory leaderboard")
		http.Error(w, "Failed to get leaderboard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}
