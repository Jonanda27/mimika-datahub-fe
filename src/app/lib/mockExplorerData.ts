// src/app/lib/mockExplorerData.ts

import {
    DistrictDrilldownResponse,
    SpatialStatResponse,
    OPD,
    PolygonLayer,
    AssetLayer,
    AssetFeature
} from "../types/gis";
import {
    AtlasCategoryGroup,
    AtlasIndicatorResponse
} from "../types/atlas";

// ============================================================================
// 1. MOCK DATA: MASTER OPD (Pemilik Data)
// Pilar 1: Paradigma Kepemilikan Data (Data Ownership)
// ============================================================================
export const MOCK_OPDS: OPD[] = [
    {
        id: 1,
        name: "Dinas Kesehatan",
        acronym: "DINKES",
        theme_color: "#10b981", // Emerald
        default_icon: "HeartPulse"
    },
    {
        id: 2,
        name: "Dinas Pekerjaan Umum dan Penataan Ruang",
        acronym: "PUPR",
        theme_color: "#f59e0b", // Amber
        default_icon: "HardHat"
    },
    {
        id: 3,
        name: "Badan Perencanaan Pembangunan Daerah",
        acronym: "BAPPEDA",
        theme_color: "#3b82f6", // Blue
        default_icon: "LineChart"
    }
];

// ============================================================================
// 2. MOCK DATA: LAYER POLIGON (Statistik / Choropleth)
// Sifat: Single-Selection. Relasi 1:M ke OPD.
// ============================================================================
export const MOCK_POLYGON_LAYERS: PolygonLayer[] = [
    {
        id: "poly_stunting",
        opd_id: 1, // Milik DINKES
        name: "Prevalensi Balita Stunting",
        description: "Persentase balita (0-59 bulan) yang mengalami gagal tumbuh per distrik.",
        indicator: {
            id: "stunting_rate",
            label: "Prevalensi Stunting",
            min_value: 0,
            max_value: 50,
            unit: "%",
            steps: 5
        }
    },
    {
        id: "poly_air_bersih",
        opd_id: 2, // Milik PUPR
        name: "Cakupan Air Minum Layak",
        description: "Persentase RT dengan akses ke sumber air bersih per distrik.",
        indicator: {
            id: "akses_air_bersih",
            label: "Akses Air Bersih",
            min_value: 0,
            max_value: 100,
            unit: "%",
            steps: 5
        }
    },
    {
        id: "poly_kemiskinan",
        opd_id: 3, // Milik BAPPEDA
        name: "Garis Kemiskinan Ekstrem",
        description: "Penduduk yang pengeluarannya berada di bawah garis kemiskinan ekstrem.",
        indicator: {
            id: "indeks_kemiskinan",
            label: "Tingkat Kemiskinan",
            min_value: 0,
            max_value: 60,
            unit: "%",
            steps: 5
        }
    }
];

// ============================================================================
// 3. MOCK DATA: LAYER ASET (Point / Marker Blueprint)
// Sifat: Multi-Selection (Bisa menyala bersamaan di atas Peta)
// ============================================================================
export const MOCK_ASSET_LAYERS: AssetLayer[] = [
    { id: "asset_puskesmas", opd_id: 1, name: "Puskesmas Pratama", icon_name: "Building2", color: "#10b981" },
    { id: "asset_pustu", opd_id: 1, name: "Puskesmas Pembantu (Pustu)", icon_name: "Tent", color: "#059669" },
    { id: "asset_jembatan", opd_id: 2, name: "Infrastruktur Jembatan", icon_name: "Bridge", color: "#f59e0b" },
    { id: "asset_air", opd_id: 2, name: "Instalasi Pengolahan Air (IPA)", icon_name: "Droplets", color: "#d97706" }
];

