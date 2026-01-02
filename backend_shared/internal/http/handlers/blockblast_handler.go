package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ramanasai/local-game-play/internal/games/blockblast"
	"github.com/rs/zerolog/log"
)

type BlockBlastHandler struct {
	service *blockblast.Service
}

func NewBlockBlastHandler(service *blockblast.Service) *BlockBlastHandler {
	return &BlockBlastHandler{service: service}
}

func (h *BlockBlastHandler) SubmitScore(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	var req struct {
		Score int `json:"score"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn().Err(err).Msg("Invalid SubmitBlockBlastScore request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Info().Str("user_id", userID).Int("score", req.Score).Msg("Submitting BlockBlast score")
	if err := h.service.SubmitScore(userID, req.Score); err != nil {
		log.Error().Err(err).Msg("Failed to save BlockBlast score")
		http.Error(w, "Failed to save score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *BlockBlastHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
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
