# Mental Math Trainer - Setup Guide

Complete guide to get your mental math trainer up and running.

## Prerequisites

Before starting, make sure you have these installed:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Go 1.21+** - [Download](https://golang.org/dl/)
3. **PostgreSQL 13+** - [Download](https://www.postgresql.org/download/)

### Installing Go

If Go is not installed:

**macOS:**
```bash
brew install go
```

**Windows:**
Download from https://golang.org/dl/

**Linux:**
```bash
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### Installing PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download installer from https://www.postgresql.org/download/windows/

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 1: Database Setup

1. Create the database:
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE mental_math_trainer;

# Create user (optional, for production)
CREATE USER mathtrainer WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mental_math_trainer TO mathtrainer;

# Exit psql
\q
```

## Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` with your database credentials:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mental_math_trainer
DB_SSLMODE=disable
```

4. Install Go dependencies:
```bash
go mod download
```

5. Run the backend:
```bash
go run cmd/server/main.go
```

The backend will:
- Start on `http://localhost:8080`
- Automatically create database tables
- Be ready to accept API requests

### Testing the Backend

```bash
# Health check
curl http://localhost:8080/health

# Should return: {"status":"ok"}
```

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Verify `.env.local` contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

5. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 4: Test the Application

1. Open your browser to `http://localhost:3000`
2. You should see a math problem (e.g., "4 × 7")
3. Type the answer and press Enter
4. The score should increment and a new problem should appear
5. Click the settings icon (bottom-right) to customize problem types
6. After a session ends, view your history

## Troubleshooting

### Backend Issues

**"go: command not found"**
- Go is not installed or not in PATH
- Follow the Go installation steps above
- Verify with: `go version`

**"failed to connect to database"**
- PostgreSQL is not running
- Check with: `psql -U postgres -c "SELECT version();"`
- Verify database exists: `psql -U postgres -l`
- Check credentials in `.env` file

**"port 8080 already in use"**
- Change `PORT` in `.env` to another port (e.g., 8081)
- Update frontend `.env.local` to match

### Frontend Issues

**"Failed to fetch"**
- Backend is not running
- Check backend is on `http://localhost:8080`
- Verify CORS is configured correctly
- Check browser console for errors

**"Module not found"**
- Dependencies not installed
- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Build errors**
- TypeScript errors: Run `npm run build` to see all errors
- Fix import paths (should use `@/` prefix)

## Development Tips

### Hot Reloading

Both frontend and backend support hot reloading:

**Frontend:** Automatic with Next.js dev server

**Backend:** Install Air for Go hot reloading
```bash
go install github.com/cosmtrek/air@latest
cd backend
air
```

### Database Management

View data in your database:
```bash
psql -U postgres mental_math_trainer

# List tables
\dt

# View sessions
SELECT * FROM sessions ORDER BY started_at DESC LIMIT 10;

# View problems for a session
SELECT * FROM problems WHERE session_id = 1;

# Exit
\q
```

### Resetting Data

To clear all session data:
```sql
psql -U postgres mental_math_trainer -c "TRUNCATE sessions, problems RESTART IDENTITY CASCADE;"
```

## Next Steps

1. **Customize Settings**: Click settings icon to adjust problem difficulty
2. **Track Progress**: View session history to see improvement over time
3. **Deploy**: See [README.md](README.md) for deployment options

## Production Deployment

See the main [README.md](README.md) for deployment recommendations:
- Vercel (frontend)
- Fly.io or Railway (backend)
- Railway or Supabase (database)

## Need Help?

- Check the [README.md](README.md) for project overview
- Review backend API docs in [backend/README.md](backend/README.md)
- Ensure all prerequisites are installed
- Verify environment variables are set correctly
