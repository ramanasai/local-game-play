-- +goose Up
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    moves INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  result      TEXT NOT NULL CHECK (result IN ('win','loss','draw')),
  moves       INTEGER NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_matches_user_created ON matches(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_diff_result ON matches(difficulty, result);

-- +goose Down
DROP TABLE matches;
DROP TABLE scores;
DROP TABLE sessions;
DROP TABLE users;
