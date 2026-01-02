package game2048

import (
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
	"github.com/rs/zerolog/log"
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
		log.Warn().Int("score", score).Msg("2048 Service: Ignoring negative score")
		return nil // Just ignore negative scores
	}
	log.Debug().Str("user_id", userID).Int("score", score).Msg("2048 Service: Submitting score")
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
