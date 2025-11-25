# Harmony App Deployment Guide

## Overview
- **Frontend**: Deploy to Vercel (free)
- **Backend**: Deploy to Render (free tier)
- **Database**: Render PostgreSQL (free tier)

---

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `harmony-app`
3. Make it **Public** or **Private** (both work)

### 1.2 Push Your Code
Open terminal in your project folder:

```bash
cd "Harmony App/Ver 001"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Harmony App"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/harmony-app.git

# Push
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account

### 2.2 Create PostgreSQL Database (Free)
1. Click **New** → **PostgreSQL**
2. Name: `harmony-db`
3. Region: Choose closest to you
4. Plan: **Free**
5. Click **Create Database**
6. Copy the **Internal Database URL** (you'll need this)

### 2.3 Deploy Flask Backend
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `harmony-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
   - **Plan**: Free

4. Add **Environment Variables**:
   ```
   DATABASE_URL = [paste Internal Database URL from step 2.2]
   JWT_SECRET_KEY = your-super-secret-key-change-this
   FLASK_ENV = production
   ```

5. Click **Create Web Service**
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://harmony-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account

### 3.2 Deploy React Frontend
1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `2nd-try-main`
   
4. Add **Environment Variables**:
   ```
   VITE_API_KEY = AIzaSyC26bW3LosVpMv7yLUzTtK5rbQxMbCDUjw
   VITE_API_BASE_URL = https://harmony-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

5. Click **Deploy**
6. Wait for deployment (2-3 minutes)
7. Your app is live! 🎉

---

## Step 4: Update Backend for PostgreSQL

Before deploying, update `backend/app/__init__.py` to support PostgreSQL:

The code already supports both SQLite (local) and PostgreSQL (production) via the `DATABASE_URL` environment variable.

---

## Step 5: Configure CORS for Production

Update `backend/app/__init__.py` to allow your Vercel domain:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://your-app.vercel.app",  # Add your Vercel URL
            "https://*.vercel.app"
        ]
    }
})
```

---

## Free Tier Limits

### Render (Backend)
- 750 hours/month (enough for 1 service 24/7)
- Spins down after 15 min inactivity (cold start ~30s)
- 512 MB RAM

### Render PostgreSQL
- 1 GB storage
- 90-day retention on free tier

### Vercel (Frontend)
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions available

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Make sure `gunicorn` is in requirements.txt

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Look for HTTPS/HTTP mismatch

### Database connection fails
- Use Internal Database URL (not External)
- Verify `DATABASE_URL` is set correctly

---

## Alternative: Deploy Everything to Railway

Railway is another great option with GitHub Student benefits:

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub Repo**
4. Railway auto-detects Flask and sets up PostgreSQL

Railway gives you $5/month free credit with GitHub Student Pack!

---

## Quick Links
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- GitHub Student Pack: https://education.github.com/pack

---

## Need Help?
Check the documentation:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
