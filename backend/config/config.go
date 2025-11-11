package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Load loads environment variables from .env file
func Load() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found (%v), using environment variables\n", err)
	} else {
		log.Println("Loaded .env file successfully")
	}

	// Set defaults if not provided
	setDefault("PORT", "8080")
	setDefault("DB_HOST", "localhost")
	setDefault("DB_PORT", "5432")
	setDefault("DB_SSLMODE", "disable")

	// Debug: Print what we loaded
	log.Printf("DB_NAME: %s", os.Getenv("DB_NAME"))
	log.Printf("DB_USER: %s", os.Getenv("DB_USER"))
}

func setDefault(key, value string) {
	if os.Getenv(key) == "" {
		os.Setenv(key, value)
	}
}
