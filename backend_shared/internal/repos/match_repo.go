package repos

import (
	"database/sql"
	"fmt"

	"github.com/ramanasai/local-game-play/internal/domain"
)

type MatchRepo struct {
	db *sql.DB
}

func NewMatchRepo(db *sql.DB) *MatchRepo {
	return &MatchRepo{db: db}
}

func (r *MatchRepo) Create(match *domain.Match) error {
	query := `INSERT INTO matches (id, user_id, difficulty, result, moves) VALUES (?, ?, ?, ?, ?)`
	_, err := r.db.Exec(query, match.ID, match.UserID, match.Difficulty, match.Result, match.Moves)
	if err != nil {
		return fmt.Errorf("failed to create match: %w", err)
	}
	return nil
}

func (r *MatchRepo) GetStatsByUser(userID string) (map[string]domain.StatsSummary, error) {
	query := `
		SELECT difficulty, result, COUNT(*) 
		FROM matches 
		WHERE user_id = ? 
		GROUP BY difficulty, result
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query stats: %w", err)
	}
	defer rows.Close()

	summary := make(map[string]domain.StatsSummary)
	// Initialize map
	for _, d := range []string{"easy", "medium", "hard"} {
		summary[d] = domain.StatsSummary{}
	}

	for rows.Next() {
		var diff, res string
		var count int
		if err := rows.Scan(&diff, &res, &count); err != nil {
			return nil, err
		}

		s := summary[diff]
		switch res {
		case "win":
			s.Wins = count
		case "loss":
			s.Losses = count
		case "draw":
			s.Draws = count
		}
		summary[diff] = s
	}

	return summary, nil
}
