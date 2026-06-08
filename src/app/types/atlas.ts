// src/app/types/atlas.ts

/**
 * Tipe data untuk mendefinisikan wujud "Panggung Visual" di layar kanan Atlas.
 * Digunakan oleh Visual Orchestrator untuk mengatur transisi komponen.
 */
export type AtlasVisualMode = 'map' | 'chart' | 'stat';

/**
 * Metadata untuk memberikan konteks naratif pada setiap indikator di halaman Atlas.
 * Data ini berasal dari `get_indicator_metadata` di sisi Backend.
 */
export interface AtlasMetadata {
    title: string;
    unit: string;
    description: string;
    color_scheme: string; // Contoh: 'Reds', 'Blues', 'Greens'
    source?: string;      // Institusi penyedia data (OPD)
}

/**
 * Kontrak data spasial utama untuk fitur Choropleth.
 * Memetakan slug distrik langsung dengan nilai agregatnya.
 */
export type AtlasSpatialData = Record<string, number>;

/**
 * Response DTO utama dari API /api/v1/atlas/indicators/{type}
 */
export interface AtlasIndicatorResponse {
    indicator: string;
    metadata: AtlasMetadata;
    data: AtlasSpatialData;
}

/**
 * Interface untuk grup indikator berdasarkan kategori sektoral.
 * Mendukung fitur filter multi-kategori (Fase 1 Activity).
 */
export interface AtlasCategoryGroup {
    category_id: number;
    category_name: string;
    indicators: AtlasIndicatorBrief[];
}

/**
 * Ringkasan indikator untuk daftar seleksi (Sidebar/Panel).
 */
export interface AtlasIndicatorBrief {
    key: string;      // Key unik (slug) untuk fetching data detail
    title: string;    // Nama tampilan indikator
    category_id: number;
}

/**
 * Parameter filter dinamis untuk Atlas & Explorer.
 * Mendukung drill-down per tahun dan per kategori.
 */
export interface AtlasFilterParams {
    year: number;
    category_ids: number[]; // Array untuk mendukung multi-kategori
    search?: string;
}