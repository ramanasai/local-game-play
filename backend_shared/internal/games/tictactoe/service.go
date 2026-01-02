package tictactoe

import (
	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
	"github.com/rs/zerolog/log"
)

type Service struct {
	matchRepo *repos.MatchRepo
}

func NewService(matchRepo *repos.MatchRepo) *Service {
	return &Service{matchRepo: matchRepo}
}

func (s *Service) SaveMatch(userID, difficulty, result string, moves int) error {
	matchID := uuid.New().String()
	log.Info().Str("match_id", matchID).Str("user_id", userID).Str("result", result).Msg("TicTacToe Service: Saving match")

	match := &domain.Match{
		ID:         matchID,
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

func (s *Service) GetLeaderboard(limit int) ([]repos.TTTLeaderboardEntry, error) {
	return s.matchRepo.GetLeaderboard(limit)
}

func (s *Service) GetMove(board []string, xQueue, oQueue []int) int {
	log.Debug().Msg("TicTacToe Service: Calculating move")
	return GetBestMove(board, xQueue, oQueue)
}
