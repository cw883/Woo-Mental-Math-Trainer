export interface Settings {
  id?: number;
  user_id?: number;
  addition_enabled: boolean;
  addition_min1: number;
  addition_max1: number;
  addition_min2: number;
  addition_max2: number;
  subtraction_enabled: boolean;
  subtraction_min1: number;
  subtraction_max1: number;
  subtraction_min2: number;
  subtraction_max2: number;
  multiplication_enabled: boolean;
  multiplication_min1: number;
  multiplication_max1: number;
  multiplication_min2: number;
  multiplication_max2: number;
  division_enabled: boolean;
  division_min1: number;
  division_max1: number;
  division_min2: number;
  division_max2: number;
}

export interface Problem {
  id?: number;
  session_id?: number;
  question: string;
  answer: number;
  user_answer?: number;
  time_spent_ms: number;
  typo_count: number;
  is_correct: boolean;
}

export interface Session {
  id: number;
  user_id?: number;
  score: number;
  duration: number;
  is_default_settings: boolean;
  started_at: string;
  ended_at?: string;
  problems?: Problem[];
}

export interface SessionSummary {
  id: number;
  score: number;
  duration: number;
  is_default_settings: boolean;
  started_at: string;
  ended_at: string;
}

export interface MathProblem {
  question: string;
  answer: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  duration: number;
  started_at: string;
  is_anonymous: boolean;
}
