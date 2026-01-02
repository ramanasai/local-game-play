package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/games/tictactoe"
	"github.com/rs/zerolog/log"
)

type TicTacToeHandler struct {
	service *tictactoe.Service
}

func NewTicTacToeHandler(service *tictactoe.Service) *TicTacToeHandler {
	return &TicTacToeHandler{service: service}
}

type GetMoveRequest struct {
	Board  []string `json:"board"`
	XQueue []int    `json:"xQueue"` // Indices of X's moves
	OQueue []int    `json:"oQueue"` // Indices of O's moves
}

type GetMoveResponse struct {
	Index int `json:"index"`
}

func (h *TicTacToeHandler) GetMove(w http.ResponseWriter, r *http.Request) {
	var req GetMoveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn().Err(err).Msg("Invalid GetMove request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	index := h.service.GetMove(req.Board, req.XQueue, req.OQueue)
	// log.Debug().Int("move_index", index).Msg("Calculated Minimax move")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(GetMoveResponse{Index: index})
}

type SaveMatchRequest struct {
	Difficulty string `json:"difficulty"`
	Result     string `json:"result"`
	Moves      int    `json:"moves"`
}

func (h *TicTacToeHandler) SaveMatch(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	var req SaveMatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn().Err(err).Msg("Invalid SaveMatch request body")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Info().Str("user_id", user.ID).Str("result", req.Result).Msg("Saving TicTacToe match")
	if err := h.service.SaveMatch(user.ID, req.Difficulty, req.Result, req.Moves); err != nil {
		log.Error().Err(err).Msg("Failed to save match")
		http.Error(w, "Failed to save match", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *TicTacToeHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	stats, err := h.service.GetStats(user.ID)
	if err != nil {
		log.Error().Err(err).Str("user_id", user.ID).Msg("Failed to get TicTacToe stats")
		http.Error(w, "Failed to get stats", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

func (h *TicTacToeHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	limit := 10 // Default limit, could be parsed from query param
	leaderboard, err := h.service.GetLeaderboard(limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get TicTacToe leaderboard")
		http.Error(w, "Failed to get leaderboard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
