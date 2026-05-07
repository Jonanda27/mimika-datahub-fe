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
  setAuth: (token: string, role: string, username: string) => void; [cite: 583]
  fetchProfile: () => Promise<void>; // Fungsi untuk memanggil endpoint /me
  clearAuth: () => void; [cite: 584]
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,

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