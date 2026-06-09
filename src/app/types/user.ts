// src/app/types/user.ts

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'brida' | 'opd'; // [REFACTOR] Ekspansi union role sesuai opsi nyata di Backend/UI
  is_active: boolean;
  created_at?: string;

  // [INTEGRASI OPD-USER BINDING] Menampung ID OPD yang terikat ke akun operator [1]
  source_id?: number | null; // [1]
}

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: string;
  is_active: boolean;

  // [INTEGRASI OPD-USER BINDING] Mengizinkan pengiriman ID OPD saat pendaftaran akun baru [1]
  source_id?: number | null; // [1]
}

// UserUpdate mewarisi properti UserCreate secara opsional melalui partial mapping [1]
export interface UserUpdate extends Partial<UserCreate> { }

export interface DeleteUserResponse {
  message: string;
}