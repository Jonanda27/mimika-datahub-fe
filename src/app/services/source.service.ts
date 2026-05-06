// src/services/source.service.ts
import { API_BASE_URL } from "../lib/config";
import { Source, SourceCreate } from "../types/source";

export const sourceService = {
  /**
   * Mengambil daftar seluruh Sumber Data (OPD/BPS)
   * Endpoint: GET /api/v1/sources/
   */
  async getSources(): Promise<Source[]> {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}/v1/sources/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data sumber data (OPD)");
    }

    return response.json();
  },

  /**
   * Menambahkan Sumber Data (OPD) baru
   * Endpoint: POST /api/v1/sources/
   */
  async createSource(data: SourceCreate): Promise<Source> {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}/v1/sources/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Menangkap detail error "Nama Sumber Data sudah terdaftar" dari backend [cite: 65]
      throw new Error(errorData.detail || "Gagal membuat sumber data baru");
    }

    return response.json();
  }
};