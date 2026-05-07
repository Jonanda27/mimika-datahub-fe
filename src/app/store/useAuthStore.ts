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
  logout: () => Promise<void>;
  clearAuth: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,

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
    localStorage.setItem("auth_token", token); 
    set({ 
      user: { username, role, isAuthenticated: true },
      error: null 
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.getMe();
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
    authService.logout();
    set({ user: null, profile: null, error: null }); 
  },
}));