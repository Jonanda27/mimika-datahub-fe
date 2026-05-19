// src/app/types/gis.ts

/**
 * Definisi identitas panel untuk logika Shifting Panels (GFW Paradigm).
 * Membantu Orchestrator menentukan komponen mana yang harus dirender di stack.
 */
export type ExplorerPanelType =
    | 'seleksi-opd'       // [UBAH] Transisi dari 'seleksi-kategori' ke 'seleksi-opd' (GFW Paradigm)
    | 'detil-distrik'
    | 'konfigurasi'
    | 'hasil-pencarian'
    | 'tentang';

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

// ============================================================================
// DOMAIN 1: MASTER DATA (Entitas Kepemilikan & Geografis)
// ============================================================================

/**
 * Entitas Master OPD (Organisasi Perangkat Daerah)
 * Pilar 1: Paradigma Kepemilikan Data (Data Ownership).
 */
export interface OPD {
    id: number;
    name: string;
    acronym?: string;
    theme_color: string;      // Standarisasi warna tematik institusional (Hex code)
    default_icon: string;     // Standarisasi visual: Nama icon Lucide (e.g., "Building2", "Stethoscope")
}

/**
 * Entitas Master Distrik (Kecamatan)
 * Menjadi acuan struktural untuk validasi batas wilayah.
 */
export interface District {
    id: number;
    name: string;
    // geojson_polygon?: any; // Disimpan di file GeoJSON terpisah agar tidak membebani memori DTO
}

export interface DistrictProfile {
    id: number;
    luas_wilayah: number | null;
    jumlah_penduduk: number | null;
    deskripsi: string | null;
    batas_wilayah: string | null; // Narasi batas geografis
    kode_kemendagri?: string | null;
}

// ============================================================================
// DOMAIN 2: DUAL-LAYERING SPASIAL
// ============================================================================

/**
 * Representasi Indikator Spasial untuk Legenda Peta.
 * Digunakan oleh Layer Statistik (Poligon).
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
 * Layer Statistik (Poligon / Choropleth)
 * Sifat: Single-Selection.
 * Digunakan untuk merender warna gradasi wilayah per distrik.
 */
export interface PolygonLayer {
    id: string;
    opd_id: number;             // Relasi mutlak ke OPD
    name: string;               // Contoh: "Tingkat Kepadatan Penduduk"
    description?: string;
    indicator: SpatialIndicator; // Skema warna & rentang nilai
}

/**
 * Layer Aset (Titik / Point Marker)
 * Sifat: Multi-Selection (Bisa ditumpuk lintas OPD).
 */
export interface AssetLayer {
    id: string;
    opd_id: number;             // Relasi mutlak ke OPD
    name: string;               // Contoh: "Lokasi Puskesmas", "Armada Truk"
    icon_name: string;          // Ikon spesifik Lucide (jika beda dari default_icon OPD)
    color?: string;             // Warna khusus untuk pin/marker
}

/**
 * Data Titik Aset Individual (Titik Koordinat Aktual)
 * Pilar 2: Alur Input District-First (Geofencing Constraint).
 */
export interface AssetFeature {
    id: string;
    layer_id: string;           // Merujuk ke AssetLayer
    opd_id: number;             // OPD penanggung jawab
    district_id: number;        // BUKTI INTEGRITAS: Titik ini sah berada di distrik ini
    name: string;               // Contoh: "Puskesmas Timika Jaya"
    latitude: number;
    longitude: number;
    properties?: Record<string, any>; // Metadata dinamis (Alamat, Jam Buka, dll)
}

// ============================================================================
// DOMAIN 3: DATA TRANSFER OBJECTS (RESPONSE)
// ============================================================================

/**
 * Response DTO untuk Drilldown Distrik (Injeksi Spasial).
 * Menampilkan rincian aset & statistik OPD saat distrik diklik di peta.
 */
export interface DistrictDrilldownResponse {
    district_id: number;
    district_name: string;
    profile: DistrictProfile;
    // [UBAH] Relasi data diubah dari 'categories' menjadi 'opd_stats'
    opd_stats: Array<{
        opd_id: number;
        opd_name: string;
        total_assets: number;
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