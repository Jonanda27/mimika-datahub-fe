// src/app/types/atlas.ts

/**
 * Metadata untuk memberikan konteks naratif pada setiap indikator di halaman Atlas.
 * Data ini berasal dari get_indicator_metadata di Backend.
 */
export interface AtlasMetadata {
    title: string;
    unit: string;
    description: string;
    color_scheme: string; // Contoh: 'Reds', 'Blues', 'Greens'
}

/**
 * Kontrak data spasial utama untuk fitur Choropleth.
 * Mapping antara slug distrik (lowercase, no space) dengan nilai indikatornya.
 * Contoh: { "mimikabaru": 12.5, "wania": 15.0 }
 */
export type AtlasSpatialData = Record<string, number>;

/**
 * Response utama dari API /api/v1/atlas/indicators/{type}
 */
export interface AtlasIndicatorResponse {
    indicator: string;
    metadata: AtlasMetadata;
    data: AtlasSpatialData;
}

/**
 * Interface untuk ringkasan metadata (pilihan menu/sidebar)
 */
export interface AtlasIndicatorBrief {
    key: string;
    metadata: AtlasMetadata;
}