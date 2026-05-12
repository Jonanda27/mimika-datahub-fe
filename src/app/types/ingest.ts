// src/app/types/ingest.ts

export interface IngestStats {
  inserted: number;
  duplicates: number;
  empty: number;
  total: number;
  quality_score: number;
}

export interface UploadRequest {
  title: string;
  dataset_type: string; // Baru
  source_id: number;
  category_id: number;
  source_type_id: number; // Baru
  year: number;
  period: string;
  description?: string;
  file: File;
  // Injeksi Spasial (GIS)
  district_id?: number | null;
}

export interface UploadResponse {
  status: string;
  dataset_id: number;
  headers_found: string[];
  message: string;
  stats: IngestStats; // Struktur berubah menjadi nested object
}