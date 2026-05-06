// src/store/useDatasetStore.ts
import { create } from 'zustand';
import { Dataset } from '../types/dataset';
import { datasetService } from '../services/dataset.service';

interface DatasetState {
  pendingDatasets: Dataset[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPendingDatasets: () => Promise<void>;
  approveDataset: (id: number) => Promise<void>;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  pendingDatasets: [],
  isLoading: false,
  error: null,

  fetchPendingDatasets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await datasetService.getPendingDatasets();
      set({ pendingDatasets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  approveDataset: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await datasetService.approveDataset(id);
      
      // Hapus dataset yang sudah disetujui dari state lokal secara instan
      const currentPending = get().pendingDatasets;
      set({ 
        pendingDatasets: currentPending.filter(ds => ds.id !== id),
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));