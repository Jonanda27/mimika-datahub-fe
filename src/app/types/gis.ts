// src/app/types/gis.ts

/**
 * Definisi identitas panel untuk logika Shifting Panels (GFW Paradigm).
 * Membantu Orchestrator menentukan komponen mana yang harus dirender di stack.
 */
export type ExplorerPanelType =
    | 'seleksi-opd'
    | 'katalog-aset'       // Telah dimutasi dari 'seleksi-kategori' untuk merepresentasikan domain OPD
    | 'katalog-wilayah'    // [REFACTOR] FASE 1: Penambahan tipe panel untuk fitur Eksplorasi Wilayah (Sidebar)
    | 'detil-distrik'
    | 'detil-aset'         // Penambahan tipe panel untuk detail spesifik titik aset (mikro)
    | 'konfigurasi'
    | 'hasil-pencarian'
    | 'tentang';           // Penambahan tipe baru untuk modul informasi aplikasi

/**
 * Interface untuk mengelola state panel yang sedang terbuka.
 * Prinsip Larman (Information Expert): Objek ini tahu posisinya sendiri di dalam stack.
 */
export interface ExplorerPanel {
    id: string;               // ID unik instance panel
    type: ExplorerPanelType;  // Jenis komponen panel
    title: string;            // Judul pada header panel
    isVisible: boolean;       // Status visibility untuk animasi
    data?: any;               // Payload data dinamis (misal: ID Distrik yang diklik atau query pencarian)
}

/**
 * Domain Entitas: Profil Statis Distrik.
 * Sinkron dengan Pydantic Schema 'DistrictProfile' di Backend (FastAPI).
 */
export interface DistrictProfile {
    id: number;
    luas_wilayah: number | null;
    jumlah_penduduk: number | null;
    deskripsi: string | null;
    batas_wilayah: string | null; // Narasi batas geografis
    kode_kemendagri?: string | null;
    thumbnail_url?: string | null; // [REFACTOR] FASE 1: Ditambahkan untuk mendukung Micro-Thumbnail pada list Sidebar
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
 * Catatan Analisis Prototype: 
 * Properti 'categories' dipertahankan secara struktural (backward compatibility), 
 * namun secara semantik (payload data) kini merepresentasikan kontribusi dari 'OPD'.
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
 * Kontrak data awal untuk memetakan kepadatan dataset ke GeoJSON (Choropleth Awal).
 */
export interface SpatialStatResponse {
    district_name: string;
    total_dataset: number;
    total_rows?: number | null;
    avg_quality?: number | null;
}

/**
 * [REFACTOR] Kontrak pembungkus agregasi statistik sebaran di peta.
 * Digunakan untuk mendukung batas jangkar legenda spasial dinamis (Continuous Anchoring) [2].
 */
export interface SpatialStatsWrapper {
    min_value: number;
    max_value: number;
    data: SpatialStatResponse[];
}