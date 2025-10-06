export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  username: string;
  role: 'user' | 'admin';
}

export interface Round {
  uuid: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  score: number;
}

export interface Score {
  user: string;
  round: string;
  score: number;
}

export interface BestPlayer {
  username: string;
  score: number;
}

export interface RoundWithScore {
  round: Round;
  score: Score | null;
  totalScore?: number;
  bestPlayer?: BestPlayer | null;
  currentUserScore?: number;
}

export interface TapResponse {
  message: string;
  score: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface CreateRoundResponse {
  uuid: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  score: number;
}
