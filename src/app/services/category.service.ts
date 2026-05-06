// src/services/category.service.ts
import { API_BASE_URL } from "../lib/config";
import { Category, CategoryCreate } from "../types/category";

export const categoryService = {
  /**
   * Mengambil daftar semua kategori dari master data
   * Endpoint: GET /api/v1/categories/
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/v1/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Sisipkan token jika diperlukan
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data kategori");
    }

    return response.json(); // Mengembalikan List[schemas.CategoryOut] 
  },
  /**
   * Menambahkan Kategori baru
   * Endpoint: POST /api/v1/categories/
   */
  async createCategory(data: CategoryCreate): Promise<Category> {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}/v1/categories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal membuat kategori baru");
    }

    return response.json(); // Mengembalikan schemas.CategoryOut 
  }
};