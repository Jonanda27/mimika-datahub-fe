// src/app/services/searchService.ts

import { API_BASE_URL } from "../lib/config";
import { SearchSuggestionsResponse, SearchDatasetResult } from "../types/search"; // Sesuaikan path type Anda

export const searchService = {
  /**
   * Mengambil saran pencarian untuk kategori dan dataset
   * Endpoint: GET /api/v1/view/search-suggestions?q=...
   */
  async getSuggestions(q: string): Promise<SearchSuggestionsResponse> {
    const queryParams = new URLSearchParams({ q });
    const response = await fetch(`${API_BASE_URL}/v1/view/search-suggestions?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil saran pencarian");
    }

    return response.json();
  },

  /**
   * Mencari dataset spesifik di dalam satu kategori
   * Endpoint: GET /api/v1/view/search-by-category?category_id=...&q=...
   */
  async searchByCategory(categoryId: number, q?: string): Promise<SearchDatasetResult[]> {
    const queryParams = new URLSearchParams({ category_id: categoryId.toString() });
    
    // Jika ada parameter q, tambahkan ke query params
    if (q) {
      queryParams.append("q", q);
    }

    const response = await fetch(`${API_BASE_URL}/v1/view/search-by-category?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mencari data berdasarkan kategori");
    }

    return response.json();
  },
};