// ============================================================================
// 4. MOCK DATA: TITIK KOORDINAT ASET AKTUAL
// Pilar 2: Geofencing Constraint (Terkunci oleh district_id & opd_id)
// ============================================================================
export const MOCK_ASSET_FEATURES: AssetFeature[] = [
    {
        id: "feat_001",
        layer_id: "asset_puskesmas",
        opd_id: 1,
        district_id: 1, // Kunci Geofencing: Hanya valid jika lat/long jatuh di Mimika Baru
        name: "Puskesmas Timika Jaya",
        latitude: -4.5461,
        longitude: 136.8831,
        properties: { status: "Aktif", kapasitas_ranap: 20 }
    },
    {
        id: "feat_002",
        layer_id: "asset_puskesmas",
        opd_id: 1,
        district_id: 2, // Kunci Geofencing: Kuala Kencana
        name: "Klinik Utama Kuala Kencana",
        latitude: -4.4167,
        longitude: 136.8333,
        properties: { status: "Aktif", kapasitas_ranap: 50 }
    },
    {
        id: "feat_003",
        layer_id: "asset_air",
        opd_id: 2,
        district_id: 1, // Kunci Geofencing: Mimika Baru
        name: "IPA SPAM Timika",
        latitude: -4.5500,
        longitude: 136.8900,
        properties: { kapasitas_liter_detik: 500 }
    }
];

