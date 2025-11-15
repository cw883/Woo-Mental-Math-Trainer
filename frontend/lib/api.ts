import { Settings, Session, SessionSummary, Problem, AuthResponse, User, LeaderboardEntry } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Token management
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Helper to add auth header to requests
const getHeaders = (includeContentType = true) => {
  const headers: HeadersInit = {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const api = {
  // Auth endpoints
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(error.error || 'Registration failed');
    }
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  logout() {
    removeToken();
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
  },

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_URL}/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },

  // Session endpoints
  async createSession(isDefaultSettings = false): Promise<{ session_id: number; started_at: string }> {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ is_default_settings: isDefaultSettings }),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },

  async getSession(sessionId: number): Promise<Session> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      headers: getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  },

  async completeSession(sessionId: number, score: number): Promise<Session> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/complete`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ score }),
    });
    if (!response.ok) throw new Error('Failed to complete session');
    return response.json();
  },

  async getSessions(page = 1, limit = 20): Promise<SessionSummary[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_URL}/sessions?${params}`, {
      headers: getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  async deleteSession(sessionId: number): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to delete session');
  },

  // Problem endpoints
  async submitProblem(
    sessionId: number,
    problem: {
      question: string;
      answer: number;
      user_answer: number;
      time_spent_ms: number;
      typo_count: number;
    }
  ): Promise<Problem> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/problems`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(problem),
    });
    if (!response.ok) throw new Error('Failed to submit problem');
    return response.json();
  },

  // Settings endpoints
  async getSettings(): Promise<Settings> {
    const response = await fetch(`${API_URL}/settings`, {
      headers: getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },
};
