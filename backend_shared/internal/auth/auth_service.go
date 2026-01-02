package auth

import (
	"errors"

	"github.com/ramanasai/local-game-play/internal/domain"
	"github.com/ramanasai/local-game-play/internal/repos"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo    *repos.UserRepo
	sessionRepo *repos.SessionRepo // Kept for legacy session cleanup if needed, but not primary
}

func NewAuthService(userRepo *repos.UserRepo, sessionRepo *repos.SessionRepo) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
	}
}

// LoginResponse contains what the handler needs to send back
type LoginResponse struct {
	User   *domain.User
	Token  string
	Status string // "OK", "PIN_REQUIRED", "SET_PIN_REQUIRED"
}

func (s *AuthService) Login(username string, pin string, hint string) (*LoginResponse, error) {
	user, err := s.userRepo.GetByUsername(username)
	if err != nil {
		// User not found -> Create new user.
		user, err = s.userRepo.Create(username)
		if err != nil {
			return nil, err
		}
		// If PIN provided during creation (fast track), set it now
		if pin != "" {
			if err := s.UpdatePIN(user.ID, pin, hint); err != nil {
				return nil, err
			}
			// Refresh user to get hash
			user, _ = s.userRepo.GetByID(user.ID) // ignore err
		}
	}

	// User exists
	if user.PinHash == "" {
		// Legacy user without PIN.
		// If PIN is provided now, SET IT.
		if pin != "" {
			if err := s.UpdatePIN(user.ID, pin, hint); err != nil {
				return nil, err
			}
			// Generate token immediately
			// Refresh user object? Not strictly needed for token gen but good for correctness
			user.PinHash = "set" // simplified
		} else {
			return &LoginResponse{User: user, Status: "SET_PIN_REQUIRED"}, nil
		}
	}

	// PIN is supposedly set now (either existed or just set)
	// Verify it
	if pin == "" {
		return &LoginResponse{User: user, Status: "PIN_REQUIRED"}, nil
	}

	// If we just set it, we could skip re-verify, but verify adds safety.
	// Note: If we just called UpdatePIN, we don't have the hash in 'user.PinHash' unless we refetched.
	// Let's refetch to be safe if it was empty.
	if user.PinHash == "" || user.PinHash == "set" {
		u, err := s.userRepo.GetByID(user.ID)
		if err != nil {
			return nil, err
		}
		user = u
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PinHash), []byte(pin))
	if err != nil {
		return nil, errors.New("invalid pin")
	}

	// Valid PIN -> Generate JWT
	token, err := GenerateToken(user)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{User: user, Token: token, Status: "OK"}, nil
}

func (s *AuthService) UpdatePIN(userID string, pin string, hint string) error {
	if len(pin) < 4 {
		return errors.New("pin must be at least 4 digits")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(pin), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.userRepo.UpdatePIN(userID, string(hash), hint)
}

func (s *AuthService) GetUserFromToken(tokenString string) (*domain.User, error) {
	// Validate JWT
	claims, err := ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	return s.userRepo.GetByID(claims.UserID)
}
