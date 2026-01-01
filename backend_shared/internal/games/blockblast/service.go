package blockblast

import (
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
)

type Service struct {
	repo *repos.BlockBlastRepo
}

func NewService(repo *repos.BlockBlastRepo) *Service {
	return &Service{repo: repo}
}

func (s *Service) SubmitScore(userID string, score int) error {
	return s.repo.SaveScore(userID, score)
}

func (s *Service) GetLeaderboard(limit int) ([]domain.ScoreBlockBlast, error) {
	return s.repo.GetLeaderboard(limit)
}
