// File: src/app/types/survey.ts

export interface SurveyQuestion {
  text: string;
  type: string;
  required: boolean;
}

export interface Survey {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  location?: string;
  start_date?: string;
  end_date?: string;
  questions: SurveyQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface SurveyCreate {
  title: string;
  description?: string;
  is_active?: boolean;
  location?: string;
  start_date?: string;
  end_date?: string;
  questions: SurveyQuestion[];
}

// Tipe untuk data satu baris jawaban
export interface SurveyResponseItem {
  id: number;
  survey_id: number;
  email?: string | null;
  answers: Record<string, any>;
  created_at?: string;
}

// Tipe untuk payload saat mensubmit jawaban (dari sisi user)
export interface SurveyResponseCreate {
  survey_id: number;
  email?: string | null;
  answers: Record<string, any>;
}

// Tipe balikan API untuk Detail Survey (Beserta List Jawaban)
export interface SurveyDetailResponse {
  survey: Survey;
  total_responses: number;
  responses: SurveyResponseItem[];
}

export interface SurveySubmitResponse {
  status: string;
  message: string;
}

export interface SurveyStats {
  total: number;
  active: number;
  responses: number;
  datasets: number;
}

export type ExportFormat = 'xlsx' | 'csv';