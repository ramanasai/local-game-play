package auth

import (
	"errors"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
)

type AuthService struct {
	userRepo    *repos.UserRepo
	sessionRepo *repos.SessionRepo
}

func NewAuthService(userRepo *repos.UserRepo, sessionRepo *repos.SessionRepo) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
	}
}

func (s *AuthService) LoginOrCreate(username string) (*domain.User, *domain.Session, error) {
	// 1. Try to find user
	user, err := s.userRepo.GetByUsername(username)
	if err != nil {
		// Assuming error means not found (simplified)
		// In a real app check specific errors
		user, err = s.userRepo.Create(username)
		if err != nil {
			return nil, nil, err
		}
	}

	// 2. Create Session
	session, err := s.sessionRepo.Create(user.ID)
	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}

func (s *AuthService) GetUserFromToken(token string) (*domain.User, error) {
	session, err := s.sessionRepo.GetByToken(token)
	if err != nil {
		return nil, errors.New("invalid token")
	}

	return s.userRepo.GetByID(session.UserID)
}
