// src/app/types/gis.ts

/**
 * Definisi identitas panel untuk logika Shifting Panels (GFW Paradigm).
 * Membantu Orchestrator menentukan komponen mana yang harus dirender di stack.
 */
export type ExplorerPanelType = 'category-selector' | 'district-detail' | 'indicator-config' | 'search-result';

/**
 * Interface untuk mengelola state panel yang sedang terbuka.
 * Prinsip Larman (Information Expert): Objek ini tahu posisinya sendiri di dalam stack.
 */
export interface ExplorerPanel {
    id: string;               // ID unik instance panel
    type: ExplorerPanelType;  // Jenis komponen panel
    title: string;            // Judul pada header panel
    isVisible: boolean;       // Status visibility untuk animasi
    data?: any;               // Payload data dinamis (misal: ID Distrik yang diklik)
}

/**
 * Domain Entitas: Profil Statis Distrik.
 * Sinkron dengan Pydantic Schema 'DistrictProfile' di Backend.
 */
export interface DistrictProfile {
    id: number;
    luas_wilayah: number | null;
    jumlah_penduduk: number | null;
    deskripsi: string | null;
    batas_wilayah: string | null; // Narasi batas geografis
    kode_kemendagri?: string | null;
}

/**
 * Representasi Indikator Spasial untuk Legenda Peta.
 * Menghubungkan nilai data dengan representasi visual.
 */
export interface SpatialIndicator {
    id: string;
    label: string;
    min_value: number;
    max_value: number;
    unit: string;
    steps: number; // Jumlah klasifikasi warna (bins)
}

/**
 * Response DTO untuk Drilldown Distrik (Injeksi Spasial).
 * Digunakan oleh DetailPanel.tsx saat user klik poligon di peta.
 */
export interface DistrictDrilldownResponse {
    district_id: number;
    district_name: string;
    profile: DistrictProfile;
    categories: Array<{
        category_id: number;
        name: string;
        total: number;
    }>;
    last_updated: string;
}

/**
 * Kontrak data awal untuk memetakan kepadatan dataset ke GeoJSON.
 */
export interface SpatialStatResponse {
    district_name: string;
    total_dataset: number;
    total_rows?: number | null;
    avg_quality?: number | null;
}