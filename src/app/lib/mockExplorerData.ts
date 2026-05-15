// src/app/lib/mockExplorerData.ts

import {
    DistrictDrilldownResponse,
    SpatialStatResponse
} from "../types/gis";
import {
    AtlasCategoryGroup,
    AtlasIndicatorResponse
} from "../types/atlas";

/**
 * MOCK DATA: DRILLDOWN DISTRIK
 * Data profil mendalam untuk 18 Distrik di Mimika.
 * Patuh pada Interface: DistrictDrilldownResponse
 */
export const MOCK_DISTRICT_DRILLDOWN: Record<number, DistrictDrilldownResponse> = {
    1: {
        district_id: 1,
        district_name: "Mimika Baru",
        profile: {
            id: 1,
            luas_wilayah: 2216,
            jumlah_penduduk: 142000,
            deskripsi: "Distrik Mimika Baru adalah pusat administrasi dan ekonomi Kabupaten Mimika. Wilayah ini mencakup pusat kota Timika dengan tingkat pertumbuhan penduduk yang sangat pesat. Fokus pembangunan di sini meliputi digitalisasi layanan publik, pengelolaan drainase perkotaan, dan peningkatan kapasitas UMKM.",
            batas_wilayah: "Utara: Distrik Iwaka, Selatan: Distrik Wania, Timur: Distrik Mimika Timur, Barat: Distrik Kuala Kencana",
            kode_kemendagri: "91.09.01"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 42 },
            { category_id: 2, name: "Pendidikan", total: 35 },
            { category_id: 3, name: "Ekonomi", total: 68 },
            { category_id: 4, name: "Infrastruktur", total: 54 }
        ],
        last_updated: "2026-05-10T08:00:00Z"
    },
    2: {
        district_id: 2,
        district_name: "Kuala Kencana",
        profile: {
            id: 2,
            luas_wilayah: 811,
            jumlah_penduduk: 28000,
            deskripsi: "Kuala Kencana dikenal sebagai kota industri modern yang dikembangkan dengan standar internasional. Wilayah ini memiliki tata kota yang teratur dengan sistem kabel bawah tanah dan pengelolaan limbah mandiri. Merupakan area kunci penyokong operasional PT Freeport Indonesia.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Baru, Timur: Distrik Iwaka, Barat: Distrik Mimika Barat",
            kode_kemendagri: "91.09.11"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 12 },
            { category_id: 3, name: "Ekonomi", total: 25 },
            { category_id: 4, name: "Infrastruktur", total: 82 }
        ],
        last_updated: "2026-05-12T10:30:00Z"
    },
    3: {
        district_id: 3,
        district_name: "Tembagapura",
        profile: {
            id: 3,
            luas_wilayah: 2587,
            jumlah_penduduk: 16000,
            deskripsi: "Tembagapura adalah distrik dataran tinggi yang menjadi pusat penambangan emas dan tembaga. Kondisi geografis yang ekstrem menjadikan distrik ini memiliki karakteristik infrastruktur yang unik dan sistem logistik yang sangat terspesialisasi.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Kuala Kencana, Timur: Distrik Agimuga, Barat: Distrik Jila",
            kode_kemendagri: "91.09.04"
        },
        categories: [
            { category_id: 3, name: "Ekonomi", total: 110 },
            { category_id: 4, name: "Infrastruktur", total: 45 }
        ],
        last_updated: "2026-04-20T15:00:00Z"
    }
    // Tambahkan data distrik lainnya (Wania, Iwaka, dll) sesuai DISTRICT_MAP di MimikaMap
};

/**
 * MOCK DATA: STATISTIK SPASIAL (Choropleth)
 * Digunakan untuk mewarnai peta berdasarkan densitas data.
 * Patuh pada Interface: SpatialStatResponse[]
 */
export const MOCK_SPATIAL_STATS: SpatialStatResponse[] = [
    { district_name: "Mimika Baru", total_dataset: 209, total_rows: 154000, avg_quality: 92.5 },
    { district_name: "Kuala Kencana", total_dataset: 119, total_rows: 82000, avg_quality: 94.1 },
    { district_name: "Tembagapura", total_dataset: 155, total_rows: 210000, avg_quality: 96.8 },
    { district_name: "Wania", total_dataset: 88, total_rows: 45000, avg_quality: 85.0 },
    { district_name: "Mimika Timur", total_dataset: 62, total_rows: 12000, avg_quality: 78.4 },
    { district_name: "Agimuga", total_dataset: 25, total_rows: 5000, avg_quality: 72.1 },
    { district_name: "Jila", total_dataset: 18, total_rows: 3200, avg_quality: 68.5 }
];

/**
 * MOCK DATA: GRUP KATEGORI ATLAS
 * Daftar indikator yang tersedia di Sidebar Explorer.
 * Patuh pada Interface: AtlasCategoryGroup[]
 */
export const MOCK_ATLAS_CATEGORIES: AtlasCategoryGroup[] = [
    {
        category_id: 1,
        category_name: "Kesehatan",
        indicators: [
            { key: "stunting_rate", title: "Prevalensi Stunting", category_id: 1 },
            { key: "fasilitas_kesehatan", title: "Rasio Puskesmas per Penduduk", category_id: 1 },
            { key: "imunisasi_dasar", title: "Cakupan Imunisasi Dasar", category_id: 1 }
        ]
    },
    {
        category_id: 2,
        category_name: "Ekonomi",
        indicators: [
            { key: "pdrb_distrik", title: "PDRB Per Distrik", category_id: 2 },
            { key: "angka_pengangguran", title: "Tingkat Pengangguran Terbuka", category_id: 2 },
            { key: "pertumbuhan_ekonomi", title: "Laju Pertumbuhan Ekonomi", category_id: 2 }
        ]
    },
    {
        category_id: 3,
        category_name: "Sosial & Kependudukan",
        indicators: [
            { key: "indeks_kemiskinan", title: "Persentase Penduduk Miskin", category_id: 3 },
            { key: "kepadatan_penduduk", title: "Densitas Populasi", category_id: 3 }
        ]
    }
];

/**
 * MOCK DATA: DETAIL INDIKATOR (Hasil Agregasi)
 * Data nilai per wilayah yang akan dirender di Choropleth.
 * Patuh pada Interface: AtlasIndicatorResponse
 */
export const MOCK_INDICATOR_DETAILS: Record<string, AtlasIndicatorResponse> = {
    "stunting_rate": {
        indicator: "stunting_rate",
        metadata: {
            title: "Prevalensi Stunting per Distrik",
            unit: "%",
            description: "Persentase balita yang memiliki tinggi badan di bawah standar menurut umur (TB/U). Sumber: Dinas Kesehatan Mimika.",
            color_scheme: "Reds",
            source: "Dinas Kesehatan Kabupaten Mimika"
        },
        data: {
            "mimikabaru": 12.4,
            "kualakencana": 8.2,
            "tembagapura": 5.5,
            "wania": 18.9,
            "iwaka": 22.1,
            "agimuga": 28.5,
            "jila": 31.2,
            "jita": 29.4
        }
    },
    "pdrb_distrik": {
        indicator: "pdrb_distrik",
        metadata: {
            title: "PDRB Sektoral Per Distrik",
            unit: "Miliar Rupiah",
            description: "Nilai Produk Domestik Regional Bruto atas dasar harga berlaku. Sumber: BPS Mimika.",
            color_scheme: "Greens",
            source: "Badan Pusat Statistik (BPS)"
        },
        data: {
            "mimikabaru": 4500,
            "tembagapura": 125000,
            "kualakencana": 8500,
            "wania": 1200,
            "iwaka": 450
        }
    }
};