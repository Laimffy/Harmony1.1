# Harmony App - Flask Backend

Python/Flask backend with PostgreSQL database for the Harmony App.

## Setup Instructions

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
```bash
# Open PostgreSQL CLI
psql -U postgres

# Create database
CREATE DATABASE harmony_app;

# Create a user (optional but recommended)
CREATE USER harmony_user WITH PASSWORD 'your-password';
ALTER ROLE harmony_user SET client_encoding TO 'utf8';
ALTER ROLE harmony_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE harmony_user SET default_transaction_deferrable TO on;
ALTER ROLE harmony_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE harmony_app TO harmony_user;
```

### 3. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables
Copy `.env.example` to `.env` and update with your settings:
```bash
cp .env.example .env
```

Edit `.env` with:
- Database credentials
- Gemini API key (get from https://aistudio.google.com/apikey)

### 6. Run the Application
```bash
python run.py
```

The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Translation
- `POST /api/translate/text` - Translate text
- `GET /api/translate/history` - Get translation history

### Chat
- `POST /api/chat/send` - Send chat message
- `GET /api/chat/history` - Get chat history

### Profile
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/update` - Update user profile

## Database Models

### User
- id, username, email, password_hash, first_name, last_name, preferred_language, created_at, updated_at

### Translation
- id, user_id, source_language, target_language, source_text, translated_text, created_at

### ChatMessage
- id, user_id, message, response, language, created_at
