// src/store/useDatasetStore.ts
import { create } from 'zustand';
import { Dataset, DatasetContent } from '../types/dataset';
import { datasetService } from '../services/dataset.service';

interface DatasetState {
  pendingDatasets: Dataset[];
  approvedDatasets: Dataset[]; // Untuk Admin [cite: 592]
  selectedDatasetContent: DatasetContent | null;
  publicDatasets: Dataset[];   // Untuk Filter/Dashboard User [cite: 592]
  myDatasets: Dataset[];       // Dataset milik user yang login
  isLoading: boolean;
  error: string | null;

  // Actions Fetching
  fetchPendingDatasets: () => Promise<void>;
  fetchApprovedDatasets: () => Promise<void>;
  fetchPublicDatasets: (type: 'pemerintah' | 'non-pemerintah') => Promise<void>;
  fetchMyDatasets: () => Promise<void>;
  fetchDatasetContent: (id: number, limit?: number) => Promise<void>;
  resetContent: () => void;

  // Actions Moderasi
  approveDataset: (id: number) => Promise<void>;

  // Actions Export & Download
  downloadDataset: (id: number, filename: string) => Promise<void>;
  downloadDatasetList: (type: string, format: string) => Promise<void>;
  handleFileDownload: (blob: Blob, filename: string) => void;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  pendingDatasets: [],
  approvedDatasets: [],
  publicDatasets: [],
  myDatasets: [],
  selectedDatasetContent: null,
  isLoading: false,
  error: null,

  /**
   * Mengambil data isi tabel dan menyimpannya ke state
   */
  fetchDatasetContent: async (id: number, limit: number = 100) => {
    set({ isLoading: true, error: null });
    try {
      const data = await datasetService.getDatasetContent(id, limit);
      set({ selectedDatasetContent: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  /**
   * Membersihkan data preview saat modal ditutup
   */
  resetContent: () => set({ selectedDatasetContent: null, error: null }),

  // --- Fetching Data ---
  fetchPendingDatasets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await datasetService.getPendingDatasets(); // [cite: 594]
      set({ pendingDatasets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchApprovedDatasets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await datasetService.getApprovedDatasets();
      set({ approvedDatasets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchPublicDatasets: async (type) => {
    set({ isLoading: true, error: null });
    try {
      const data = type === 'pemerintah' 
        ? await datasetService.getGovernmentDatasets() 
        : await datasetService.getNonGovernmentDatasets();
      set({ publicDatasets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchMyDatasets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await datasetService.getMyDatasets();
      set({ myDatasets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // --- Moderasi ---
  approveDataset: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await datasetService.approveDataset(id); // [cite: 595]
      
      // Update State Lokal: Hapus dari daftar pending secara instan
      const currentPending = get().pendingDatasets;
      set({ 
        pendingDatasets: currentPending.filter(ds => ds.id !== id),
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err; // [cite: 596]
    }
  },

  // --- Export & File Handling ---
  /**
   * Fungsi internal untuk memicu proses download file di browser
   */
  handleFileDownload: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.body.appendChild(document.createElement('a'));
    link.href = url;
    link.download = filename;
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Export isi data mentah dari satu dataset spesifik (Excel)
   */
  downloadDataset: async (id: number, filename: string) => {
    set({ isLoading: true, error: null });
    try {
      const blob = await datasetService.exportDatasetById(id);
      get().handleFileDownload(blob, `${filename}.xlsx`);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  /**
   * Export daftar metadata dataset (Excel/CSV)
   */
  downloadDatasetList: async (type: string, format: string) => {
    set({ isLoading: true, error: null });
    try {
      const blob = await datasetService.exportDatasetList(type, format);
      const extension = format === 'csv' ? 'csv' : 'xlsx';
      get().handleFileDownload(blob, `list_${type}.${extension}`);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));