// src/store/useSourceStore.ts
import { create } from 'zustand';
import { Source, SourceCreate } from '../types/source';
import { sourceService } from '../services/source.service';

interface SourceState {
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSources: () => Promise<void>;
  addSource: (data: SourceCreate) => Promise<Source>;
  setSources: (sources: Source[]) => void;
}

export const useSourceStore = create<SourceState>((set) => ({
  sources: [],
  isLoading: false,
  error: null,

  setSources: (sources) => set({ sources }),

  fetchSources: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sourceService.getSources();
      set({ sources: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  /**
   * Action untuk membuat source baru dan menambahkannya ke state global
   */
  addSource: async (data: SourceCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newSource = await sourceService.createSource(data);
      // Update state sources secara lokal agar tidak perlu fetch ulang
      set((state) => ({ 
        sources: [...state.sources, newSource],
        isLoading: false 
      }));
      return newSource;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));