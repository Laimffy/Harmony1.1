const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const apiCall = async (method: string, endpoint: string, body?: any) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) =>
    apiCall('POST', '/auth/signup', { username, email, password, first_name: firstName, last_name: lastName }),
  
  login: (username: string, password: string) =>
    apiCall('POST', '/auth/login', { username, password }),
  
  getCurrentUser: () =>
    apiCall('GET', '/auth/me'),
};

// Translation API
export const translationAPI = {
  translate: (text: string, sourceLang: string, targetLang: string) =>
    apiCall('POST', '/translate/text', { text, source_lang: sourceLang, target_lang: targetLang }),
  
  getHistory: (limit: number = 50) =>
    apiCall('GET', `/translate/history?limit=${limit}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string, language: string = 'en') =>
    apiCall('POST', '/chat/send', { message, language }),
  
  getHistory: (limit: number = 50) =>
    apiCall('GET', `/chat/history?limit=${limit}`),
};

// Profile API
export const profileAPI = {
  getProfile: () =>
    apiCall('GET', '/profile/'),
  
  updateProfile: (firstName?: string, lastName?: string, preferredLanguage?: string) =>
    apiCall('PUT', '/profile/update', { first_name: firstName, last_name: lastName, preferred_language: preferredLanguage }),
};

// Contact API
export const contactAPI = {
  sendMessage: (name: string, email: string, subject: string, message: string, category?: string, priority?: string) =>
    apiCall('POST', '/contact/send', { name, email, subject, message, category, priority }),
  
  getMessages: (limit: number = 100, status?: string, category?: string, priority?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    return apiCall('GET', `/contact/messages?${params.toString()}`);
  },
  
  getMessage: (messageId: number) =>
    apiCall('GET', `/contact/messages/${messageId}`),
  
  updateMessageStatus: (messageId: number, status: string, priority?: string) =>
    apiCall('PUT', `/contact/messages/${messageId}/status`, { status, priority }),
  
  addReply: (messageId: number, replyText: string, adminName: string) =>
    apiCall('POST', `/contact/messages/${messageId}/reply`, { reply_text: replyText, admin_name: adminName }),
  
  getReplies: (messageId: number) =>
    apiCall('GET', `/contact/messages/${messageId}/replies`),
};
