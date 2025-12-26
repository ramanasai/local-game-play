package repos

import (
	"database/sql"
	"fmt"
)

type User struct {
	ID        string
	Username  string
	Token     string
	CreatedAt string
}

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(user *User) error {
	query := `INSERT INTO users (id, username, token) VALUES (?, ?, ?)`
	_, err := r.db.Exec(query, user.ID, user.Username, user.Token)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (r *UserRepo) GetByToken(token string) (*User, error) {
	query := `SELECT id, username, token, created_at FROM users WHERE token = ?`
	row := r.db.QueryRow(query, token)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Token, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Not found
		}
		return nil, fmt.Errorf("failed to get user by token: %w", err)
	}
	return &user, nil
}

func (r *UserRepo) GetByUsername(username string) (*User, error) {
	query := `SELECT id, username, token, created_at FROM users WHERE username = ?`
	row := r.db.QueryRow(query, username)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Token, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Not found
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}
