// File: src/app/store/useSurveyStore.ts

import { create } from "zustand";
import { surveyService } from "../services/survey.service";
import { 
  Survey, 
  SurveyCreate, 
  SurveyResponseCreate,
  SurveyDetailResponse,
  SurveyStats,
  ExportFormat
} from "../types/survey";

interface SurveyState {
  // States
  surveys: Survey[];
  currentSurvey: SurveyDetailResponse | null;
  surveyStats: SurveyStats | null;
  isLoading: boolean;
  error: string | null;
  isExporting: boolean;

  // Actions
  fetchSurveys: () => Promise<void>;
  fetchSurveyDetail: (id: number) => Promise<void>;
  fetchSurveyStats: () => Promise<void>;
  createSurvey: (data: SurveyCreate) => Promise<Survey>;
  submitResponse: (data: SurveyResponseCreate) => Promise<any>;
  clearError: () => void;
  clearCurrentSurvey: () => void;
  exportResults: (surveyId: number, format: ExportFormat) => Promise<void>;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  currentSurvey: null,
  surveyStats: null,
  isLoading: false,
  error: null,
  isExporting: false,

  exportResults: async (surveyId, format) => {
    set({ isExporting: true });
    try {
      await surveyService.exportSurveyResults(surveyId, format);
    } catch (error: any) {
      console.error("Export Error:", error.message);
      alert(error.message);
    } finally {
      set({ isExporting: false });
    }
  },

  fetchSurveyStats: async () => {
    // Kita biarkan isLoading berjalan independen atau menyesuaikan kebutuhan UI
    // Disini tidak mereset error agar fetch list dan fetch stat bisa berjalan paralel tanpa saling tiban error
    try {
      const data = await surveyService.getSurveyStats();
      set({ surveyStats: data });
    } catch (error: any) {
      console.error("Gagal load stats:", error.message);
      // Opsional: set({ error: error.message })
    }
  },

  // 1. Ambil List Semua Survey
  fetchSurveys: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await surveyService.getAllSurveys();
      set({ surveys: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 2. Ambil Detail Survey (Beserta Responses)
  fetchSurveyDetail: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await surveyService.getSurveyDetail(id);
      set({ currentSurvey: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 3. Buat Survey Baru
  createSurvey: async (data: SurveyCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newSurvey = await surveyService.createSurvey(data);
      // Update data di state array surveys agar tidak perlu fetch ulang secara manual
      set((state) => ({ 
        surveys: [newSurvey, ...state.surveys], // Taruh paling atas
        isLoading: false 
      }));
      return newSurvey;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw new Error(error.message);
    }
  },

  // 4. Submit Jawaban Responden
  submitResponse: async (data: SurveyResponseCreate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await surveyService.submitResponse(data);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw new Error(error.message);
    }
  },

  // Utils
  clearError: () => set({ error: null }),
  clearCurrentSurvey: () => set({ currentSurvey: null })
}));