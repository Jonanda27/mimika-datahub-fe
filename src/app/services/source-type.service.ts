// src/services/source-type.service.ts
import { API_BASE_URL } from "../lib/config";
import { SourceType, SourceTypeCreate } from "../types/source-type";

export const sourceTypeService = {
  /**
   * Mengambil semua daftar Tipe Sumber
   * Endpoint: GET /api/v1/source-type/
   */
  async getSourceTypes(): Promise<SourceType[]> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/source-type/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data tipe sumber");
    }

    return response.json();
  },

  /**
   * Membuat Tipe Sumber baru
   * Endpoint: POST /api/v1/source-type/
   */
  async createSourceType(data: SourceTypeCreate): Promise<SourceType> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/source-type/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal membuat tipe sumber baru");
    }

    return response.json();
  },
};