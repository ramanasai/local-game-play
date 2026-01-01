-- +goose Up
CREATE TABLE IF NOT EXISTS scores_2048 (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_scores_2048_score ON scores_2048(score DESC);

-- +goose Down
DROP TABLE scores_2048;
