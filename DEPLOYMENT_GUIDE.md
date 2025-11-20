# Deployment Guide for Mental Math Trainer

This guide will walk you through deploying your Mental Math Trainer application using:
- **Supabase** for PostgreSQL database
- **Fly.io** for Go backend
- **Vercel** for Next.js frontend

## Prerequisites

Make sure you have accounts on:
- [Supabase](https://supabase.com)
- [Fly.io](https://fly.io)
- [Vercel](https://vercel.com)

Install the required CLIs:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Install Vercel CLI
npm i -g vercel
```

## Step 1: Set up Supabase Database

1. Create a new project on [Supabase](https://supabase.com)

2. Once created, go to Settings → Database

3. Copy the "Connection string" (URI) - you'll need this for Fly.io

4. Note: Supabase provides a PostgreSQL database that's ready to use. The tables will be created automatically when your backend starts.

## Step 2: Deploy Backend to Fly.io

1. Navigate to the backend directory:
```bash
cd backend
```

2. Initialize Fly.io app (if not already done):
```bash
fly launch --no-deploy
```
   - Choose a unique app name (e.g., `mental-math-trainer-backend`)
   - Select your preferred region
   - Don't create a PostgreSQL database (we're using Supabase)
   - Don't deploy yet

3. Set your secrets (environment variables):
```bash
# Set the database URL from Supabase
fly secrets set DATABASE_URL='postgresql://postgres.chryinichqgyckzmgqxu:Buddythedog3583@aws-1-us-east-1.pooler.supabase.com:6543/postgres'

# Set JWT secret for authentication
fly secrets set JWT_SECRET="3sO9UZGghtHqh2hLSoxs23n/Fq17gbB5kpu/t5ihMVo="

# Set allowed origins (your Vercel frontend URL)
# You'll update this after deploying the frontend
fly secrets set ALLOWED_ORIGINS="https://your-app.vercel.app"
```

4. Deploy the backend:
```bash
fly deploy
```

5. Get your backend URL:
```bash
fly status
```
Your backend will be available at: `https://your-app-name.fly.dev`

## Step 3: Deploy Frontend to Vercel

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Update the `.env.production` file with your Fly.io backend URL:
```env
NEXT_PUBLIC_API_URL=https://mental-math-trainer-backend.fly.dev/api
```

3. Deploy to Vercel:
```bash
vercel --prod
```
   - Follow the prompts to link to your Vercel account
   - Choose a project name
   - Use the default settings for Next.js

4. Alternatively, you can deploy via GitHub:
   - Push your code to GitHub
   - Import the repository in Vercel dashboard
   - Set the environment variable `NEXT_PUBLIC_API_URL` in Vercel project settings

## Step 4: Update CORS Settings

After deploying the frontend, update your backend's ALLOWED_ORIGINS:

```bash
fly secrets set ALLOWED_ORIGINS="https://your-frontend.vercel.app,https://your-frontend-git-main.vercel.app"
```

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Try creating an account and playing the game
3. Check the leaderboard functionality
4. Verify that sessions are being saved

## Environment Variables Summary

### Backend (Fly.io secrets)
- `DATABASE_URL`: Supabase connection string
- `JWT_SECRET`: Random secret for JWT tokens
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs

### Frontend (Vercel environment variables)
- `NEXT_PUBLIC_API_URL`: Your Fly.io backend URL with /api suffix

## Monitoring and Logs

### View backend logs:
```bash
fly logs
```

### View backend status:
```bash
fly status
```

### SSH into backend container:
```bash
fly ssh console
```

## Updating Your Application

### Update Backend:
```bash
cd backend
fly deploy
```

### Update Frontend:
```bash
cd frontend
vercel --prod
```

## Troubleshooting

### CORS Issues
- Make sure `ALLOWED_ORIGINS` includes your exact frontend URL
- Check that the frontend is using the correct `NEXT_PUBLIC_API_URL`

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check Supabase dashboard for connection limits
- Ensure SSL mode is set to `require` (handled automatically with DATABASE_URL)

### Authentication Issues
- Ensure `JWT_SECRET` is set and consistent
- Check that tokens are being stored/sent correctly

## Cost Considerations

- **Supabase**: Free tier includes 500MB database, 2GB bandwidth
- **Fly.io**: Free tier includes 3 shared VMs, 160GB outbound transfer
- **Vercel**: Free tier includes unlimited bandwidth for personal projects

## Security Notes

1. Never commit `.env` files to git
2. Use strong, random JWT secrets
3. Keep your Supabase connection string private
4. Regularly update dependencies
5. Monitor your application logs for suspicious activity

## Support

If you encounter issues:
1. Check the logs on each platform
2. Verify all environment variables are set correctly
3. Ensure your database migrations ran successfully
4. Check the browser console for frontend errors