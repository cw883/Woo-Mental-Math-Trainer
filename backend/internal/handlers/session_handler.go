package handlers

import (
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
		// If no body provided, create anonymous session
		req.UserID = nil
	}

	session := models.Session{
		UserID:    req.UserID,
		Score:     0,
		Duration:  120, // 120 seconds
		StartedAt: time.Now(),
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

// GetSessions retrieves all sessions, optionally filtered by user_id
func GetSessions(c *gin.Context) {
	userID := c.Query("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Session{})

	// Filter by user_id if provided
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	} else {
		// For anonymous users, get sessions without user_id
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
			ID:        session.ID,
			Score:     session.Score,
			Duration:  session.Duration,
			StartedAt: session.StartedAt,
			EndedAt:   endedAt,
		}
	}

	c.JSON(http.StatusOK, summaries)
}
