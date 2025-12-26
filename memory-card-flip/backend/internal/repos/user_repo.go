package repos

import (
	"database/sql"
	"example.com/memory/internal/db"
	"github.com/google/uuid"
)

type UserRepo struct {
	DB *sql.DB
}

func NewUserRepo(d *sql.DB) *UserRepo {
	return &UserRepo{DB: d}
}

func (r *UserRepo) Create(username string) (*db.User, error) {
	id := uuid.New().String()
	user := &db.User{
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

func (r *UserRepo) GetByUsername(username string) (*db.User, error) {
	query := `SELECT id, username, created_at FROM users WHERE username = ?`
	row := r.DB.QueryRow(query, username)
	
	var user db.User
	err := row.Scan(&user.ID, &user.Username, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) GetByID(id string) (*db.User, error) {
	query := `SELECT id, username, created_at FROM users WHERE id = ?`
	row := r.DB.QueryRow(query, id)
	
	var user db.User
	err := row.Scan(&user.ID, &user.Username, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
