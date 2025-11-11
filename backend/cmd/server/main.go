package main

import (
	"log"
	"os"

	"github.com/calebwoo/mental-math-trainer/config"
	"github.com/calebwoo/mental-math-trainer/internal/database"
	"github.com/calebwoo/mental-math-trainer/internal/handlers"
	"github.com/calebwoo/mental-math-trainer/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config.Load()

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize Gin router
	router := gin.Default()

	// Setup CORS middleware
	router.Use(middleware.SetupCORS())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/api")
	{
		// Session routes
		api.POST("/sessions", handlers.CreateSession)
		api.GET("/sessions/:id", handlers.GetSession)
		api.PATCH("/sessions/:id/complete", handlers.CompleteSession)
		api.GET("/sessions", handlers.GetSessions)

		// Problem routes
		api.POST("/sessions/:id/problems", handlers.SubmitProblem)

		// Settings routes
		api.GET("/settings", handlers.GetSettings)
		api.PUT("/settings", handlers.UpdateSettings)
	}

	// Start server
	port := os.Getenv("PORT")
	log.Printf("Server starting on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
