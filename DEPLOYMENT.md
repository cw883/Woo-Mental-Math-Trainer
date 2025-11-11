# Deployment Guide

Complete guide to deploy your Mental Math Trainer to production.

## Recommended Stack

- **Frontend**: Vercel (free tier available)
- **Backend**: Fly.io (free tier available)
- **Database**: Railway PostgreSQL (free $5 credit/month)

**Estimated Cost**: $0-10/month for low-medium traffic

## Option 1: Vercel + Fly.io + Railway (Recommended)

### Step 1: Deploy Database (Railway)

1. **Sign up at [Railway](https://railway.app/)**

2. **Create new project** → "Provision PostgreSQL"

3. **Get connection details**:
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy these values:
     - `PGHOST`
     - `PGPORT`
     - `PGUSER`
     - `PGPASSWORD`
     - `PGDATABASE`

### Step 2: Deploy Backend (Fly.io)

1. **Install Fly CLI**:
```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. **Login to Fly**:
```bash
fly auth login
```

3. **Create fly.toml** in backend directory:
```toml
app = "mental-math-trainer-api"

[build]
  builder = "paketobuildpacks/builder:base"
  buildpacks = ["gcr.io/paketo-buildpacks/go"]

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.http_checks]]
    interval = 10000
    grace_period = "5s"
    method = "GET"
    path = "/health"
    protocol = "http"
    timeout = 2000
```

4. **Create Dockerfile** in backend directory:
```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
```

5. **Deploy**:
```bash
cd backend
fly launch  # Follow prompts, say NO to PostgreSQL (we're using Railway)
```

6. **Set environment variables**:
```bash
fly secrets set \
  DB_HOST=your_railway_host \
  DB_PORT=5432 \
  DB_USER=postgres \
  DB_PASSWORD=your_railway_password \
  DB_NAME=railway \
  DB_SSLMODE=require
```

7. **Get your backend URL**:
```bash
fly status
# Look for "Hostname": https://your-app.fly.dev
```

### Step 3: Deploy Frontend (Vercel)

1. **Push code to GitHub** (if not already):
```bash
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. **Sign up at [Vercel](https://vercel.com/)**

3. **Import project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

4. **Configure**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Set environment variable**:
   - Add `NEXT_PUBLIC_API_URL` = `https://your-app.fly.dev/api`

6. **Deploy**: Click "Deploy"

Your app will be live at `https://your-app.vercel.app`!

## Option 2: All-in-One VPS (DigitalOcean)

For full control at low cost (~$12/month).

### Create Droplet

1. Sign up at [DigitalOcean](https://www.digitalocean.com/)
2. Create Droplet:
   - Ubuntu 22.04 LTS
   - Basic plan ($12/month)
   - Add SSH key

### Setup Server

```bash
# SSH into server
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Nginx
apt install nginx -y
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mental_math_trainer
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      PORT: 8080
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: your_secure_password
      DB_NAME: mental_math_trainer
      DB_SSLMODE: disable
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://yourdomain.com/api
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  pgdata:
```

### Deploy

```bash
# Clone your repo
git clone your-repo-url
cd mental-math-trainer

# Build and start
docker-compose up -d

# Check status
docker-compose ps
```

## Option 3: Cloud Platform (AWS/GCP)

### AWS Setup

**Frontend (S3 + CloudFront)**:
1. Build: `cd frontend && npm run build`
2. Upload `.next` to S3 bucket
3. Configure CloudFront distribution

**Backend (Elastic Beanstalk)**:
1. Create EB application
2. Deploy Go app
3. Configure environment variables

**Database (RDS)**:
1. Create PostgreSQL RDS instance
2. Configure security groups
3. Update backend connection

### GCP Setup

**Frontend (Cloud Storage + Load Balancer)**:
1. Build frontend
2. Upload to GCS bucket
3. Configure HTTPS load balancer

**Backend (Cloud Run)**:
```bash
gcloud run deploy mental-math-api \
  --source=./backend \
  --platform=managed \
  --region=us-central1
```

**Database (Cloud SQL)**:
```bash
gcloud sql instances create mental-math-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

## Post-Deployment Checklist

- [ ] Backend health check works: `curl https://your-api/health`
- [ ] Frontend loads properly
- [ ] Can create a session and play
- [ ] Settings save correctly
- [ ] Session history displays
- [ ] Database is backed up
- [ ] HTTPS is working (SSL certificate)
- [ ] Environment variables are secure
- [ ] CORS is properly configured
- [ ] Monitoring is set up

## Monitoring & Maintenance

### Fly.io Monitoring
```bash
fly logs
fly status
fly scale show
```

### Railway Monitoring
- Check database usage in Railway dashboard
- Set up usage alerts

### Vercel Monitoring
- View deployment logs
- Check analytics dashboard
- Monitor function usage

## Cost Optimization

**Free Tier Usage**:
- Vercel: 100GB bandwidth/month
- Fly.io: 3 shared-cpu VMs
- Railway: $5 credit/month

**Estimated Costs**:
- Low traffic (< 1000 users/month): **$0**
- Medium traffic (1000-10000 users/month): **$5-15/month**
- High traffic (10000+ users/month): **$25-50/month**

## Troubleshooting

### Backend not connecting to database
- Check database credentials
- Verify SSL mode (`require` for Railway, `disable` for local)
- Check firewall rules

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Slow performance
- Enable caching in Nginx
- Add Redis for session storage
- Optimize database queries
- Use CDN for static assets

## Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable CORS only for your domain
- [ ] Use strong database passwords
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities

## Backup Strategy

### Database Backups

**Railway**:
- Automatic backups enabled by default
- Manual backup: Railway dashboard → Export

**DigitalOcean**:
```bash
pg_dump -h localhost -U postgres mental_math_trainer > backup.sql
```

**Automated backups**:
```bash
# Add to crontab
0 2 * * * pg_dump mental_math_trainer > /backups/db_$(date +\%Y\%m\%d).sql
```

## Scaling

When you need to scale:

1. **Horizontal scaling**: Add more backend instances
2. **Database**: Upgrade to larger instance
3. **Caching**: Add Redis for session data
4. **CDN**: Use CloudFront or Cloudflare
5. **Load balancing**: Add Nginx or cloud load balancer

## Support

Need help deploying? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [Railway Documentation](https://docs.railway.app/)
