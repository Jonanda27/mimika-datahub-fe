// src/types/ingest.ts

export interface IngestStats {
  inserted: number;
  duplicates: number;
  empty_rows: number; // Update sesuai backend
  empty_cells: number; // Baru
  total: number;
  quality_score: number;
}

export interface UploadRequest {
  title: string;
  dataset_type: string;
  source_id: number;
  category_id: number;
  source_type_id: number;
  year: number;
  period: string;
  description?: string;
  district_id?: number | null; // Baru: Opsional sesuai backend Form(None)
  file: File;
  image: File;

}

export interface UploadResponse {
  status: string;
  dataset_id: number;
  headers_found: string[];
  message: string;
  stats: IngestStats;
}