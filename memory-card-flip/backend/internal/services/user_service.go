package services

import (
	"example.com/memory/internal/db"
	"example.com/memory/internal/repos"
)

type UserService struct {
	UserRepo    *repos.UserRepo
	SessionRepo *repos.SessionRepo
}

func NewUserService(u *repos.UserRepo, s *repos.SessionRepo) *UserService {
	return &UserService{
		UserRepo:    u,
		SessionRepo: s,
	}
}

func (s *UserService) LoginOrRegister(username string) (*db.User, *db.Session, error) {
	// Try to find user
	user, err := s.UserRepo.GetByUsername(username)
	if err != nil {
		// Assuming error means not found for simplicity in this demo, or handle specifically
		// For now if error, try creating
		user, err = s.UserRepo.Create(username)
		if err != nil {
			return nil, nil, err
		}
	}

	// Create session
	session, err := s.SessionRepo.Create(user.ID)
	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}

func (s *UserService) GetUser(id string) (*db.User, error) {
	return s.UserRepo.GetByID(id)
}
