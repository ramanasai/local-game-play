package repos

import (
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
)

type BlockBlastRepo struct {
	db *sql.DB
}

func NewBlockBlastRepo(db *sql.DB) *BlockBlastRepo {
	return &BlockBlastRepo{db: db}
}

func (r *BlockBlastRepo) SaveScore(userID string, score int) error {
	id := uuid.New().String()
	query := `INSERT INTO scores_blockblast (id, user_id, score) VALUES (?, ?, ?)`
	_, err := r.db.Exec(query, id, userID, score)
	if err != nil {
		return fmt.Errorf("failed to save blockblast score: %w", err)
	}
	return nil
}

func (r *BlockBlastRepo) GetLeaderboard(limit int) ([]domain.ScoreBlockBlast, error) {
	query := `
		SELECT s.id, s.user_id, s.score, s.created_at, u.username
		FROM scores_blockblast s
		JOIN users u ON s.user_id = u.id
		ORDER BY s.score DESC
		LIMIT ?
	`
	rows, err := r.db.Query(query, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get blockblast leaderboard: %w", err)
	}
	defer rows.Close()

	scores := []domain.ScoreBlockBlast{}
	for rows.Next() {
		var s domain.ScoreBlockBlast
		if err := rows.Scan(&s.ID, &s.UserID, &s.Score, &s.CreatedAt, &s.Username); err != nil {
			return nil, err
		}
		scores = append(scores, s)
	}
	return scores, nil
}
