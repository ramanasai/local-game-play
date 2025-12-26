package tictactoe

import (
	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
)

type Service struct {
	matchRepo *repos.MatchRepo
}

func NewService(matchRepo *repos.MatchRepo) *Service {
	return &Service{matchRepo: matchRepo}
}

func (s *Service) SaveMatch(userID, difficulty, result string, moves int) error {
	match := &domain.Match{
		ID:         uuid.New().String(),
		UserID:     userID,
		Difficulty: difficulty,
		Result:     result,
		Moves:      moves,
	}
	return s.matchRepo.Create(match)
}

func (s *Service) GetStats(userID string) (map[string]domain.StatsSummary, error) {
	return s.matchRepo.GetStatsByUser(userID)
}

func (s *Service) GetMove(board []string, xQueue, oQueue []int) int {
	return GetBestMove(board, xQueue, oQueue)
}
