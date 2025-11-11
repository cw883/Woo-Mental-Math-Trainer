package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user of the mental math trainer
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Email     string         `gorm:"uniqueIndex" json:"email"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Sessions  []Session      `gorm:"foreignKey:UserID" json:"sessions,omitempty"`
	Settings  *Settings      `gorm:"foreignKey:UserID" json:"settings,omitempty"`
}

// Session represents a single practice session
type Session struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    *uint          `json:"user_id,omitempty"` // Nullable for anonymous users
	Score     int            `json:"score"`
	Duration  int            `json:"duration"` // in seconds
	StartedAt time.Time      `json:"started_at"`
	EndedAt   *time.Time     `json:"ended_at,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Problems  []Problem      `gorm:"foreignKey:SessionID" json:"problems,omitempty"`
}

// Problem represents a single math problem in a session
type Problem struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	SessionID   uint      `json:"session_id"`
	Question    string    `json:"question"`
	Answer      int       `json:"answer"`
	UserAnswer  *int      `json:"user_answer,omitempty"`
	TimeSpentMs int       `json:"time_spent_ms"` // milliseconds
	TypoCount   int       `json:"typo_count"`    // number of backspaces/corrections
	IsCorrect   bool      `json:"is_correct"`
	CreatedAt   time.Time `json:"created_at"`
}

// Settings represents user preferences for problem generation
type Settings struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"uniqueIndex" json:"user_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Addition settings
	AdditionEnabled bool `json:"addition_enabled" gorm:"default:true"`
	AdditionMin     int  `json:"addition_min" gorm:"default:1"`
	AdditionMax     int  `json:"addition_max" gorm:"default:99"`

	// Subtraction settings
	SubtractionEnabled bool `json:"subtraction_enabled" gorm:"default:true"`
	SubtractionMin     int  `json:"subtraction_min" gorm:"default:1"`
	SubtractionMax     int  `json:"subtraction_max" gorm:"default:99"`

	// Multiplication settings
	MultiplicationEnabled bool `json:"multiplication_enabled" gorm:"default:true"`
	MultiplicationMin     int  `json:"multiplication_min" gorm:"default:1"`
	MultiplicationMax     int  `json:"multiplication_max" gorm:"default:12"`

	// Division settings
	DivisionEnabled bool `json:"division_enabled" gorm:"default:false"`
	DivisionMin     int  `json:"division_min" gorm:"default:1"`
	DivisionMax     int  `json:"division_max" gorm:"default:12"`
}

// CreateSessionRequest represents the request to create a new session
type CreateSessionRequest struct {
	UserID *uint `json:"user_id,omitempty"`
}

// CreateSessionResponse represents the response after creating a session
type CreateSessionResponse struct {
	SessionID uint      `json:"session_id"`
	StartedAt time.Time `json:"started_at"`
}

// SubmitProblemRequest represents the request to submit a problem answer
type SubmitProblemRequest struct {
	Question    string `json:"question" binding:"required"`
	Answer      int    `json:"answer" binding:"required"`
	UserAnswer  int    `json:"user_answer" binding:"required"`
	TimeSpentMs int    `json:"time_spent_ms" binding:"required"`
	TypoCount   int    `json:"typo_count"`
}

// CompleteSessionRequest represents the request to complete a session
type CompleteSessionRequest struct {
	Score int `json:"score" binding:"required"`
}

// SessionSummary represents a summary view of a session for the history list
type SessionSummary struct {
	ID        uint      `json:"id"`
	Score     int       `json:"score"`
	Duration  int       `json:"duration"`
	StartedAt time.Time `json:"started_at"`
	EndedAt   time.Time `json:"ended_at"`
}
