package memory

import (
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
)

type Service struct {
	scoreRepo *repos.ScoreRepo
}

func NewService(scoreRepo *repos.ScoreRepo) *Service {
	return &Service{scoreRepo: scoreRepo}
}

func (s *Service) SubmitScore(userID string, moves, timeSeconds int) error {
	return s.scoreRepo.Create(userID, moves, timeSeconds)
}

func (s *Service) GetLeaderboard(limit int) ([]domain.Score, error) {
	return s.scoreRepo.GetLeaderboard(limit)
}
