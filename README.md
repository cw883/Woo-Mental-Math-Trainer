# Mental Math Trainer

**Live Demo**: https://woo-mental-math-trainer.vercel.app/

A full-stack mental math training application inspired by Zetamac, featuring user authentication, real-time leaderboards, and detailed analytics.

## Features

### Core Gameplay
- **Customizable problem sets**: Configure ranges for addition, subtraction, multiplication, and division
- **Timed sessions**: 120-second practice sessions with countdown timer
- **Auto-advancing**: Instantly move to the next problem on correct answer
- **Instant restart**: Quick session restart functionality

### Analytics & Tracking
- **Detailed problem analytics**: Track time spent and typos per problem
- **Session history**: View all past sessions with complete problem breakdowns
- **Progress charts**: Visualize your improvement over time with interactive graphs
- **Performance metrics**: Track accuracy, speed, and consistency

### User Features
- **User authentication**: Secure signup/login with JWT authentication
- **Leaderboards**: Compete with others and view top scores
- **Personal profile**: Track your progress and statistics
- **Settings persistence**: Your preferences are saved to your account

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Charts**: Recharts
- **State Management**: React Hooks + Context API

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin
- **ORM**: GORM
- **Authentication**: JWT tokens
- **Database**: PostgreSQL (Supabase in production)

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # Go backend API
│   ├── cmd/server/    # Main application entry point
│   ├── internal/      # Internal packages
│   │   ├── models/    # Database models
│   │   ├── handlers/  # HTTP handlers
│   │   ├── middleware/# Middleware (CORS, etc.)
│   │   └── database/  # Database connection & migrations
│   └── config/        # Configuration loading
└── README.md          # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+
- PostgreSQL 13+

### Backend Setup

1. **Install Go** from https://golang.org/dl/

2. **Set up the database**:
   ```bash
   createdb mental_math_trainer
   ```

3. **Configure environment**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Install dependencies and run**:
   ```bash
   go mod download
   go run cmd/server/main.go
   ```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Deployment

The application is deployed at: https://woo-mental-math-trainer.vercel.app/

**Stack:**
- **Frontend**: Vercel
- **Backend**: Fly.io
- **Database**: Supabase PostgreSQL

## Development Status

### Completed Features
- ✅ Core game functionality with timed sessions
- ✅ User authentication and authorization
- ✅ Advanced analytics with interactive charts
- ✅ Leaderboard system
- ✅ Session history and problem tracking
- ✅ Settings management and persistence

### Future Enhancements
- [ ] Mobile app (React Native or PWA)
- [ ] Social features (friends, challenges)
- [ ] Custom game modes
- [ ] Achievement system
- [ ] Dark mode
- [ ] Keyboard shortcuts customization

## License

MIT
