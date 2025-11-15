package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user of the mental math trainer
type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Username     string         `gorm:"uniqueIndex;not null" json:"username"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `json:"-"` // Never expose password hash in JSON
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
	Sessions     []Session      `gorm:"foreignKey:UserID" json:"sessions,omitempty"`
	Settings     *Settings      `gorm:"foreignKey:UserID" json:"settings,omitempty"`
}

// Session represents a single practice session
type Session struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	UserID             *uint          `json:"user_id,omitempty"` // Nullable for anonymous users
	User               *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
	AnonymousName      string         `json:"anonymous_name,omitempty"` // Used when UserID is null
	Score              int            `json:"score"`
	Duration           int            `json:"duration"` // in seconds
	IsDefaultSettings  bool           `json:"is_default_settings" gorm:"default:false"`
	StartedAt          time.Time      `json:"started_at"`
	EndedAt            *time.Time     `json:"ended_at,omitempty"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
	Problems           []Problem      `gorm:"foreignKey:SessionID" json:"problems,omitempty"`
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
	AdditionMin1    int  `json:"addition_min1" gorm:"default:2;column:addition_min1"`
	AdditionMax1    int  `json:"addition_max1" gorm:"default:100;column:addition_max1"`
	AdditionMin2    int  `json:"addition_min2" gorm:"default:2;column:addition_min2"`
	AdditionMax2    int  `json:"addition_max2" gorm:"default:100;column:addition_max2"`

	// Subtraction settings
	SubtractionEnabled bool `json:"subtraction_enabled" gorm:"default:true"`
	SubtractionMin1    int  `json:"subtraction_min1" gorm:"default:2;column:subtraction_min1"`
	SubtractionMax1    int  `json:"subtraction_max1" gorm:"default:100;column:subtraction_max1"`
	SubtractionMin2    int  `json:"subtraction_min2" gorm:"default:2;column:subtraction_min2"`
	SubtractionMax2    int  `json:"subtraction_max2" gorm:"default:100;column:subtraction_max2"`

	// Multiplication settings
	MultiplicationEnabled bool `json:"multiplication_enabled" gorm:"default:true"`
	MultiplicationMin1    int  `json:"multiplication_min1" gorm:"default:2;column:multiplication_min1"`
	MultiplicationMax1    int  `json:"multiplication_max1" gorm:"default:12;column:multiplication_max1"`
	MultiplicationMin2    int  `json:"multiplication_min2" gorm:"default:2;column:multiplication_min2"`
	MultiplicationMax2    int  `json:"multiplication_max2" gorm:"default:100;column:multiplication_max2"`

	// Division settings
	DivisionEnabled bool `json:"division_enabled" gorm:"default:false"`
	DivisionMin1    int  `json:"division_min1" gorm:"default:2;column:division_min1"`
	DivisionMax1    int  `json:"division_max1" gorm:"default:12;column:division_max1"`
	DivisionMin2    int  `json:"division_min2" gorm:"default:2;column:division_min2"`
	DivisionMax2    int  `json:"division_max2" gorm:"default:100;column:division_max2"`
}

// CreateSessionRequest represents the request to create a new session
type CreateSessionRequest struct {
	UserID            *uint `json:"user_id,omitempty"`
	IsDefaultSettings bool  `json:"is_default_settings"`
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
	ID                uint      `json:"id"`
	Score             int       `json:"score"`
	Duration          int       `json:"duration"`
	IsDefaultSettings bool      `json:"is_default_settings"`
	StartedAt         time.Time `json:"started_at"`
	EndedAt           time.Time `json:"ended_at"`
}

// RegisterRequest represents the request to register a new user
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest represents the request to log in
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse represents the response for login/register
type AuthResponse struct {
	Token    string `json:"token"`
	User     User   `json:"user"`
}

// LeaderboardEntry represents a single entry in the leaderboard
type LeaderboardEntry struct {
	Rank          int       `json:"rank"`
	Username      string    `json:"username"`
	Score         int       `json:"score"`
	Duration      int       `json:"duration"`
	StartedAt     time.Time `json:"started_at"`
	IsAnonymous   bool      `json:"is_anonymous"`
}
