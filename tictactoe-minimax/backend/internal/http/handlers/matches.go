package handlers

import (
	"encoding/json"
	"net/http"

	"example.com/tictactoe/internal/services"
)

type MatchHandler struct {
	service *services.MatchService
}

func NewMatchHandler(service *services.MatchService) *MatchHandler {
	return &MatchHandler{service: service}
}

type CreateMatchRequest struct {
	Result     string `json:"result"`
	Difficulty string `json:"difficulty"`
	Moves      int    `json:"moves"`
}

func (h *MatchHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	var req CreateMatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	match, err := h.service.SaveMatch(services.CreateMatchParams{
		UserID:     userID,
		Difficulty: req.Difficulty,
		Result:     req.Result,
		Moves:      req.Moves,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(match)
}

func (h *MatchHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	summary, err := h.service.GetStats(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"summary": summary,
	})
}

type SuggestMoveRequest struct {
	Board  []string `json:"board"`
	XQueue []int    `json:"xQueue"`
	OQueue []int    `json:"oQueue"`
}

type SuggestMoveResponse struct {
	Index int `json:"index"`
}

func (h *MatchHandler) SuggestMove(w http.ResponseWriter, r *http.Request) {
	var req SuggestMoveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	move, err := h.service.CalculateMove(req.Board, req.XQueue, req.OQueue)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SuggestMoveResponse{Index: move})
}
