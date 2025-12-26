package services

import (
	"errors"
	"fmt"

	"example.com/tictactoe/internal/repos"
	"github.com/google/uuid"
)

type UserService struct {
	repo *repos.UserRepo
}

func NewUserService(repo *repos.UserRepo) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) LoginOrRegister(username string) (*repos.User, error) {
	if username == "" {
		return nil, errors.New("username cannot be empty")
	}

	// Try to find existing user
	user, err := s.repo.GetByUsername(username)
	if err != nil {
		return nil, err
	}
	if user != nil {
		return user, nil
	}

	// Register new user
	newUser := &repos.User{
		ID:       uuid.NewString(),
		Username: username,
		Token:    uuid.NewString(), // Simple token for this demo
	}

	if err := s.repo.Create(newUser); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return newUser, nil
}

func (s *UserService) GetUserByToken(token string) (*repos.User, error) {
	return s.repo.GetByToken(token)
}
