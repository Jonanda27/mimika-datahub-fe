// src/app/services/monitoring.service.ts
import { API_BASE_URL } from "../lib/config";
import { MonitoringSummaryResponse, ReminderResponse } from "../types/monitoring";

export const monitoringService = {
  /**
   * Mengambil ringkasan monitoring kepatuhan OPD
   */
  async getOpdSummary(): Promise<MonitoringSummaryResponse> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/monitoring/opd-summary`, { // Sesuaikan prefix router Anda
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data monitoring OPD");
    }
    return response.json();
  },

  /**
   * Mengirim reminder ke OPD tertentu
   */
  async sendReminder(userId: number): Promise<ReminderResponse> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/monitoring/remind/${userId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim reminder");
    }
    return response.json();
  },
};