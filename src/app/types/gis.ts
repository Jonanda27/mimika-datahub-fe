// src/app/types/gis.ts

/**
 * Representasi kontrak data dari response endpoint GET /api/v1/gis/stats.
 * Format ini menjamin kompleksitas O(1) saat melakukan mapping poligon GeoJSON.
 */
export interface SpatialStatResponse {
    district_name: string;
    total_dataset: number;
    total_rows?: number | null;
    avg_quality?: number | null;
}