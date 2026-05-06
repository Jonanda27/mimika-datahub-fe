// src/store/useCategoryStore.ts
import { create } from 'zustand';
import { Category, CategoryCreate } from '../types/category';
import { categoryService } from '../services/category.service';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
  // Action baru
  addCategory: (data: CategoryCreate) => Promise<Category>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  setCategories: (categories) => set({ categories }),

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoryService.getCategories();
      set({ categories: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  /**
   * Mengirim kategori ke server dan memperbarui state lokal
   */
  addCategory: async (data: CategoryCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryService.createCategory(data);
      // Update daftar kategori secara lokal agar sinkron ke dropdown UI
      set((state) => ({ 
        categories: [...state.categories, newCategory],
        isLoading: false 
      }));
      return newCategory;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));