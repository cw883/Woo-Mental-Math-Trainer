# Mental Math Trainer
https://woo-mental-math-trainer.vercel.app/
A full-stack mental math training application inspired by Zetamac, with enhanced analytics and progress tracking.

## Features

- **Customizable problem sets**: Configure ranges for addition, subtraction, multiplication, and division
- **Timed sessions**: 120-second practice sessions
- **Auto-advancing**: Instantly move to the next problem on correct answer
- **Detailed analytics**: Track time spent and typos per problem
- **Session history**: View past sessions and drill down into individual problems
- **Instant restart**: Refresh the page to immediately start a new session

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks / Zustand

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL

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

## Deployment Recommendations

### Option 1: Managed Services (Easiest)
- **Frontend**: Vercel
- **Backend**: Fly.io or Railway
- **Database**: Railway PostgreSQL or Supabase
- **Cost**: ~$10-20/month

### Option 2: Cloud Platform
- **Frontend**: Vercel or AWS Amplify
- **Backend**: Google Cloud Run or AWS App Runner
- **Database**: AWS RDS or Google Cloud SQL
- **Cost**: ~$30-50/month

### Option 3: VPS
- **Platform**: DigitalOcean or Linode
- **Setup**: Docker Compose with all services
- **Cost**: $12-24/month

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Development Roadmap

- [ ] Phase 1: Core functionality (in progress)
- [ ] Phase 2: User authentication
- [ ] Phase 3: Advanced analytics & charts
- [ ] Phase 4: Leaderboards
- [ ] Phase 5: Mobile responsiveness
- [ ] Phase 6: PWA support

## License

MIT
