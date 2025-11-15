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
		// Auth routes (no authentication required)
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)

		// Leaderboard route (no authentication required)
		api.GET("/leaderboard", handlers.GetLeaderboard)

		// Routes with optional authentication
		optionalAuth := api.Group("/")
		optionalAuth.Use(middleware.OptionalAuth())
		{
			// Session routes (can be used anonymously or authenticated)
			optionalAuth.POST("/sessions", handlers.CreateSession)
			optionalAuth.GET("/sessions/:id", handlers.GetSession)
			optionalAuth.PATCH("/sessions/:id/complete", handlers.CompleteSession)
			optionalAuth.DELETE("/sessions/:id", handlers.DeleteSession)
			optionalAuth.GET("/sessions", handlers.GetSessions)

			// Problem routes
			optionalAuth.POST("/sessions/:id/problems", handlers.SubmitProblem)
		}

		// Protected routes (authentication required)
		protected := api.Group("/")
		protected.Use(middleware.RequireAuth())
		{
			// User profile
			protected.GET("/auth/me", handlers.GetCurrentUser)

			// Settings routes (require authentication)
			protected.GET("/settings", handlers.GetSettings)
			protected.PUT("/settings", handlers.UpdateSettings)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	log.Printf("Server starting on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
