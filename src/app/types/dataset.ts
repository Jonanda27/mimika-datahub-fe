// src/types/dataset.ts

export interface Dataset {
  id: number; 
  title: string; 
  source_id: number; 
  category_id: number; 
  source_type_id: number; 
  year: number; 
  period: string; 
  dataset_type: string; 
  description?: string; 
  status: "pending" | "approved"; 
  headers?: string[]; 
  total_rows: number; 
  quality_score: number; 
  created_at: string; 
}

export interface ApproveResponse {
  message: string;
}