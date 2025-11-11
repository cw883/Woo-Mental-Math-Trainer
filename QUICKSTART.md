# Quick Start Guide

Get your Mental Math Trainer running in 5 minutes.

## Prerequisites Check

```bash
# Check if you have everything installed
node --version   # Need 18+
go version      # Need 1.21+
psql --version  # Need 13+
```

If any are missing, see [SETUP.md](SETUP.md) for installation instructions.

## 1. Database (30 seconds)

```bash
# Create the database
createdb mental_math_trainer
```

## 2. Backend (1 minute)

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database password
# (If using default postgres user with no password, you can skip editing)

# Install dependencies and run
go mod download
go run cmd/server/main.go
```

Keep this terminal open. You should see:
```
Database connection established
Database migrations completed successfully
Server starting on port 8080...
```

## 3. Frontend (1 minute)

Open a NEW terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file (optional - defaults work)
cp .env.local.example .env.local

# Run the app
npm run dev
```

## 4. Play! (3 minutes)

Open your browser to **http://localhost:3000**

You should see a math problem like `7 × 8`. Type `56` and press Enter!

## Common Issues

**Backend won't start:**
```bash
# Make sure PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If it fails, start PostgreSQL:
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
```

**"go: command not found":**
- Install Go from https://golang.org/dl/

**Frontend can't connect:**
- Make sure backend is running on http://localhost:8080
- Check terminal for any backend errors

## What's Next?

- **Customize**: Click the settings icon (⚙️) in bottom-right to change problem types
- **Track Progress**: View your session history after completing a session
- **Deploy**: See [README.md](README.md) for deployment options

## Full Documentation

- [Complete Setup Guide](SETUP.md)
- [Project Overview](README.md)
- [Backend API](backend/README.md)
- [Frontend Details](frontend/README.md)

## Quick Commands Reference

```bash
# Backend (from backend/)
go run cmd/server/main.go

# Frontend (from frontend/)
npm run dev

# Database
psql mental_math_trainer
```

Happy practicing!