// ============================================================================
// 5. MOCK DATA: DRILLDOWN DISTRIK (Refactored ke opd_stats)
// ============================================================================
export const MOCK_DISTRICT_DRILLDOWN: Record<number, DistrictDrilldownResponse> = {
    1: {
        district_id: 1,
        district_name: "Mimika Baru",
        profile: {
            id: 1,
            luas_wilayah: 2216.00,
            jumlah_penduduk: 142519,
            deskripsi: "Distrik Mimika Baru adalah pusat administrasi pemerintahan dan episentrum ekonomi utama.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Wania",
            kode_kemendagri: "91.09.01"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 45 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 82 },
            { opd_id: 3, opd_name: "BAPPEDA", total_assets: 14 }
        ],
        last_updated: "2026-05-10T08:00:00Z"
    },
    2: {
        district_id: 2,
        district_name: "Kuala Kencana",
        profile: {
            id: 2,
            luas_wilayah: 860.74,
            jumlah_penduduk: 29104,
            deskripsi: "Kota industri modern pertama di Indonesia dengan indeks kualitas hidup tertinggi.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Baru",
            kode_kemendagri: "91.09.11"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 18 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 104 }
        ],
        last_updated: "2026-05-12T10:30:00Z"
    },
    3: {
        district_id: 3,
        district_name: "Tembagapura",
        profile: {
            id: 3,
            luas_wilayah: 2586.88,
            jumlah_penduduk: 22120,
            deskripsi: "Menampung operasi tambang emas dan tembaga bawah tanah terbesar di dunia.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Kuala Kencana",
            kode_kemendagri: "91.09.04"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 15 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 88 }
        ],
        last_updated: "2026-04-20T15:00:00Z"
    },
    4: {
        district_id: 4,
        district_name: "Wania",
        profile: {
            id: 4,
            luas_wilayah: 310.20,
            jumlah_penduduk: 55210,
            deskripsi: "Daerah penyangga langsung Distrik Mimika Baru, didominasi pemukiman transmigran.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.12"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 22 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 24 }
        ],
        last_updated: "2026-05-01T09:15:00Z"
    },
    // Karena instruksi meminta format yang efisien dan menghindari token bloating tanpa mengurangi fungsionalitas,
    // Pola District 5-18 diseragamkan dengan tipe DTO 'opd_stats'
    5: {
        district_id: 5,
        district_name: "Iwaka",
        profile: {
            id: 5,
            luas_wilayah: 785.40,
            jumlah_penduduk: 11450,
            deskripsi: "Dikenal dengan potensi ekowisata alam dan jalur distribusi Trans Papua.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Tengah",
            kode_kemendagri: "91.09.13"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 10 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 15 }
        ],
        last_updated: "2026-05-14T11:00:00Z"
    },
    6: {
        district_id: 6,
        district_name: "Kwamki Narama",
        profile: {
            id: 6,
            luas_wilayah: 240.50,
            jumlah_penduduk: 14890,
            deskripsi: "Distrik terpadat dengan fokus pendekatan humanis dan pemberdayaan komunitas.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Mimika Baru",
            kode_kemendagri: "91.09.14"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 14 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 18 }
        ],
        last_updated: "2026-05-13T14:45:00Z"
    },
    7: {
        district_id: 7,
        district_name: "Mimika Timur",
        profile: {
            id: 7,
            luas_wilayah: 1520.10,
            jumlah_penduduk: 9540,
            deskripsi: "Kawasan estuari, kaya potensi perikanan pesisir dan hutan mangrove.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.02"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 8 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 12 }
        ],
        last_updated: "2026-05-11T08:30:00Z"
    },
    8: {
        district_id: 8,
        district_name: "Mimika Tengah",
        profile: {
            id: 8,
            luas_wilayah: 2150.30,
            jumlah_penduduk: 6230,
            deskripsi: "Hamparan dataran rendah rawa dengan transportasi air sebagai penghubung utama.",
            batas_wilayah: "Utara: Distrik Iwaka, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.10"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 5 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 6 }
        ],
        last_updated: "2026-05-09T13:20:00Z"
    },
    9: {
        district_id: 9,
        district_name: "Mimika Barat",
        profile: {
            id: 9,
            luas_wilayah: 2750.00,
            jumlah_penduduk: 4200,
            deskripsi: "Distrik terluar pesisir barat, rentan terisolasi saat cuaca buruk.",
            batas_wilayah: "Utara: Kabupaten Deiyai, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.03"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 4 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 3 }
        ],
        last_updated: "2026-05-15T09:00:00Z"
    },
    10: {
        district_id: 10,
        district_name: "Agimuga",
        profile: {
            id: 10,
            luas_wilayah: 3120.45,
            jumlah_penduduk: 3150,
            deskripsi: "Distrik terluas di pegunungan, pasokan bergantung pada penerbangan perintis.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Mimika Timur Jauh",
            kode_kemendagri: "91.09.05"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 3 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 2 }
        ],
        last_updated: "2026-05-05T07:15:00Z"
    },
    11: {
        district_id: 11,
        district_name: "Jila",
        profile: {
            id: 11,
            luas_wilayah: 1820.00,
            jumlah_penduduk: 2800,
            deskripsi: "Topografi sangat curam, masyarakat hidup subsisten.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Agimuga",
            kode_kemendagri: "91.09.06"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 2 }
        ],
        last_updated: "2026-05-16T10:00:00Z"
    },
    12: {
        district_id: 12,
        district_name: "Jita",
        profile: {
            id: 12,
            luas_wilayah: 1350.00,
            jumlah_penduduk: 3200,
            deskripsi: "Dataran rendah bermilir dan berlumpur, potensi perikanan darat.",
            batas_wilayah: "Utara: Distrik Agimuga, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.07"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 3 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 4 }
        ],
        last_updated: "2026-05-17T11:20:00Z"
    },
    13: {
        district_id: 13,
        district_name: "Mimika Timur Jauh",
        profile: {
            id: 13,
            luas_wilayah: 2050.00,
            jumlah_penduduk: 4500,
            deskripsi: "Menghadapi kendala abrasi pantai di permukiman nelayan.",
            batas_wilayah: "Utara: Distrik Agimuga, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.08"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 4 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 5 }
        ],
        last_updated: "2026-05-18T09:30:00Z"
    },
    14: {
        district_id: 14,
        district_name: "Mimika Barat Jauh",
        profile: {
            id: 14,
            luas_wilayah: 3450.00,
            jumlah_penduduk: 2100,
            deskripsi: "Luasan daratan rawa terbesar, akses listrik sangat minim.",
            batas_wilayah: "Utara: Kabupaten Kaimana, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.09"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 2 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 2 }
        ],
        last_updated: "2026-05-19T08:15:00Z"
    },
    15: {
        district_id: 15,
        district_name: "Mimika Barat Tengah",
        profile: {
            id: 15,
            luas_wilayah: 2850.00,
            jumlah_penduduk: 3800,
            deskripsi: "Perkembangan dermaga perintis, bergantung pada hasil meramu hutan.",
            batas_wilayah: "Utara: Kabupaten Deiyai, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.15"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 3 }
        ],
        last_updated: "2026-05-20T10:45:00Z"
    },
    16: {
        district_id: 16,
        district_name: "Amar",
        profile: {
            id: 16,
            luas_wilayah: 1250.00,
            jumlah_penduduk: 2950,
            deskripsi: "Proyeksi klaster perikanan tangkap, kendala air bersih payau.",
            batas_wilayah: "Utara: Distrik Mimika Barat, Selatan: Laut Arafuru",
            kode_kemendagri: "91.09.16"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 4 },
            { opd_id: 2, opd_name: "Dinas PUPR", total_assets: 6 }
        ],
        last_updated: "2026-05-21T13:00:00Z"
    },
    17: {
        district_id: 17,
        district_name: "Hoya",
        profile: {
            id: 17,
            luas_wilayah: 980.00,
            jumlah_penduduk: 1500,
            deskripsi: "Wilayah kantong di dataran tinggi, bergantung penerbangan perintis.",
            batas_wilayah: "Utara: Kabupaten Nduga, Selatan: Distrik Tembagapura",
            kode_kemendagri: "91.09.17"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 1 }
        ],
        last_updated: "2026-05-22T08:00:00Z"
    },
    18: {
        district_id: 18,
        district_name: "Alama",
        profile: {
            id: 18,
            luas_wilayah: 1520.80,
            jumlah_penduduk: 1980,
            deskripsi: "Paling terisolir di sabuk Pegunungan Jayawijaya, andalkan 'Flying Doctor'.",
            batas_wilayah: "Utara: Kabupaten Nduga, Selatan: Distrik Agimuga",
            kode_kemendagri: "91.09.18"
        },
        opd_stats: [
            { opd_id: 1, opd_name: "Dinas Kesehatan", total_assets: 2 }
        ],
        last_updated: "2026-04-28T16:00:00Z"
    }
};

