package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/games/game2048"
	"github.com/rs/zerolog/log"
)

type Game2048Handler struct {
	service *game2048.Service
}

func NewGame2048Handler(service *game2048.Service) *Game2048Handler {
	return &Game2048Handler{service: service}
}

type Submit2048ScoreRequest struct {
	Score int `json:"score"`
}

func (h *Game2048Handler) SubmitScore(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	var req Submit2048ScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn().Err(err).Msg("Invalid Submit2048Score request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Info().Str("user_id", user.ID).Int("score", req.Score).Msg("Submitting 2048 game score")
	if err := h.service.SubmitScore(user.ID, req.Score); err != nil {
		log.Error().Err(err).Msg("Failed to submit 2048 score")
		http.Error(w, "Failed to submit score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *Game2048Handler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	scores, err := h.service.GetLeaderboard(limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get 2048 leaderboard")
		http.Error(w, "Failed to get leaderboard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}
