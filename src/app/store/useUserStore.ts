// src/app/store/useUserStore.ts
import { create } from 'zustand';
import { User, UserCreate, UserUpdate } from '../types/user';
import { userService } from '../services/user.service';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  addUser: (data: UserCreate) => Promise<void>;
  editUser: (userId: number, data: UserUpdate) => Promise<void>;
  removeUser: (userId: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getUsers();
      set({ users: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addUser: async (data: UserCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.createUser(data);
      // Sinkronisasi state lokal
      set((state) => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  editUser: async (userId: number, data: UserUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(userId, data);
      // Update state lokal
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  removeUser: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(userId);
      // Hapus dari state lokal
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));