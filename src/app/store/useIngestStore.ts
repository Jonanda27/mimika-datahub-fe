// src/app/store/useIngestStore.ts

import { create } from 'zustand';
import { UploadResponse, UploadRequest } from '../types/ingest';
import { ingestService } from '../services/ingest.service';

interface IngestState {
  isProcessing: boolean;
  lastUploadResult: UploadResponse | null;
  error: string | null;

  // Actions
  setProcessing: (status: boolean) => void;
  setError: (msg: string | null) => void;
  setResult: (result: UploadResponse | null) => void; // [FIX]: Deklarasi kontrak tipe data setResult
  resetStore: () => void;

  // Thunk-like action untuk eksekusi upload
  executeUpload: (data: UploadRequest) => Promise<void>;
}

export const useIngestStore = create<IngestState>((set) => ({
  isProcessing: false,
  lastUploadResult: null,
  error: null,

  setProcessing: (status) => set({ isProcessing: status }),

  setError: (msg) => set({
    error: msg,
    isProcessing: false
  }),

  // [FIX]: Implementasi mutasi state untuk setResult
  setResult: (result) => set({ lastUploadResult: result }),

  resetStore: () => set({
    isProcessing: false,
    lastUploadResult: null,
    error: null
  }),

  executeUpload: async (data: UploadRequest) => {
    set({ isProcessing: true, error: null });
    try {
      const result = await ingestService.uploadProcess(data);
      set({
        lastUploadResult: result,
        isProcessing: false
      });
    } catch (err: any) {
      set({
        error: err.message,
        isProcessing: false
      });
      throw err; // Lempar kembali agar komponen bisa menangani (misal: toast)
    }
  }
}));