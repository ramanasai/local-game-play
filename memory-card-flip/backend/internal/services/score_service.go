package services

import (
	"example.com/memory/internal/db"
	"example.com/memory/internal/repos"
)

type ScoreService struct {
	ScoreRepo *repos.ScoreRepo
}

func NewScoreService(r *repos.ScoreRepo) *ScoreService {
	return &ScoreService{ScoreRepo: r}
}

func (s *ScoreService) AddScore(userID string, moves, timeSeconds int) error {
	return s.ScoreRepo.Create(userID, moves, timeSeconds)
}

func (s *ScoreService) GetLeaderboard(limit int) ([]db.Score, error) {
	return s.ScoreRepo.GetLeaderboard(limit)
}
