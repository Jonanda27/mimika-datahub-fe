// src/types/search.d.ts (atau letakkan di folder type Anda)

export interface CategorySuggestion {
  id: number;
  name: string;
}

export interface DatasetSuggestion {
  id: number;
  title: string;
  category_id: number;
  dataset_type: string;
}

export interface SearchSuggestionsResponse {
  suggestions: {
    categories: CategorySuggestion[];
    datasets: DatasetSuggestion[];
  };
}

// Gunakan interface Dataset yang sudah ada jika Anda sudah punya
export interface SearchDatasetResult {
  id: number;
  title: string;
  category_id: number;
  dataset_type: string;
  year: number;
  period: string;
  total_rows: number;
  quality_score: number;
  status: string;
}