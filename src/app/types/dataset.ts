// src/types/dataset.ts

export interface Dataset {
  id: number; 
  title: string;
  source_id: number; 
  category_id: number; 
  source_type_id: number; 
  year: number; 
  period: string; 
  dataset_type: 'pemerintah' | 'non-pemerintah'; 
  description?: string; 
  status: "pending" | "approved"; 
  total_rows: number; 
  quality_score: number; 
  created_at: string; 
}

// Tambahan untuk response general
export interface ApproveResponse {
  message: string;
}

export interface ExportParams {
  dataset_type: 'pemerintah' | 'non-pemerintah';
  file_format: 'excel' | 'csv';
}

export interface DatasetContent {
  title: string;
  type: string;
  headers: string[]; // Contoh: ["nama_distrik", "jumlah_penduduk"] [cite: 621]
  rows: Record<string, any>[]; // Array object dinamis sesuai isi konten [cite: 621]
}

export interface DatasetContentParams {
  dataset_id: number;
  limit?: number;
}