// ============================================================================
// 6. MOCK DATA: STATISTIK SPASIAL & INDIKATOR CHOROPLETH AKTUAL
// ============================================================================

export const MOCK_SPATIAL_STATS: SpatialStatResponse[] = [
    { district_name: "Mimika Baru", total_dataset: 296, total_rows: 245000, avg_quality: 94.5 },
    { district_name: "Kuala Kencana", total_dataset: 179, total_rows: 82000, avg_quality: 98.1 },
    { district_name: "Tembagapura", total_dataset: 259, total_rows: 310000, avg_quality: 99.8 },
    { district_name: "Wania", total_dataset: 99, total_rows: 65000, avg_quality: 85.0 },
    { district_name: "Iwaka", total_dataset: 65, total_rows: 21000, avg_quality: 82.4 },
    { district_name: "Kwamki Narama", total_dataset: 99, total_rows: 45000, avg_quality: 84.1 },
    { district_name: "Mimika Timur", total_dataset: 75, total_rows: 18000, avg_quality: 80.5 },
    { district_name: "Mimika Tengah", total_dataset: 34, total_rows: 9500, avg_quality: 74.2 },
    { district_name: "Mimika Barat", total_dataset: 28, total_rows: 7200, avg_quality: 72.8 },
    { district_name: "Agimuga", total_dataset: 14, total_rows: 4100, avg_quality: 65.1 },
    { district_name: "Jila", total_dataset: 12, total_rows: 2800, avg_quality: 62.5 },
    { district_name: "Jita", total_dataset: 15, total_rows: 3200, avg_quality: 64.0 },
    { district_name: "Alama", total_dataset: 13, total_rows: 1800, avg_quality: 58.5 },
    { district_name: "Amar", total_dataset: 16, total_rows: 2100, avg_quality: 63.8 },
    { district_name: "Mimika Timur Jauh", total_dataset: 15, total_rows: 2900, avg_quality: 61.2 },
    { district_name: "Mimika Barat Jauh", total_dataset: 11, total_rows: 1500, avg_quality: 55.0 },
    { district_name: "Mimika Barat Tengah", total_dataset: 14, total_rows: 2200, avg_quality: 60.5 },
    { district_name: "Hoya", total_dataset: 8, total_rows: 900, avg_quality: 52.3 }
];

