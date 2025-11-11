export interface Settings {
  id?: number;
  user_id?: number;
  addition_enabled: boolean;
  addition_min: number;
  addition_max: number;
  subtraction_enabled: boolean;
  subtraction_min: number;
  subtraction_max: number;
  multiplication_enabled: boolean;
  multiplication_min: number;
  multiplication_max: number;
  division_enabled: boolean;
  division_min: number;
  division_max: number;
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
