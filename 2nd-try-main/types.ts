export interface Language {
  code: string;
  name: string;
}

export interface TranslationEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  preferred_language?: string;
  created_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  category: 'bug' | 'feature' | 'general' | 'urgent';
  subject: string;
  message: string;
  status: 'new' | 'read' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  replies?: Array<{
    id: number;
    admin_name: string;
    reply_text: string;
    created_at: string;
  }>;
}

export type AppView = 'home' | 'services' | 'about' | 'contact' | 'profile';