package db

import (
	"database/sql"
	"fmt"
	"log"
	
	_ "modernc.org/sqlite"
)

func Connect(dbPath string) (*sql.DB, error) {
	// Ensure directory exists
	// separate concern? For now assuming it exists or let caller handle.
	
	dsn := fmt.Sprintf("file:%s?_pragma=foreign_keys(1)", dbPath)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Connected to SQLite database at", dbPath)
	return db, nil
}
