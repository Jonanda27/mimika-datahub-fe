// File: src/app/services/survey.service.ts

import { API_BASE_URL } from "../lib/config";
import { 
  Survey, 
  SurveyCreate, 
  SurveyResponseCreate, 
  SurveySubmitResponse,
  SurveyDetailResponse,
  SurveyStats,
  ExportFormat 
} from "../types/survey";

export const surveyService = {
  // 1. Buat Survey Baru
  async createSurvey(data: SurveyCreate): Promise<Survey> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/brida/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal membuat survey baru");
    }
    return response.json();
  },

  // 2. Submit Jawaban dari Responden
  async submitResponse(data: SurveyResponseCreate): Promise<SurveySubmitResponse> {
    const token = localStorage.getItem("auth_token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/v1/brida/submit-response`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal mengirim jawaban survey");
    }
    return response.json();
  },

  // ==========================================
  // TAMBAHAN API FETCH DATA
  // ==========================================

  // 3. Ambil Semua Daftar Survey
  async getAllSurveys(): Promise<Survey[]> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/v1/brida/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal mengambil daftar survey");
    }
    return response.json();
  },

  // 4. Ambil Detail Satu Survey beserta Jawabannya
  async getSurveyDetail(surveyId: number): Promise<SurveyDetailResponse> {
    const token = localStorage.getItem("auth_token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    
    // Opsional: Jika endpoint ini bersifat publik untuk halaman isi form, abaikan error no-token
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/v1/brida/${surveyId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal mengambil detail survey");
    }
    return response.json();
  },

  // ==========================================
  // TAMBAHAN: API MENGAMBIL STATISTIK SURVEY
  // ==========================================
  async getSurveyStats(): Promise<SurveyStats> {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}/v1/brida/stats`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Pastikan API ini terlindungi oleh token jika untuk halaman admin/brida
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal mengambil statistik survey");
    }
    
    return response.json();
  },

  async exportSurveyResults(surveyId: number, format: ExportFormat = 'xlsx'): Promise<void> {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(
      `${API_BASE_URL}/v1/brida/export/${surveyId}?format=${format}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Gagal mengunduh file export");
    }

    // Proses download file di browser
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hasil_Survey_${surveyId}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};