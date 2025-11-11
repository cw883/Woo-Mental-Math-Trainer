package handlers

import (
	"fmt"
	"net/http"

	"github.com/calebwoo/mental-math-trainer/internal/database"
	"github.com/calebwoo/mental-math-trainer/internal/models"
	"github.com/gin-gonic/gin"
)

// SubmitProblem records a problem attempt for a session
func SubmitProblem(c *gin.Context) {
	sessionID := c.Param("id")

	var req models.SubmitProblemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify session exists
	var session models.Session
	if err := database.DB.First(&session, sessionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	// Convert sessionID string to uint
	var sessionIDUint uint
	if _, err := fmt.Sscanf(sessionID, "%d", &sessionIDUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	isCorrect := req.UserAnswer == req.Answer

	problem := models.Problem{
		SessionID:   sessionIDUint,
		Question:    req.Question,
		Answer:      req.Answer,
		UserAnswer:  &req.UserAnswer,
		TimeSpentMs: req.TimeSpentMs,
		TypoCount:   req.TypoCount,
		IsCorrect:   isCorrect,
	}

	if err := database.DB.Create(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save problem"})
		return
	}

	c.JSON(http.StatusCreated, problem)
}
