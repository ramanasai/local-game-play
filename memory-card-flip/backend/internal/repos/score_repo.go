package repos

import (
	"database/sql"
	"example.com/memory/internal/db"
	"github.com/google/uuid"
)

type ScoreRepo struct {
	DB *sql.DB
}

func NewScoreRepo(d *sql.DB) *ScoreRepo {
	return &ScoreRepo{DB: d}
}

func (r *ScoreRepo) Create(userID string, moves, timeSeconds int) error {
	id := uuid.New().String()
	query := `INSERT INTO scores (id, user_id, moves, time_seconds) VALUES (?, ?, ?, ?)`
	_, err := r.DB.Exec(query, id, userID, moves, timeSeconds)
	return err
}

func (r *ScoreRepo) GetLeaderboard(limit int) ([]db.Score, error) {
	query := `
		SELECT s.id, s.user_id, s.moves, s.time_seconds, s.created_at, u.username
		FROM scores s
		JOIN users u ON s.user_id = u.id
		ORDER BY s.moves ASC, s.time_seconds ASC
		LIMIT ?
	`
	rows, err := r.DB.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var scores []db.Score
	for rows.Next() {
		var s db.Score
		if err := rows.Scan(&s.ID, &s.UserID, &s.Moves, &s.TimeSeconds, &s.CreatedAt, &s.Username); err != nil {
			return nil, err
		}
		scores = append(scores, s)
	}
	return scores, nil
}
