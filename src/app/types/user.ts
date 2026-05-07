// src/app/types/user.ts

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user'; // sesuaikan dengan enum di backend
  is_active: boolean;
  created_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: string;
  is_active: boolean;
}

// UserUpdate menggunakan Partial agar field bersifat opsional saat dikirim
export interface UserUpdate extends Partial<UserCreate> {}

export interface DeleteUserResponse {
  message: string;
}