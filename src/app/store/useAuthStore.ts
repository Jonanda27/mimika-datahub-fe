// src/app/store/useAuthStore.ts
import { create } from 'zustand';
import { UserAuth, UserProfile } from '../types/auth';
import { authService } from '../services/auth.service';

interface AuthState {
  user: UserAuth | null;         // Status ringkas (username & role) [cite: 583]
  profile: UserProfile | null;   // Data profil lengkap dari /me
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (token: string, role: string, username: string) => void;
  fetchProfile: () => Promise<void>; // Fungsi untuk memanggil endpoint /me
  hydrateAuth: () => void;           // Fungsi pemulih state pasca-reboot/hydration
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,

  /**
   * Action untuk memulihkan state login secara aman dari localStorage (SSR-Safe)
   */
  hydrateAuth: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role");
    const username = localStorage.getItem("auth_username") || "User";

    if (token && role) {
      set({
        user: { username, role, isAuthenticated: true }
      });
    }
  },

  /**
   * Action untuk logout: Memanggil API dan mereset state global
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (err: any) {
      console.error("Logout error:", err.message);
    } finally {
      // Bersihkan penyimpanan lokal secara konsisten
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("auth_username");
      }

      // Reset state terlepas dari hasil API (karena token lokal sudah dihapus)
      set({
        user: null,
        profile: null,
        isLoading: false,
        error: null
      });
    }
  },

  setAuth: (token, role, username) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_role", role);
      localStorage.setItem("auth_username", username);
    }

    set({
      user: { username, role, isAuthenticated: true },
      error: null
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.getMe();

      // Sinkronisasi ke penyimpanan lokal demi stabilitas state
      if (typeof window !== "undefined") {
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("auth_username", data.username);
      }

      set({
        profile: data,
        isLoading: false,
        // Sinkronisasi data user ringkas jika diperlukan
        user: { username: data.username, role: data.role, isAuthenticated: true }
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, profile: null });
    }
  },

  clearAuth: () => {
    // Memanggil internal logout untuk membersihkan seluruh sisa session
    get().logout();
  },
}));