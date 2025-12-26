package domain

import (
	"time"
)

type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"created_at"`
}

type Session struct {
	ID        string    `json:"id"`
	Token     string    `json:"token"`
	UserID    string    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Score struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Moves       int       `json:"moves"`
	TimeSeconds int       `json:"time_seconds"`
	CreatedAt   time.Time `json:"created_at"`
	// Additional field for creating/showing leaderboard often includes username
	Username string `json:"username,omitempty"`
}

type Match struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	Difficulty string    `json:"difficulty"`
	Result     string    `json:"result"`
	Moves      int       `json:"moves"`
	CreatedAt  time.Time `json:"created_at"`
}

type StatsSummary struct {
	Wins   int `json:"wins"`
	Losses int `json:"losses"`
	Draws  int `json:"draws"`
}
