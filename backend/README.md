# Mental Math Trainer - Backend

Go backend API for the Mental Math Trainer application.

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 13 or higher

## Installation

1. **Install Go** (if not already installed):
   - Visit https://golang.org/dl/
   - Download and install Go for your operating system

2. **Install dependencies**:
   ```bash
   go mod download
   ```

3. **Set up PostgreSQL**:
   ```bash
   # Create database
   createdb mental_math_trainer
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

## Running the Server

```bash
# From the backend directory
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

### Sessions
- `POST /api/sessions` - Create a new session (requires auth)
- `GET /api/sessions/:id` - Get session details with problems (requires auth)
- `PATCH /api/sessions/:id/complete` - Complete a session (requires auth)
- `GET /api/sessions` - Get all user sessions with pagination (requires auth)
- `GET /api/leaderboard` - Get top scores leaderboard

### Problems
- `POST /api/sessions/:id/problems` - Submit a problem answer (requires auth)

### Settings
- `GET /api/settings` - Get user settings (requires auth)
- `PUT /api/settings` - Update user settings (requires auth)

### Health Check
- `GET /health` - Check server status

## Database Schema

The application automatically runs migrations on startup, creating these tables:

- **users** - User accounts
- **sessions** - Practice sessions
- **problems** - Individual math problems within sessions
- **settings** - User preferences for problem generation

## Development

```bash
# Install Air for hot reloading (optional)
go install github.com/cosmtrek/air@latest

# Run with hot reload
air
```

## Building for Production

```bash
go build -o bin/server cmd/server/main.go
./bin/server
```
