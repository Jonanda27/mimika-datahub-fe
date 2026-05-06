// src/store/useIngestStore.ts
import { create } from 'zustand';
import { UploadResponse } from '../types/ingest';

interface IngestState {
  isProcessing: boolean;
  lastUploadResult: UploadResponse | null;
  error: string | null;
  
  // Actions
  setProcessing: (status: boolean) => void;
  setResult: (result: UploadResponse) => void;
  setError: (msg: string | null) => void;
  resetStore: () => void;
}

export const useIngestStore = create<IngestState>((set) => ({
  isProcessing: false,
  lastUploadResult: null,
  error: null,

  setProcessing: (status) => set({ isProcessing: status }),
  
  setResult: (result) => set({ 
    lastUploadResult: result, 
    error: null,
    isProcessing: false 
  }),

  setError: (msg) => set({ 
    error: msg, 
    isProcessing: false 
  }),

  resetStore: () => set({ 
    isProcessing: false, 
    lastUploadResult: null, 
    error: null 
  })
}));