// src/app/lib/mocks/mockIndicators.ts
import { SpatialStatResponse } from "../../types/gis";
import { AtlasCategoryGroup, AtlasIndicatorResponse } from "../../types/atlas";

/**
 * MOCK DATA: STATISTIK SPASIAL (Choropleth General Data Quality)
 * Baseline data untuk pewarnaan peta dasar.
 */
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

/**
 * MOCK DATA: GRUP OPD ATLAS
 * Rumpun instansi untuk menu navigasi di Sidebar Explorer.
 */
export const MOCK_ATLAS_CATEGORIES: AtlasCategoryGroup[] = [
    {
        category_id: 1,
        category_name: "Rumpun Pelayanan Dasar",
        indicators: [
            { key: "dinas_kesehatan", title: "Dinas Kesehatan", category_id: 1 },
            { key: "dinas_pendidikan", title: "Dinas Pendidikan", category_id: 1 },
            { key: "dinas_sosial", title: "Dinas Sosial", category_id: 1 }
        ]
    },
    {
        category_id: 2,
        category_name: "Rumpun Infrastruktur & Wilayah",
        indicators: [
            { key: "dinas_pupr", title: "Dinas PUPR", category_id: 2 },
            { key: "bappeda", title: "BAPPEDA", category_id: 2 },
            { key: "dinas_perhubungan", title: "Dinas Perhubungan", category_id: 2 }
        ]
    },
    {
        category_id: 3,
        category_name: "Rumpun Ekonomi & Pariwisata",
        indicators: [
            { key: "dinas_koperasi", title: "Dinas Koperasi & UMKM", category_id: 3 },
            { key: "dinas_pertanian", title: "Dinas Pertanian", category_id: 3 },
            { key: "dinas_pariwisata", title: "Dinas Pariwisata", category_id: 3 }
        ]
    }
];

/**
 * MOCK DATA: DETAIL INDIKATOR OPD
 * Data persebaran kepadatan/jumlah data milik OPD untuk mewarnai Kanvas Spasial.
 * [FIXED] Telah dilengkapi properti 'min_value', 'max_value', dan 'direction' secara utuh [2, 3].
 */
export const MOCK_INDICATOR_DETAILS: Record<string, AtlasIndicatorResponse> = {
    "dinas_kesehatan": {
        indicator: "dinas_kesehatan",
        min_value: 7,  // [FIXED] [2]
        max_value: 85, // [FIXED] [2]
        metadata: {
            title: "Kepadatan Data Dinas Kesehatan",
            unit: "Total Dataset/Baris",
            description: "Intensitas distribusi publikasi dan pengumpulan data yang dilakukan oleh Dinas Kesehatan.",
            color_scheme: "Reds",
            direction: "positive", // [FIXED] [3]
            source: "Sistem DataHub Mimika"
        },
        data: {
            "mimikabaru": 85, "kualakencana": 60, "tembagapura": 45, "wania": 69, "kwamkinarama": 55, "iwaka": 42,
            "mimikatimur": 38, "mimikatengah": 27, "mimikabarat": 29, "agimuga": 15, "jila": 12, "jita": 14,
            "alama": 8, "amar": 18, "mimikatimurjauh": 21, "mimikabaratjauh": 11, "mimikabarattengah": 13, "hoya": 7
        }
    },
    "dinas_sosial": {
        indicator: "dinas_sosial",
        min_value: 14, // [FIXED] [2]
        max_value: 95, // [FIXED] [2]
        metadata: {
            title: "Kepadatan Data Dinas Sosial",
            unit: "Total Dataset/Baris",
            description: "Distribusi pelaporan program bantuan sosial dan pemberdayaan masyarakat.",
            color_scheme: "Oranges",
            direction: "positive", // [FIXED] [3]
            source: "Sistem DataHub Mimika"
        },
        data: {
            "mimikabaru": 95, "kualakencana": 21, "tembagapura": 15, "wania": 72, "kwamkinarama": 68, "mimikatimur": 54,
            "mimikatengah": 31, "agimuga": 22, "alama": 18, "jila": 25, "amar": 26, "mimikabarat": 23, "jita": 25,
            "mimikatimurjauh": 22, "mimikabaratjauh": 14, "mimikabarattengah": 18, "hoya": 16
        }
    },
    "dinas_pupr": {
        indicator: "dinas_pupr",
        min_value: 5,  // [FIXED] [2]
        max_value: 88, // [FIXED] [2]
        metadata: {
            title: "Kepadatan Data Dinas PUPR",
            unit: "Total Dataset/Baris",
            description: "Intensitas laporan proyek infrastruktur dan sanitasi.",
            color_scheme: "Blues",
            direction: "positive", // [FIXED] [3]
            source: "Sistem DataHub Mimika"
        },
        data: {
            "mimikabaru": 88, "kualakencana": 78, "tembagapura": 55, "wania": 42, "kwamkinarama": 35, "iwaka": 38,
            "mimikatimur": 25, "mimikatengah": 18, "agimuga": 12, "alama": 5, "jila": 8, "mimikabarat": 15, "jita": 12,
            "amar": 16, "mimikatimurjauh": 11, "mimikabaratjauh": 9, "mimikabarattengah": 14, "hoya": 6
        }
    },
    "bappeda": {
        indicator: "bappeda",
        min_value: 19,  // [FIXED] [2]
        max_value: 100, // [FIXED] [2]
        metadata: {
            title: "Kepadatan Data BAPPEDA",
            unit: "Total Dataset/Baris",
            description: "Data perencanaan strategis, musrenbang, dan evaluasi pembangunan.",
            color_scheme: "Greens",
            direction: "positive", // [FIXED] [3]
            source: "Sistem DataHub Mimika"
        },
        data: {
            "mimikabaru": 100, "kualakencana": 80, "tembagapura": 85, "wania": 65, "iwaka": 45, "kwamkinarama": 50,
            "mimikatimur": 40, "agimuga": 25, "alama": 18, "mimikabarat": 35, "jila": 21, "jita": 26, "amar": 27,
            "mimikatimurjauh": 28, "mimikabaratjauh": 22, "mimikabarattengah": 24, "hoya": 19
        }
    }
};