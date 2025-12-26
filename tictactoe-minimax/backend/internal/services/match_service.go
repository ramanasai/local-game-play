package services

import (
	"errors"
	"fmt"

	"example.com/tictactoe/internal/game"
	"example.com/tictactoe/internal/repos"
	"github.com/google/uuid"
)

type MatchService struct {
	repo *repos.MatchRepo
}

func NewMatchService(repo *repos.MatchRepo) *MatchService {
	return &MatchService{repo: repo}
}

type CreateMatchParams struct {
	UserID     string
	Difficulty string
	Result     string
	Moves      int
}

func (s *MatchService) SaveMatch(params CreateMatchParams) (*repos.Match, error) {
	if params.Moves < 0 {
		return nil, errors.New("moves cannot be negative")
	}
	// TODO: Validate difficulty and result enum if needed

	match := &repos.Match{
		ID:         uuid.NewString(),
		UserID:     params.UserID,
		Difficulty: params.Difficulty,
		Result:     params.Result,
		Moves:      params.Moves,
	}

	if err := s.repo.Create(match); err != nil {
		return nil, fmt.Errorf("failed to save match: %w", err)
	}

	return match, nil
}

func (s *MatchService) GetStats(userID string) (map[string]repos.StatsSummary, error) {
	return s.repo.GetStatsByUser(userID)
}

func (s *MatchService) CalculateMove(board []string, xQueue, oQueue []int) (int, error) {
	if len(board) != 9 {
		return -1, fmt.Errorf("invalid board size: %d", len(board))
	}
	move := game.GetBestMove(board, xQueue, oQueue)
	return move, nil
}
