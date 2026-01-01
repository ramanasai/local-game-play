package game2048

import (
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
)

type Service struct {
	repo *repos.Game2048Repo
}

func NewService(repo *repos.Game2048Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) SubmitScore(userID string, score int) error {
	// Simple validation
	if score < 0 {
		return nil // Just ignore negative scores
	}
	return s.repo.SaveScore(userID, score)
}

func (s *Service) GetLeaderboard(limit int) ([]domain.Score2048, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetLeaderboard(limit)
}
