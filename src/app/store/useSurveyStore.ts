// File: src/app/store/useSurveyStore.ts

import { create } from "zustand";
import { surveyService } from "../services/survey.service";
import { 
  Survey, 
  SurveyCreate, 
  SurveyResponseCreate,
  SurveyDetailResponse 
} from "../types/survey";

interface SurveyState {
  // States
  surveys: Survey[];
  currentSurvey: SurveyDetailResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSurveys: () => Promise<void>;
  fetchSurveyDetail: (id: number) => Promise<void>;
  createSurvey: (data: SurveyCreate) => Promise<Survey>;
  submitResponse: (data: SurveyResponseCreate) => Promise<any>;
  clearError: () => void;
  clearCurrentSurvey: () => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  currentSurvey: null,
  isLoading: false,
  error: null,

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