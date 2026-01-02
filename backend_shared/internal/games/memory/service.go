package memory

import (
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
	"github.com/rs/zerolog/log"
)

type Service struct {
	scoreRepo *repos.ScoreRepo
}

func NewService(scoreRepo *repos.ScoreRepo) *Service {
	return &Service{scoreRepo: scoreRepo}
}

func (s *Service) SubmitScore(userID string, moves, timeSeconds int) error {
	log.Debug().Str("user_id", userID).Int("moves", moves).Int("time", timeSeconds).Msg("Memory Service: Submitting score")
	return s.scoreRepo.Create(userID, moves, timeSeconds)
}

func (s *Service) GetLeaderboard(limit int) ([]domain.Score, error) {
	log.Debug().Int("limit", limit).Msg("Memory Service: Fetching leaderboard")
	return s.scoreRepo.GetLeaderboard(limit)
}
