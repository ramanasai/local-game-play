package repos

import (
	"database/sql"

	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
)

type SessionRepo struct {
	DB *sql.DB
}

func NewSessionRepo(d *sql.DB) *SessionRepo {
	return &SessionRepo{DB: d}
}

func (r *SessionRepo) Create(userID string) (*domain.Session, error) {
	id := uuid.New().String()
	token := uuid.New().String()

	session := &domain.Session{
		ID:     id,
		Token:  token,
		UserID: userID,
	}

	query := `INSERT INTO sessions (id, token, user_id) VALUES (?, ?, ?)`
	_, err := r.DB.Exec(query, id, token, userID)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (r *SessionRepo) GetByToken(token string) (*domain.Session, error) {
	query := `SELECT id, token, user_id, created_at FROM sessions WHERE token = ?`
	row := r.DB.QueryRow(query, token)

	var session domain.Session
	err := row.Scan(&session.ID, &session.Token, &session.UserID, &session.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &session, nil
}
