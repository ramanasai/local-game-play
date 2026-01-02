package repos

import (
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/rs/zerolog/log"
)

type Game2048Repo struct {
	db *sql.DB
}

func NewGame2048Repo(db *sql.DB) *Game2048Repo {
	return &Game2048Repo{db: db}
}

func (r *Game2048Repo) SaveScore(userID string, score int) error {
	id := uuid.New().String()
	query := `INSERT INTO scores_2048 (id, user_id, score) VALUES (?, ?, ?)`
	_, err := r.db.Exec(query, id, userID, score)
	if err != nil {
		log.Error().Err(err).Str("user_id", userID).Int("score", score).Msg("Game2048Repo: Failed to save score")
		return fmt.Errorf("failed to save 2048 score: %w", err)
	}
	return nil
}

func (r *Game2048Repo) GetLeaderboard(limit int) ([]domain.Score2048, error) {
	query := `
		SELECT s.id, s.user_id, s.score, s.created_at, u.username
		FROM scores_2048 s
		JOIN users u ON s.user_id = u.id
		ORDER BY s.score DESC
		LIMIT ?
	`
	rows, err := r.db.Query(query, limit)
	if err != nil {
		log.Error().Err(err).Msg("Game2048Repo: Failed to get leaderboard")
		return nil, fmt.Errorf("failed to get 2048 leaderboard: %w", err)
	}
	defer rows.Close()

	scores := []domain.Score2048{}
	for rows.Next() {
		var s domain.Score2048
		if err := rows.Scan(&s.ID, &s.UserID, &s.Score, &s.CreatedAt, &s.Username); err != nil {
			log.Error().Err(err).Msg("Game2048Repo: Failed to scan score row")
			return nil, err
		}
		scores = append(scores, s)
	}
	return scores, nil
}
