// src/store/useAuthStore.ts
import { create } from 'zustand';
import { UserAuth } from '../types/auth';

interface AuthState {
  user: UserAuth | null;
  setAuth: (token: string, role: string, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (token, role, username) => {
    localStorage.setItem("auth_token", token);
    set({ user: { username, role, isAuthenticated: true } });
  },
  clearAuth: () => {
    localStorage.removeItem("auth_token");
    set({ user: null });
  },
}));