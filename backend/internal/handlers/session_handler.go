package handlers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/calebwoo/mental-math-trainer/internal/database"
	"github.com/calebwoo/mental-math-trainer/internal/models"
	"github.com/gin-gonic/gin"
)

// CreateSession creates a new practice session
func CreateSession(c *gin.Context) {
	var req models.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// If no body provided, use defaults
		req.IsDefaultSettings = false
	}

	session := models.Session{
		Score:             0,
		Duration:          120, // 120 seconds
		IsDefaultSettings: req.IsDefaultSettings,
		StartedAt:         time.Now(),
	}

	// Check if user is authenticated
	if userID, exists := c.Get("user_id"); exists {
		// User is authenticated, use their ID
		uid := userID.(uint)
		session.UserID = &uid
	} else {
		// User is anonymous, generate a fun anonymous name
		session.AnonymousName = generateAnonymousName()
		session.UserID = nil
	}

	if err := database.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	c.JSON(http.StatusCreated, models.CreateSessionResponse{
		SessionID: session.ID,
		StartedAt: session.StartedAt,
	})
}

// generateAnonymousName creates a fun anonymous name
func generateAnonymousName() string {
	adjectives := []string{
		"Swift", "Clever", "Quick", "Sharp", "Brilliant",
		"Fast", "Smart", "Rapid", "Nimble", "Speedy",
		"Bright", "Keen", "Alert", "Agile", "Deft",
	}

	nouns := []string{
		"Calculator", "Mathematician", "Scholar", "Genius", "Wizard",
		"Master", "Expert", "Champion", "Ace", "Pro",
		"Ninja", "Samurai", "Knight", "Hero", "Legend",
	}

	rand.Seed(time.Now().UnixNano())
	adjective := adjectives[rand.Intn(len(adjectives))]
	noun := nouns[rand.Intn(len(nouns))]
	number := rand.Intn(9999) + 1

	return fmt.Sprintf("%s %s %d", adjective, noun, number)
}

// GetSession retrieves a session by ID with all problems
func GetSession(c *gin.Context) {
	sessionID := c.Param("id")

	var session models.Session
	if err := database.DB.Preload("Problems").First(&session, sessionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	c.JSON(http.StatusOK, session)
}

// CompleteSession marks a session as complete and saves the final score
func CompleteSession(c *gin.Context) {
	sessionID := c.Param("id")

	var req models.CompleteSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var session models.Session
	if err := database.DB.First(&session, sessionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	now := time.Now()
	session.EndedAt = &now
	session.Score = req.Score

	if err := database.DB.Save(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update session"})
		return
	}

	c.JSON(http.StatusOK, session)
}

// DeleteSession deletes a session by ID
func DeleteSession(c *gin.Context) {
	sessionID := c.Param("id")

	// Delete associated problems first
	if err := database.DB.Where("session_id = ?", sessionID).Delete(&models.Problem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete session problems"})
		return
	}

	// Delete the session
	if err := database.DB.Delete(&models.Session{}, sessionID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Session deleted successfully"})
}

// GetSessions retrieves all sessions, optionally filtered by user_id
func GetSessions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Session{})

	// Check if user is authenticated from context (set by auth middleware)
	if userID, exists := c.Get("user_id"); exists {
		// User is authenticated, get their sessions
		query = query.Where("user_id = ?", userID.(uint))
	} else {
		// User is not authenticated, get anonymous sessions
		query = query.Where("user_id IS NULL")
	}

	var sessions []models.Session
	if err := query.
		Order("started_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sessions"})
		return
	}

	// Convert to summaries
	summaries := make([]models.SessionSummary, len(sessions))
	for i, session := range sessions {
		endedAt := time.Now()
		if session.EndedAt != nil {
			endedAt = *session.EndedAt
		}

		summaries[i] = models.SessionSummary{
			ID:                session.ID,
			Score:             session.Score,
			Duration:          session.Duration,
			IsDefaultSettings: session.IsDefaultSettings,
			StartedAt:         session.StartedAt,
			EndedAt:           endedAt,
		}
	}

	c.JSON(http.StatusOK, summaries)
}
