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
}

/**
 * Kontrak data spasial utama untuk fitur Choropleth.
 * Memetakan slug distrik (lowercase, no space) langsung dengan nilai agregatnya.
 * Menggunakan Record/Hashmap agar pencarian di Frontend beroperasi pada O(1).
 * Contoh: { "mimikabaru": 12.5, "wania": 15.0 }
 */
export type AtlasSpatialData = Record<string, number>;

/**
 * Response Data Transfer Object (DTO) utama dari API `/api/v1/atlas/indicators/{type}`.
 * Membungkus identitas, narasi, dan data spasial dalam satu payload.
 */
export interface AtlasIndicatorResponse {
    indicator: string;
    metadata: AtlasMetadata;
    data: AtlasSpatialData;
}

/**
 * Interface untuk ringkasan metadata.
 * Berguna saat memuat daftar indikator di awal tanpa harus menarik semua data nilainya.
 */
export interface AtlasIndicatorBrief {
    key: string;
    metadata: AtlasMetadata;
}