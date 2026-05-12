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

/**
 * Domain Entitas: Profil Statis Distrik
 * Menyimpan informasi geografis dan demografis dasar dari Bappeda.
 */
export interface DistrictProfile {
    luas_wilayah: number | null;
    jumlah_penduduk: number | null;
    deskripsi: string | null;
    batas_wilayah: string | null;
}

/**
 * Domain Entitas: Agregasi Kepadatan per Kategori
 * Menyimpan informasi ketersediaan dataset sektoral pada suatu distrik.
 */
export interface CategoryDensity {
    category_id: number;
    name: string;
    total: number;
}

/**
 * Kontrak data spasial dari response endpoint GET /api/v1/gis/district/{district_id}/drilldown
 * Digunakan untuk merender UI Pop-up/Modal di peta secara langsung tanpa kalkulasi tambahan di sisi client.
 */
export interface DistrictDrilldownResponse {
    district_id: number;
    district_name: string;
    profile: DistrictProfile;
    categories: CategoryDensity[];
}