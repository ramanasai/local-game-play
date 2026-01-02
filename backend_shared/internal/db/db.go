package db

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	"github.com/rs/zerolog/log"
	_ "modernc.org/sqlite"
)

func Connect(dbPath string) (*sql.DB, error) {
	if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
		log.Error().Err(err).Msg("Failed to create data directory")
		return nil, fmt.Errorf("failed to create data directory: %w", err)
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Error().Err(err).Msg("Failed to open DB")
		return nil, err
	}

	if err := db.Ping(); err != nil {
		log.Error().Err(err).Msg("Failed to ping DB")
		return nil, err
	}

	return db, nil
}
