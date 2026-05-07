import { API_BASE_URL } from "../lib/config";
import { MainStatsResponse } from "../types/stats";

export const statsService = {
  /**
   * Mengambil semua data statistik untuk Dashboard Utama
   * Endpoint: GET /api/v1/stats/main-stats
   */
  async getMainStats(): Promise<MainStatsResponse> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/dashboard/main-stats`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data statistik dashboard");
    }

    return response.json();
  },
};