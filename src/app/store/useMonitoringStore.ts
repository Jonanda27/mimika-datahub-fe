// src/app/store/useMonitoringStore.ts
import { create } from 'zustand';
import { MonitoringSummaryResponse } from '../types/monitoring';
import { monitoringService } from '../services/monitoring.service';

interface MonitoringState {
  summaryData: MonitoringSummaryResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSummary: () => Promise<void>;
  sendReminder: (userId: number) => Promise<void>;
  resetMonitoring: () => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  summaryData: null,
  isLoading: false,
  error: null,

  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await monitoringService.getOpdSummary();
      set({ summaryData: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  sendReminder: async (userId: number) => {
    try {
      const res = await monitoringService.sendReminder(userId);
      alert(res.message); // Umpan balik sederhana
    } catch (err: any) {
      alert(err.message);
    }
  },

  resetMonitoring: () => set({ summaryData: null, error: null, isLoading: false }),
}));