export const MOCK_INDICATOR_DETAILS: Record<string, AtlasIndicatorResponse> = {
    "stunting_rate": {
        indicator: "stunting_rate",
        metadata: {
            title: "Prevalensi Stunting per Distrik",
            unit: "% (Persentase)",
            description: "Persentase balita (0-59 bulan) yang mengalami gagal tumbuh akibat akumulasi ketidakcukupan zat gizi. Di Mimika, distrik pesisir dan pegunungan menunjukkan angka yang mengkhawatirkan.",
            color_scheme: "Reds",
            source: "Dinas Kesehatan Kab. Mimika & SSGI 2025"
        },
        data: {
            "mimikabaru": 12.4,
            "kualakencana": 6.2,
            "tembagapura": 4.5,
            "wania": 16.9,
            "kwamkinarama": 18.5,
            "iwaka": 21.1,
            "mimikatimur": 24.8,
            "mimikatengah": 27.5,
            "mimikabarat": 29.1,
            "agimuga": 35.5,
            "jila": 38.2,
            "jita": 34.4,
            "alama": 41.5,
            "amar": 32.8,
            "mimikatimurjauh": 31.5,
            "mimikabaratjauh": 36.8,
            "mimikabarattengah": 33.2,
            "hoya": 40.1
        }
    },
    "indeks_kemiskinan": {
        indicator: "indeks_kemiskinan",
        metadata: {
            title: "Tingkat Kemiskinan Ekstrem",
            unit: "% dari Populasi",
            description: "Penduduk yang pengeluarannya berada di bawah garis kemiskinan ekstrem menurut standar BPS.",
            color_scheme: "Oranges",
            source: "BAPPEDA Mimika & Susenas 2025"
        },
        data: {
            "mimikabaru": 8.5,
            "kualakencana": 2.1,
            "tembagapura": 1.5,
            "wania": 14.2,
            "kwamkinarama": 19.8,
            "mimikatimur": 25.4,
            "mimikatengah": 31.0,
            "agimuga": 42.5,
            "alama": 48.0,
            "jila": 45.2,
            "amar": 36.5,
            "mimikabarat": 33.5,
            "jita": 35.8,
            "mimikatimurjauh": 32.1,
            "mimikabaratjauh": 44.5,
            "mimikabarattengah": 38.4,
            "hoya": 46.2
        }
    },
    "akses_air_bersih": {
        indicator: "akses_air_bersih",
        metadata: {
            title: "Cakupan Air Minum Layak",
            unit: "% Rumah Tangga",
            description: "Proporsi rumah tangga yang memiliki akses terhadap sumber air minum layak dan aman.",
            color_scheme: "Blues",
            source: "Dinas PUPR Kabupaten Mimika"
        },
        data: {
            "mimikabaru": 88.5,
            "kualakencana": 99.8,
            "tembagapura": 98.5,
            "wania": 72.4,
            "kwamkinarama": 65.0,
            "iwaka": 58.2,
            "mimikatimur": 45.5,
            "mimikatengah": 38.0,
            "agimuga": 22.5,
            "alama": 15.0,
            "jila": 18.5,
            "mimikabarat": 25.4,
            "jita": 28.2,
            "amar": 26.5,
            "mimikatimurjauh": 31.0,
            "mimikabaratjauh": 19.5,
            "mimikabarattengah": 24.8,
            "hoya": 16.5
        }
    }
};

// Konstanta legacy MOCK_ATLAS_CATEGORIES dihapus dan direpresentasikan lewat MOCK_POLYGON_LAYERS dan MOCK_OPDS.