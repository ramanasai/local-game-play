package repos

import (
	"database/sql"

	"github.com/google/uuid"
	"github.com/ramanasai/local-game-play/internal/domain"
)

type UserRepo struct {
	DB *sql.DB
}

func NewUserRepo(d *sql.DB) *UserRepo {
	return &UserRepo{DB: d}
}

func (r *UserRepo) Create(username string) (*domain.User, error) {
	id := uuid.New().String()
	user := &domain.User{
		ID:       id,
		Username: username,
	}

	query := `INSERT INTO users (id, username) VALUES (?, ?)`
	_, err := r.DB.Exec(query, id, username)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepo) GetByUsername(username string) (*domain.User, error) {
	query := `SELECT id, username, pin_hash, hint, created_at FROM users WHERE username = ?`
	row := r.DB.QueryRow(query, username)

	var user domain.User
	var pinHash, hint sql.NullString
	err := row.Scan(&user.ID, &user.Username, &pinHash, &hint, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	user.PinHash = pinHash.String
	user.Hint = hint.String
	return &user, nil
}

func (r *UserRepo) GetByID(id string) (*domain.User, error) {
	query := `SELECT id, username, pin_hash, hint, created_at FROM users WHERE id = ?`
	row := r.DB.QueryRow(query, id)

	var user domain.User
	var pinHash, hint sql.NullString
	err := row.Scan(&user.ID, &user.Username, &pinHash, &hint, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	user.PinHash = pinHash.String
	user.Hint = hint.String
	return &user, nil
}

func (r *UserRepo) UpdatePIN(userID, pinHash, hint string) error {
	query := `UPDATE users SET pin_hash = ?, hint = ? WHERE id = ?`
	_, err := r.DB.Exec(query, pinHash, hint, userID)
	return err
}
