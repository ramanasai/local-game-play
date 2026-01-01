package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/games/tictactoe"
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
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	index := h.service.GetMove(req.Board, req.XQueue, req.OQueue)

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
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.service.SaveMatch(user.ID, req.Difficulty, req.Result, req.Moves); err != nil {
		http.Error(w, "Failed to save match", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *TicTacToeHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*domain.User)

	stats, err := h.service.GetStats(user.ID)
	if err != nil {
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
		http.Error(w, "Failed to get leaderboard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
