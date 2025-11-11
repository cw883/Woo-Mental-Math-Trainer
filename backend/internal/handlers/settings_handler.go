package handlers

import (
	"net/http"

	"github.com/calebwoo/mental-math-trainer/internal/database"
	"github.com/calebwoo/mental-math-trainer/internal/models"
	"github.com/gin-gonic/gin"
)

// GetSettings retrieves settings for a user (or default settings for anonymous)
func GetSettings(c *gin.Context) {
	userID := c.Query("user_id")

	if userID == "" {
		// Return default settings for anonymous users
		c.JSON(http.StatusOK, getDefaultSettings())
		return
	}

	var settings models.Settings
	if err := database.DB.Where("user_id = ?", userID).First(&settings).Error; err != nil {
		// If no settings found, return defaults
		c.JSON(http.StatusOK, getDefaultSettings())
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdateSettings updates or creates settings for a user
func UpdateSettings(c *gin.Context) {
	var settings models.Settings
	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if settings exist
	var existing models.Settings
	result := database.DB.Where("user_id = ?", settings.UserID).First(&existing)

	if result.Error != nil {
		// Create new settings
		if err := database.DB.Create(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		// Update existing settings
		settings.ID = existing.ID
		if err := database.DB.Save(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, settings)
}

// getDefaultSettings returns the default settings
func getDefaultSettings() models.Settings {
	return models.Settings{
		AdditionEnabled:        true,
		AdditionMin:            2,
		AdditionMax:            100,
		SubtractionEnabled:     true,
		SubtractionMin:         2,
		SubtractionMax:         100,
		MultiplicationEnabled:  true,
		MultiplicationMin:      2,
		MultiplicationMax:      12,
		DivisionEnabled:        true,
		DivisionMin:            2,
		DivisionMax:            12,
	}
}
