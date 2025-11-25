# Harmony App - System Flowcharts

## Table of Contents
1. [Main Application Flow](#1-main-application-flow)
2. [User Authentication Flow](#2-user-authentication-flow)
3. [Speech-to-Speech Translation Flow](#3-speech-to-speech-translation-flow)
4. [Text Translation Flow](#4-text-translation-flow)
5. [Contact Message Flow](#5-contact-message-flow)
6. [Admin Message Management Flow](#6-admin-message-management-flow)

---

## 1. Main Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER OPENS APP                          │
│                    (http://localhost:5174)                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOAD HEADER COMPONENT                       │
│         [Home] [Services] [About Us] [Contact Us] [Profile]     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Which Tab Selected?  │
                    └────────────────────────┘
                                 │
        ┌────────────┬───────────┼───────────┬────────────┐
        ▼            ▼           ▼           ▼            ▼
    ┌──────┐    ┌────────┐  ┌────────┐  ┌─────────┐  ┌─────────┐
    │ Home │    │Services│  │About Us│  │Contact  │  │ Profile │
    │      │    │        │  │        │  │   Us    │  │         │
    └──────┘    └────────┘  └────────┘  └─────────┘  └─────────┘
        │            │           │           │            │
        ▼            ▼           ▼           ▼            ▼
   Translator   Translator   Static     Contact      Auth/User
   Component    Component    Info Page   Form         Dashboard
```

---

## 2. User Authentication Flow

### 2.1 Sign Up Flow

```
┌─────────────────┐
│  User Clicks    │
│  "Sign Up"      │
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│        SIGNUP FORM DISPLAYED        │
│  • Username                         │
│  • Email                            │
│  • Password                         │
│  • First Name (optional)            │
│  • Last Name (optional)             │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  User Submits   │
│     Form        │
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   POST /api/auth/signup             │
│   → Flask Backend                   │
└─────────────────────────────────────┘
         │
         ▼
    ┌────────────────────┐
    │  Validate Input    │
    │  • Email format?   │
    │  • Password ok?    │
    │  • User exists?    │
    └────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌──────────────────────────────┐
│ FAIL │  │           SUCCESS            │
│      │  │  • Hash password             │
│      │  │  • Save to SQLite DB         │
│      │  │  • Generate JWT token        │
│      │  │  • Return token + user data  │
└──────┘  └──────────────────────────────┘
    │              │
    ▼              ▼
┌──────────┐  ┌──────────────────────────┐
│  Show    │  │  Store token in          │
│  Error   │  │  localStorage            │
│  Message │  │  → User logged in!       │
└──────────┘  └──────────────────────────┘
```

### 2.2 Login Flow

```
┌─────────────────┐
│  User Clicks    │
│    "Login"      │
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         LOGIN FORM DISPLAYED        │
│  • Username or Email                │
│  • Password                         │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   POST /api/auth/login              │
│   → Flask Backend                   │
└─────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │   Find user by username     │
    │   OR email in database      │
    └─────────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌──────────────────────┐
│ NOT  │  │     USER FOUND       │
│FOUND │  │                      │
└──────┘  └──────────────────────┘
    │              │
    ▼              ▼
┌──────────┐  ┌──────────────────────┐
│  Error:  │  │  Verify password     │
│  Invalid │  │  (bcrypt compare)    │
│  creds   │  └──────────────────────┘
└──────────┘           │
              ┌────────┴────────┐
              ▼                 ▼
         ┌────────┐      ┌─────────────────┐
         │ WRONG  │      │    CORRECT      │
         │PASSWORD│      │  Return JWT +   │
         └────────┘      │  user data      │
              │          └─────────────────┘
              ▼                 │
         ┌────────┐             ▼
         │ Error  │      ┌─────────────────┐
         │Message │      │ Store in        │
         └────────┘      │ localStorage    │
                         │ → Logged in!    │
                         └─────────────────┘
```

---

## 3. Speech-to-Speech Translation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ON TRANSLATOR PAGE                       │
│                                                                  │
│   [Source Lang: English ▼]     [Target Lang: Filipino ▼]        │
│                                                                  │
│                    ┌──────────────┐                              │
│                    │      🎤      │  ← Microphone Button         │
│                    │   (HOLD)     │                              │
│                    └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User HOLDS button
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BROWSER WEB SPEECH API (STT)                        │
│                                                                  │
│   ┌─────────────────────────────────────────────┐               │
│   │  SpeechRecognition.start()                  │               │
│   │  • Listening for voice input...             │               │
│   │  • Language: sourceLang (e.g., 'en')        │               │
│   └─────────────────────────────────────────────┘               │
│                                                                  │
│   User speaks: "Hello, my name is Jap"                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User RELEASES button
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              SPEECH RECOGNITION COMPLETE                         │
│                                                                  │
│   transcript = "Hello, my name is Jap"                          │
│   sourceText state updated                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI API TRANSLATION                        │
│                                                                  │
│   Request:                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  POST https://generativelanguage.googleapis.com/v1beta   │   │
│   │       /models/gemini-2.0-flash:generateContent           │   │
│   │                                                          │   │
│   │  Prompt: "Translate from English to Filipino:            │   │
│   │          Hello, my name is Jap"                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Response: "Kumusta, ako si Jap"                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 UPDATE UI & SAVE TO HISTORY                      │
│                                                                  │
│   translatedText = "Kumusta, ako si Jap"                        │
│                                                                  │
│   history.push({                                                 │
│     sourceText: "Hello, my name is Jap",                        │
│     translatedText: "Kumusta, ako si Jap",                      │
│     sourceLang: "en",                                            │
│     targetLang: "tl",                                            │
│     timestamp: Date.now()                                        │
│   })                                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BROWSER SPEECH SYNTHESIS (TTS)                      │
│                                                                  │
│   ┌─────────────────────────────────────────────┐               │
│   │  speakText("Kumusta, ako si Jap", "tl")     │               │
│   │                                              │               │
│   │  SpeechSynthesisUtterance:                  │               │
│   │  • text: "Kumusta, ako si Jap"              │               │
│   │  • lang: "fil-PH"                           │               │
│   │  • rate: 0.9                                │               │
│   └─────────────────────────────────────────────┘               │
│                                                                  │
│   🔊 Browser speaks the translation aloud!                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TRANSLATION COMPLETE                        │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  You said: "Hello, my name is Jap"                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Translation: "Kumusta, ako si Jap"    [🔊 Replay]       │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Text Translation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHATBOX INPUT                               │
│                                                                  │
│   ┌──────────────────────────────┐  ┌───────────┐               │
│   │  Enter text...               │  │ Translate │               │
│   └──────────────────────────────┘  └───────────┘               │
│                                                                  │
│   User types: "Good morning"                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "Translate"
                              ▼
                    ┌──────────────────┐
                    │  Text empty?     │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              ┌─────────┐         ┌───────────┐
              │   YES   │         │    NO     │
              │  Return │         │  Continue │
              └─────────┘         └───────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────┐
                    │  setIsLoading(true)          │
                    │  setSourceText("Good...")    │
                    │  setTranslatedText("...")    │
                    └──────────────────────────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────┐
                    │  translateText()             │
                    │  → Gemini API call           │
                    └──────────────────────────────┘
                                        │
                              ┌─────────┴─────────┐
                              ▼                   ▼
                        ┌─────────┐         ┌───────────┐
                        │  ERROR  │         │  SUCCESS  │
                        └─────────┘         └───────────┘
                              │                   │
                              ▼                   ▼
                    ┌──────────────┐   ┌──────────────────┐
                    │ Show error   │   │ Update UI        │
                    │ message      │   │ Add to history   │
                    └──────────────┘   │ Speak result     │
                                       └──────────────────┘
```

---

## 5. Contact Message Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTACT US PAGE                               │
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  Name:     [________________]                          │     │
│   │  Email:    [________________]                          │     │
│   │  Category: [General Inquiry ▼]                         │     │
│   │  Priority: [Medium ▼]                                  │     │
│   │  Subject:  [________________]                          │     │
│   │  Message:  [                ]                          │     │
│   │            [________________]                          │     │
│   │                                                        │     │
│   │            [  Send Message  ]                          │     │
│   └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User clicks "Send Message"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATION CHECK                              │
│                                                                  │
│   ┌─────────────────────────────────────────────┐               │
│   │  • Name provided?        ✓                  │               │
│   │  • Email valid?          ✓                  │               │
│   │  • Message not empty?    ✓                  │               │
│   └─────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              ┌─────────┐         ┌───────────┐
              │  FAIL   │         │   PASS    │
              └─────────┘         └───────────┘
                    │                   │
                    ▼                   ▼
           ┌──────────────┐   ┌────────────────────────┐
           │ Show error   │   │ POST /api/contact/send │
           │ "Required    │   │ → Flask Backend        │
           │  fields..."  │   └────────────────────────┘
           └──────────────┘             │
                                        ▼
                    ┌──────────────────────────────────┐
                    │  CREATE ContactMessage in DB     │
                    │                                  │
                    │  contact_messages table:         │
                    │  ┌────────────────────────────┐  │
                    │  │ id: 1                      │  │
                    │  │ name: "Jap"                │  │
                    │  │ email: "jap@email.com"     │  │
                    │  │ category: "general"        │  │
                    │  │ subject: "Question"        │  │
                    │  │ message: "Hello..."        │  │
                    │  │ status: "new"              │  │
                    │  │ priority: "medium"         │  │
                    │  │ created_at: 2025-11-26     │  │
                    │  └────────────────────────────┘  │
                    └──────────────────────────────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────────┐
                    │  SUCCESS RESPONSE                │
                    │  "Your message has been          │
                    │   received!"                     │
                    │                                  │
                    │  → Clear form                    │
                    │  → Show success message          │
                    └──────────────────────────────────┘
```

---

## 6. Admin Message Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFILE PAGE (Logged In)                      │
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  Welcome, Admin!                                       │     │
│   │  Email: admin@harmony.com                              │     │
│   │                                                        │     │
│   │  [ View Contact Messages ]    [ Sign Out ]             │     │
│   └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "View Contact Messages"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GET /api/contact/messages                       │
│                  (with JWT Authorization header)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Token Valid?    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              ┌─────────┐         ┌───────────┐
              │   NO    │         │    YES    │
              │ 401 err │         │  Continue │
              └─────────┘         └───────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ADMIN MESSAGES PANEL                             │
│                                                                  │
│   Search: [________________________]                             │
│                                                                  │
│   Status:   [All] [New] [Read] [In Progress] [Resolved]         │
│   Category: [All Categories ▼]    Priority: [All Priorities ▼]  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📧 Question about translation    [new] [general] [medium]│   │
│   │    From: Jap (jap@email.com)                             │   │
│   │    Nov 26, 2025 10:30 AM                                 │   │
│   │                                                          │   │
│   │  ▼ Click to expand                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Admin clicks message
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPANDED MESSAGE VIEW                         │
│                                                                  │
│   Message:                                                       │
│   "Hello, I have a question about the translation feature..."   │
│                                                                  │
│   Replies (0):                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [Add a reply...                                    ]     │   │
│   │                                               [Send]     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Update Status: [new] [read] [in-progress] [resolved]          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌─────────────────┐   ┌─────────────────┐
        │  SEND REPLY     │   │  UPDATE STATUS  │
        └─────────────────┘   └─────────────────┘
                │                       │
                ▼                       ▼
    ┌─────────────────────┐   ┌─────────────────────┐
    │ POST /api/contact/  │   │ PUT /api/contact/   │
    │ messages/{id}/reply │   │ messages/{id}/status│
    └─────────────────────┘   └─────────────────────┘
                │                       │
                ▼                       ▼
    ┌─────────────────────┐   ┌─────────────────────┐
    │ Create ContactReply │   │ Update message      │
    │ in database         │   │ status field        │
    │                     │   │                     │
    │ Auto-set status to  │   │ status: "resolved"  │
    │ "in-progress"       │   │                     │
    └─────────────────────┘   └─────────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                ┌─────────────────────┐
                │  Refresh UI         │
                │  Show updated data  │
                └─────────────────────┘
```

---

## 7. Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                         │
│                              http://localhost:5174                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           COMPONENTS                                  │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌───────────────┐  │   │
│  │  │  Home   │ │Translator│ │ Contact │ │ Profile │ │ AdminMessages │  │   │
│  │  └─────────┘ └──────────┘ └─────────┘ └─────────┘ └───────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           SERVICES                                    │   │
│  │  ┌─────────────────┐        ┌─────────────────┐                      │   │
│  │  │ geminiService   │        │   apiService    │                      │   │
│  │  │ • translateText │        │ • authAPI       │                      │   │
│  │  │ • speakText     │        │ • contactAPI    │                      │   │
│  │  └─────────────────┘        │ • profileAPI    │                      │   │
│  │          │                  └─────────────────┘                      │   │
│  └──────────│───────────────────────────│───────────────────────────────┘   │
└─────────────│───────────────────────────│───────────────────────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────────────────────────────┐
│     GEMINI API          │   │              BACKEND (Flask)                    │
│ (Google Cloud)          │   │              http://localhost:5000              │
│                         │   │                                                 │
│ • Translation           │   │  ┌─────────────────────────────────────────┐   │
│ • AI Text Generation    │   │  │                ROUTES                    │   │
└─────────────────────────┘   │  │  /api/auth/*      → Authentication       │   │
                              │  │  /api/translate/* → Translation history  │   │
┌─────────────────────────┐   │  │  /api/chat/*      → Chat messages        │   │
│   BROWSER APIs          │   │  │  /api/profile/*   → User profiles        │   │
│                         │   │  │  /api/contact/*   → Contact messages     │   │
│ • Web Speech API (STT)  │   │  └─────────────────────────────────────────┘   │
│ • Speech Synthesis(TTS) │   │                        │                       │
│ • localStorage (JWT)    │   │  ┌─────────────────────────────────────────┐   │
└─────────────────────────┘   │  │              MODELS                      │   │
                              │  │  • User                                  │   │
                              │  │  • Translation                           │   │
                              │  │  • ChatMessage                           │   │
                              │  │  • ContactMessage                        │   │
                              │  │  • ContactReply                          │   │
                              │  └─────────────────────────────────────────┘   │
                              │                        │                       │
                              │  ┌─────────────────────▼───────────────────┐   │
                              │  │           SQLite DATABASE               │   │
                              │  │        (harmony_app.db)                 │   │
                              │  │                                         │   │
                              │  │  Tables:                                │   │
                              │  │  • users                                │   │
                              │  │  • translations                         │   │
                              │  │  • chat_messages                        │   │
                              │  │  • contact_messages                     │   │
                              │  │  • contact_replies                      │   │
                              │  └─────────────────────────────────────────┘   │
                              └─────────────────────────────────────────────────┘
```

---

## 8. Database Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA (SQLite)                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│       USERS         │         │    TRANSLATIONS     │
├─────────────────────┤         ├─────────────────────┤
│ PK id               │◄───────┐│ PK id               │
│    username         │        ││ FK user_id          │───────┐
│    email            │        ││    source_lang      │       │
│    password_hash    │        ││    target_lang      │       │
│    first_name       │        ││    source_text      │       │
│    last_name        │        ││    translated_text  │       │
│    preferred_lang   │        ││    created_at       │       │
│    created_at       │        │└─────────────────────┘       │
└─────────────────────┘        │                              │
         │                     │┌─────────────────────┐       │
         │                     ││   CHAT_MESSAGES     │       │
         │                     │├─────────────────────┤       │
         │                     ││ PK id               │       │
         └─────────────────────┤│ FK user_id          │───────┤
                               ││    message          │       │
                               ││    response         │       │
                               ││    language         │       │
                               ││    created_at       │       │
                               │└─────────────────────┘       │
                               │                              │
                               │                              │
┌─────────────────────┐        │                              │
│  CONTACT_MESSAGES   │        │         ONE USER             │
├─────────────────────┤        │            ▼                 │
│ PK id               │◄───────┴──── HAS MANY ────────────────┘
│    name             │
│    email            │
│    category         │
│    subject          │
│    message          │
│    status           │
│    priority         │
│    created_at       │
│    updated_at       │
└─────────────────────┘
         │
         │ ONE MESSAGE
         │ HAS MANY REPLIES
         ▼
┌─────────────────────┐
│   CONTACT_REPLIES   │
├─────────────────────┤
│ PK id               │
│ FK message_id       │
│    admin_name       │
│    reply_text       │
│    created_at       │
└─────────────────────┘
```

---

## 9. Decision Points Summary

| Decision Point | Condition | Yes Action | No Action |
|----------------|-----------|------------|-----------|
| User authenticated? | JWT token valid | Allow access | Redirect to login |
| Text empty? | input.trim() === '' | Return early | Continue translation |
| Speech supported? | 'speechSynthesis' in window | Use TTS | Show warning |
| Translation success? | API returns 200 | Display result | Show error |
| Form valid? | All required fields | Submit | Show validation error |

---

## 10. Loop/Repeated Processes

1. **Translation History Loop**: Each translation adds entry to history array
2. **Message Polling**: Admin can refresh to see new messages
3. **Reply Thread**: Multiple replies can be added to one message
4. **Retry on Error**: User can retry failed translations

---

*Document created for Harmony App - Batangas State University*
*Last updated: November 26, 2025*
