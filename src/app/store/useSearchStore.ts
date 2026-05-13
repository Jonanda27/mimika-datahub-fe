// src/app/store/useSearchStore.ts

import { create } from "zustand";
import { CategorySuggestion, DatasetSuggestion, SearchDatasetResult } from "../types/search";
import { searchService } from "../services/search.service";

interface SearchState {
  // State untuk Suggestions (Dropdown)
  suggestions: {
    categories: CategorySuggestion[];
    datasets: DatasetSuggestion[];
  };
  isLoadingSuggestions: boolean;
  
  // State untuk Hasil Pencarian Full (Saat kategori diklik)
  searchResults: SearchDatasetResult[];
  isSearching: boolean;
  
  // Error handling
  error: string | null;

  // Actions
  fetchSuggestions: (q: string) => Promise<void>;
  fetchByCategory: (categoryId: number, q?: string) => Promise<void>;
  clearSuggestions: () => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  suggestions: { categories: [], datasets: [] },
  isLoadingSuggestions: false,
  searchResults: [],
  isSearching: false,
  error: null,

  fetchSuggestions: async (q: string) => {
    // Jika input kosong, bersihkan suggestion
    if (!q || q.trim() === "") {
      set({ suggestions: { categories: [], datasets: [] }, error: null });
      return;
    }

    set({ isLoadingSuggestions: true, error: null });
    try {
      const data = await searchService.getSuggestions(q);
      set({ 
        suggestions: data.suggestions, 
        isLoadingSuggestions: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Gagal mengambil data", 
        isLoadingSuggestions: false 
      });
    }
  },

  fetchByCategory: async (categoryId: number, q?: string) => {
    set({ isSearching: true, error: null });
    try {
      const data = await searchService.searchByCategory(categoryId, q);
      set({ searchResults: data, isSearching: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Gagal melakukan pencarian", 
        isSearching: false 
      });
    }
  },

  clearSuggestions: () => set({ suggestions: { categories: [], datasets: [] } }),
  clearResults: () => set({ searchResults: [] }),
}));