// src/services/dataset.service.ts
import { API_BASE_URL } from "../lib/config";
import { Dataset, ApproveResponse, DatasetContent } from "../types/dataset";

export const datasetService = {
  /**
   * Mengambil daftar dataset yang statusnya masih 'pending'
   * Endpoint: GET /api/v1/datasets/pending-list
   */
  async getPendingDatasets(): Promise<Dataset[]> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/datasets/pending-list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal mengambil daftar pending");
    }
    return response.json(); 
  },

  /**
   * Menyetujui dataset agar status berubah menjadi 'approved'
   * Endpoint: PATCH /api/v1/datasets/{dataset_id}/approve
   */
  async approveDataset(datasetId: number): Promise<ApproveResponse> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/datasets/${datasetId}/approve`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal menyetujui dataset");
    }
    return response.json(); 
  },
  /**
   * Mengambil semua dataset yang sudah disetujui (Role: Admin)
   */
  async getApprovedDatasets(): Promise<Dataset[]> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/datasets/approved-list`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Gagal mengambil daftar dataset disetujui");
    return response.json();
  },

  /**
   * Mengambil dataset publik tipe Pemerintah
   */
  async getGovernmentDatasets(): Promise<Dataset[]> {
    const response = await fetch(`${API_BASE_URL}/v1/datasets/pemerintah`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Gagal mengambil data pemerintah");
    return response.json();
  },

  /**
   * Mengambil dataset publik tipe Non-Pemerintah
   */
  async getNonGovernmentDatasets(): Promise<Dataset[]> {
    const response = await fetch(`${API_BASE_URL}/v1/datasets/non-pemerintah`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Gagal mengambil data non-pemerintah");
    return response.json();
  },

  /**
   * Mengambil dataset yang diupload oleh user yang sedang login
   * Endpoint: GET /api/v1/datasets/my-datasets
   */
  async getMyDatasets(): Promise<Dataset[]> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/view/my-datasets`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Gagal mengambil dataset Anda");
    return response.json();
  },

  /**
   * Export satu dataset spesifik berdasarkan ID (Download File)
   * Endpoint: GET /api/v1/datasets/export/{dataset_id}
   */
  async exportDatasetById(datasetId: number): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/v1/view/export/${datasetId}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Gagal mengekspor dataset");
    return response.blob();
  },

  /**
   * Export daftar dataset berdasarkan tipe dan format (Download File)
   * Endpoint: GET /api/v1/datasets/export-list
   */
  async exportDatasetList(type: string, format: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/v1/view/export-list?dataset_type=${type}&file_format=${format}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Gagal mengekspor daftar dataset");
    return response.blob();
  },

  /**
   * Mengambil isi data bersih untuk preview tabel
   * Endpoint: GET /api/v1/datasets/content/{dataset_id}
   */
  async getDatasetContent(datasetId: number, limit: number = 100): Promise<DatasetContent> {
    const token = localStorage.getItem("auth_token"); // [cite: 550, 555]
    const response = await fetch(`${API_BASE_URL}/v1/view/content/${datasetId}?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // [cite: 551, 555]
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal memuat konten dataset"); // [cite: 553, 557]
    }

    return response.json();
  }
};