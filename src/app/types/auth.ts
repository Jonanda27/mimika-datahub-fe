// src/types/auth.ts

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export interface UserAuth {
  username: string;
  role: string;
  isAuthenticated: boolean;
}