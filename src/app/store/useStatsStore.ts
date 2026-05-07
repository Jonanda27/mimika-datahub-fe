import { create } from 'zustand';
import { MainStatsResponse } from '../types/stats';
import { statsService } from '../services/stats.service';

interface StatsState {
  dashboardData: MainStatsResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMainStats: () => Promise<void>;
  resetStats: () => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchMainStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await statsService.getMainStats();
      set({ dashboardData: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  resetStats: () => set({ dashboardData: null, error: null, isLoading: false }),
}));