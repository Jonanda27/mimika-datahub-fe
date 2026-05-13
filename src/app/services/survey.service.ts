// File: src/app/services/survey.service.ts

import { API_BASE_URL } from "../lib/config";
import { 
  Survey, 
  SurveyCreate, 
  SurveyResponseCreate, 
  SurveySubmitResponse,
  SurveyDetailResponse 
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
  }
};