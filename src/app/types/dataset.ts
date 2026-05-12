// src/app/types/dataset.ts

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
  // Injeksi Spasial (GIS)
  district_id?: number | null;
  district?: {
    id: number;
    name: string;
  } | null;
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
  headers: string[]; // Contoh: ["nama_distrik", "jumlah_penduduk"]
  rows: Record<string, any>[]; // Array object dinamis sesuai isi konten
}

export interface DatasetContentParams {
  dataset_id: number;
  limit?: number;
}

export interface FilterStatItem {
  id: number;
  name: string;
  count: number;
}

export interface SidebarStats {
  categories: FilterStatItem[];
  sources: FilterStatItem[];
  source_types: FilterStatItem[];
  years: FilterStatItem[];
}

export interface DatasetFilterParams {
  category_id?: number | null;
  source_id?: number | null;
  source_type_id?: number | null;
  year?: number | null;
}