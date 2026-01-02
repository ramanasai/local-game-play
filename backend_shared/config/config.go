package config

import (
	"os"

	"github.com/rs/zerolog/log"
)

type Config struct {
	Port       string
	DBPath     string
	CORSOrigin string
}

func Load() *Config {
	log.Info().Msg("Loading config")
	log.Info().Str("port", getEnv("PORT", "8080")).Msg("Port")
	log.Info().Str("db_path", getEnv("DB_PATH", "./data/local_games.db")).Msg("DB Path")
	log.Info().Str("cors_origin", getEnv("CORS_ORIGIN", "http://localhost:5173")).Msg("CORS Origin")
	return &Config{
		Port:       getEnv("PORT", "8080"),
		DBPath:     getEnv("DB_PATH", "./data/local_games.db"),
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
	}
}

func getEnv(key, fallback string) string {
	log.Info().Str("key", key).Str("fallback", fallback).Msg("Getting env")
	if value, exists := os.LookupEnv(key); exists {
		log.Info().Str("value", value).Msg("Found env")
		return value
	}
	log.Info().Str("value", fallback).Msg("Using fallback")
	return fallback
}
