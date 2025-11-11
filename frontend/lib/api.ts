import { Settings, Session, SessionSummary, Problem } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
  // Session endpoints
  async createSession(userId?: number, isDefaultSettings = false): Promise<{ session_id: number; started_at: string }> {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, is_default_settings: isDefaultSettings }),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },

  async getSession(sessionId: number): Promise<Session> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  },

  async completeSession(sessionId: number, score: number): Promise<Session> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    });
    if (!response.ok) throw new Error('Failed to complete session');
    return response.json();
  },

  async getSessions(userId?: number, page = 1, limit = 20): Promise<SessionSummary[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (userId) params.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/sessions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  async deleteSession(sessionId: number): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    });
    if (!response.ok) throw new Error('Failed to submit problem');
    return response.json();
  },

  // Settings endpoints
  async getSettings(userId?: number): Promise<Settings> {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await fetch(`${API_URL}/settings${params}`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },
};
