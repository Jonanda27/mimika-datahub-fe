// src/app/types/auth.ts

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

export interface UserProfile {
  id: number;
  username: string;
  email: string | null;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at?: string;

  // [INTEGRASI OPD-USER BINDING] Menambahkan referensi instansi OPD yang opsional [1]
  source_id?: number | null; // [1]
}

export interface LogoutResponse {
  status: string;
  message: string;
}