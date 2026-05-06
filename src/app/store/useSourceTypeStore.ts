// src/store/useSourceTypeStore.ts
import { create } from 'zustand';
import { SourceType, SourceTypeCreate } from '../types/source-type';
import { sourceTypeService } from '../services/source-type.service';

interface SourceTypeState {
  sourceTypes: SourceType[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSourceTypes: () => Promise<void>;
  addSourceType: (data: SourceTypeCreate) => Promise<SourceType>;
  setSourceTypes: (types: SourceType[]) => void;
}

export const useSourceTypeStore = create<SourceTypeState>((set, get) => ({
  sourceTypes: [],
  isLoading: false,
  error: null,

  setSourceTypes: (sourceTypes) => set({ sourceTypes }),

  fetchSourceTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sourceTypeService.getSourceTypes();
      set({ sourceTypes: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addSourceType: async (data: SourceTypeCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newType = await sourceTypeService.createSourceType(data);
      
      // Update state lokal agar UI langsung sinkron tanpa reload
      const currentTypes = get().sourceTypes;
      // Backend mengembalikan data lama jika nama sudah ada 
      const isExist = currentTypes.some(t => t.id === newType.id);
      
      if (!isExist) {
        set({ 
          sourceTypes: [...currentTypes, newType], 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
      
      return newType;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));