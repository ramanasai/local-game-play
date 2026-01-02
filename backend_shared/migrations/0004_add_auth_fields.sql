-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN pin_hash TEXT;
ALTER TABLE users ADD COLUMN hint TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN pin_hash;
ALTER TABLE users DROP COLUMN hint;
-- +goose StatementEnd
