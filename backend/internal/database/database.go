package database

import (
	"fmt"
	"log"
	"os"

	"github.com/calebwoo/mental-math-trainer/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect initializes the database connection
func Connect() error {
	var err error

	// Check for DATABASE_URL first (used by many cloud providers)
	dsn := os.Getenv("DATABASE_URL")

	// If DATABASE_URL is not set, build DSN from individual parameters
	if dsn == "" {
		// Build DSN, omitting password if empty
		password := os.Getenv("DB_PASSWORD")
		if password == "" {
			dsn = fmt.Sprintf(
				"host=%s user=%s dbname=%s port=%s sslmode=%s",
				os.Getenv("DB_HOST"),
				os.Getenv("DB_USER"),
				os.Getenv("DB_NAME"),
				os.Getenv("DB_PORT"),
				os.Getenv("DB_SSLMODE"),
			)
		} else {
			dsn = fmt.Sprintf(
				"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
				os.Getenv("DB_HOST"),
				os.Getenv("DB_USER"),
				password,
				os.Getenv("DB_NAME"),
				os.Getenv("DB_PORT"),
				os.Getenv("DB_SSLMODE"),
			)
		}
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection established")
	return nil
}

// Migrate runs database migrations
func Migrate() error {
	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Session{},
		&models.Problem{},
		&models.Settings{},
	)

	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}
