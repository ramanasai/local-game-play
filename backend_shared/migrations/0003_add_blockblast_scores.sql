-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS scores_blockblast (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_scores_blockblast_score ON scores_blockblast(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_blockblast_user_id ON scores_blockblast(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS scores_blockblast;
-- +goose StatementEnd
