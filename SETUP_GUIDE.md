# Harmony App - Full Stack Setup Guide

This guide helps you set up both the frontend (React) and backend (Flask) for the Harmony App.

## Project Structure

```
Harmony App/Ver 001/
├── 2nd-try-main/          (React Frontend - Vite)
└── backend/               (Python Flask Backend)
```

---

## Phase 1: Backend Setup (Python/Flask + PostgreSQL)

### 1.1 Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- During installation, remember your password for the `postgres` user
- After installation, verify: `psql --version`

### 1.2 Create Database
Open Command Prompt or PowerShell:
```powershell
# Login to PostgreSQL
psql -U postgres

# In PostgreSQL CLI, run:
CREATE DATABASE harmony_app;

# (Optional but recommended) Create a dedicated user:
CREATE USER harmony_user WITH PASSWORD 'your-password';
ALTER ROLE harmony_user SET client_encoding TO 'utf8';
ALTER ROLE harmony_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE harmony_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE harmony_app TO harmony_user;

# Exit PostgreSQL
\q
```

### 1.3 Setup Flask Backend

```powershell
# Navigate to backend folder
cd "Harmony App\Ver 001\backend"

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 1.4 Configure Environment Variables

Edit `.env` file in the backend folder:
```
FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Update these with your PostgreSQL credentials
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=harmony_app

# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your-gemini-api-key-here
```

### 1.5 Run Flask Backend

```powershell
# Make sure virtual environment is activated
python run.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

The backend is now ready! Keep this terminal open.

---

## Phase 2: Frontend Setup (React + Vite)

### 2.1 Install Dependencies

Open a **new** terminal/PowerShell:
```powershell
# Navigate to frontend folder
cd "Harmony App\Ver 001\2nd-try-main"

# Install dependencies
npm install
```

### 2.2 Verify Environment Variables

Check `.env` file contains:
```
VITE_API_KEY=your-gemini-api-key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2.3 Run Frontend Development Server

```powershell
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

---

## Testing the Setup

1. **Backend running** on `http://localhost:5000`
2. **Frontend running** on `http://localhost:5173`
3. Open browser and go to `http://localhost:5173`

### Test Auth Flow:
1. Click "Sign Up"
2. Create an account
3. Login with credentials
4. You should see the app interface

### Test Translation:
1. Enter text
2. Select source and target languages
3. Click "Translate"
4. Backend will call Gemini API and save history to PostgreSQL

### Test Chat:
1. Type a message in chatbox
2. Submit
3. Backend returns response and saves to database

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/signup      - Create account
POST   /api/auth/login       - Login
GET    /api/auth/me          - Get current user
```

### Translation
```
POST   /api/translate/text   - Translate text
GET    /api/translate/history - Get user's translation history
```

### Chat
```
POST   /api/chat/send        - Send message and get response
GET    /api/chat/history     - Get user's chat history
```

### Profile
```
GET    /api/profile/         - Get user profile
PUT    /api/profile/update   - Update profile
```

---

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify all packages installed: `pip list`

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for CORS errors

### Port already in use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Database errors
```powershell
# Connect to PostgreSQL and check database
psql -U postgres -d harmony_app

# List tables
\dt

# Exit
\q
```

---

## Development Commands

### Backend
```powershell
# Run server
python run.py

# Run with auto-reload
flask run --reload

# Access Python shell with app context
flask shell
```

### Frontend
```powershell
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Security Notes

⚠️ **Before Production:**
1. Change all secret keys in `.env`
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper CORS restrictions
5. Add rate limiting
6. Hash and salt passwords (already done with werkzeug)
7. Use JWT with proper expiration
8. Validate all inputs

---

## Next Steps

1. ✅ Backend setup complete
2. ✅ Frontend API integration ready
3. Customize components as needed
4. Add more features (voice, etc.)
5. Deploy to production

Good luck! 🚀
