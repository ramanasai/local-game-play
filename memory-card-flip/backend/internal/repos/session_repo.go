package repos

import (
	"database/sql"
	"example.com/memory/internal/db"
	"github.com/google/uuid"
)

type SessionRepo struct {
	DB *sql.DB
}

func NewSessionRepo(d *sql.DB) *SessionRepo {
	return &SessionRepo{DB: d}
}

func (r *SessionRepo) Create(userID string) (*db.Session, error) {
	id := uuid.New().String()
	token := uuid.New().String()
	
	session := &db.Session{
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

func (r *SessionRepo) GetByToken(token string) (*db.Session, error) {
	query := `SELECT id, token, user_id, created_at FROM sessions WHERE token = ?`
	row := r.DB.QueryRow(query, token)
	
	var session db.Session
	err := row.Scan(&session.ID, &session.Token, &session.UserID, &session.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &session, nil
}
