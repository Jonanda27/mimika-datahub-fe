// src/app/services/auth.service.ts
import { API_BASE_URL } from "../lib/config";
import { LoginResponse, UserProfile, LogoutResponse } from "../types/auth";

export const authService = {
  /**
   * Melakukan proses login dan menyimpan session ke Cookie & LocalStorage
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal melakukan login");
    }

    const data = await response.json();

    // Deteksi protokol HTTPS secara dinamis di client-side
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';

    // 1. SIMPAN KE COOKIE agar bisa dibaca Middleware (Server-side)
    // Diubah menggunakan SameSite=Lax dan Secure Flag dinamis agar lolos verifikasi HTTPS
    document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax${secureFlag}`;
    document.cookie = `user_role=${data.role}; path=/; max-age=86400; SameSite=Lax${secureFlag}`;

    // 2. SIMPAN KE LOCALSTORAGE untuk kebutuhan store Zustand/Client-side
    localStorage.setItem("auth_token", data.access_token);
    localStorage.setItem("user_role", data.role);

    return data;
  },

  /**
   * Mengambil data profil user yang sedang login berdasarkan token
   * Endpoint: GET /api/v1/auth/me
   */
  async getMe(): Promise<UserProfile> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal mengambil data profil");
    }

    return response.json();
  },

  /**
   * Melakukan proses logout ke Backend dan membersihkan session lokal
   */
  async logout(): Promise<LogoutResponse> {
    const token = localStorage.getItem("auth_token");

    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';

    try {
      // 1. Panggil endpoint logout di BE
      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Backend logout failed, proceeding with local cleanup");
      }

      return await response.json();
    } finally {
      // 2. BERSIHKAN LOCAL STORAGE
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");

      // 3. BERSIHKAN COOKIES (Penting agar Middleware tidak tertipu)
      document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax${secureFlag}`;
      document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax${secureFlag}`;
    }
  },
};