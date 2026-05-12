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
  image_url?: string;
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

export interface DatasetRecentOut {
  id: number;
  title: string;
  image_url: string | null;
  template_url: string | null;
  category_name: string;
  source_name: string;
  created_at: string;
}

export interface DatasetByCategoryItem {
  id: number;
  title: string;
  image_url: string | null;
  source_name: string;
  created_at: string;
  description?: string; 
   source_type_id: number; 
  year: number; 
   source_id: number; 
}

export interface CategoryGroup {
  category_info: {
    name: string;
    template_url: string | null;
  };
  datasets: DatasetByCategoryItem[];
}

// Map Nama Kategori ke Group Data
export type LatestByCategoryResponse = Record<string, CategoryGroup>;