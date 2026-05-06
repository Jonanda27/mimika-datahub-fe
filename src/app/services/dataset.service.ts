// src/services/dataset.service.ts
import { API_BASE_URL } from "../lib/config";
import { Dataset, ApproveResponse } from "../types/dataset";

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
  }
};