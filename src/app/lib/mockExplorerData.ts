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
 * MOCK DATA: DRILLDOWN DISTRIK (18 Distrik Kabupaten Mimika)
 * Menggambarkan realitas demografi, geografis, dan ketimpangan pembangunan.
 */
export const MOCK_DISTRICT_DRILLDOWN: Record<number, DistrictDrilldownResponse> = {
    1: {
        district_id: 1,
        district_name: "Mimika Baru",
        profile: {
            id: 1,
            luas_wilayah: 2216.00,
            jumlah_penduduk: 142519,
            deskripsi: "Distrik Mimika Baru adalah pusat administrasi pemerintahan dan episentrum ekonomi utama Kabupaten Mimika. Menjadi wilayah dengan kepadatan tertinggi, distrik ini menghadapi tantangan urbanisasi cepat, manajemen tata ruang kota Timika, serta pemenuhan akses layanan kesehatan dan pendidikan yang memadai bagi masyarakat urban yang heterogen.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Wania, Timur: Distrik Mimika Timur, Barat: Distrik Iwaka",
            kode_kemendagri: "91.09.01"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 45 },
            { category_id: 2, name: "Pendidikan", total: 60 },
            { category_id: 3, name: "Ekonomi", total: 85 },
            { category_id: 4, name: "Infrastruktur", total: 72 },
            { category_id: 5, name: "Sosial & Budaya", total: 34 }
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
            deskripsi: "Dibangun khusus oleh PT Freeport Indonesia, Kuala Kencana merupakan kota industri modern pertama di Indonesia dengan utilitas (listrik, komunikasi) tertanam di bawah tanah dan sistem pengolahan limbah berstandar internasional. Merupakan wilayah penyokong logistik dan administrasi operasional pertambangan dengan indeks kualitas hidup tertinggi di Mimika.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Baru, Timur: Distrik Kwamki Narama, Barat: Distrik Iwaka",
            kode_kemendagri: "91.09.11"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 18 },
            { category_id: 2, name: "Pendidikan", total: 22 },
            { category_id: 3, name: "Ekonomi", total: 45 },
            { category_id: 4, name: "Infrastruktur", total: 94 }
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
            deskripsi: "Tembagapura adalah distrik dataran tinggi yang menampung operasi tambang emas dan tembaga bawah tanah terbesar di dunia (Grasberg). Karena berada di area pegunungan bersuhu dingin ekstrem dengan topografi curam, akses ke wilayah ini sangat terbatas dan dikontrol ketat untuk kepentingan industri strategis nasional.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Kuala Kencana, Timur: Distrik Agimuga, Barat: Distrik Jila",
            kode_kemendagri: "91.09.04"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 15 },
            { category_id: 3, name: "Ekonomi", total: 156 }, // Aktivitas ekonomi tambang
            { category_id: 4, name: "Infrastruktur", total: 88 }
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
            deskripsi: "Distrik Wania merupakan daerah penyangga langsung Distrik Mimika Baru. Wilayah ini didominasi oleh pemukiman transmigran dan warga lokal yang bergerak di sektor pertanian skala kecil serta peternakan. Tantangan utama distrik ini adalah peningkatan infrastruktur jalan poros antar desa dan fasilitas kesehatan rujukan.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru, Timur: Distrik Mimika Timur, Barat: Distrik Mimika Tengah",
            kode_kemendagri: "91.09.12"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 22 },
            { category_id: 2, name: "Pendidikan", total: 18 },
            { category_id: 3, name: "Ekonomi", total: 35 },
            { category_id: 4, name: "Infrastruktur", total: 24 }
        ],
        last_updated: "2026-05-01T09:15:00Z"
    },
    5: {
        district_id: 5,
        district_name: "Iwaka",
        profile: {
            id: 5,
            luas_wilayah: 785.40,
            jumlah_penduduk: 11450,
            deskripsi: "Distrik Iwaka dikenal dengan potensi ekowisata alam dan hasil perkebunan kelapa sawit yang menjanjikan. Dengan dilaluinya jalur Jalan Trans Papua, distrik ini mulai berkembang pesat menjadi jalur distribusi komoditas pangan dari pedalaman menuju kota Timika.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Tengah, Timur: Distrik Kuala Kencana, Barat: Distrik Mimika Barat",
            kode_kemendagri: "91.09.13"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 10 },
            { category_id: 2, name: "Pendidikan", total: 12 },
            { category_id: 3, name: "Ekonomi", total: 28 },
            { category_id: 4, name: "Infrastruktur", total: 15 }
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
            deskripsi: "Kwamki Narama merupakan salah satu distrik terpadat yang memiliki histori panjang terkait konflik komunal di masa lalu. Kini, pemerintah daerah fokus pada pendekatan humanis melalui intervensi pembangunan sekolah vokasi, pasar tradisional, dan program pemberdayaan pemuda berbasis komunitas.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Mimika Baru, Timur: Distrik Mimika Timur, Barat: Distrik Wania",
            kode_kemendagri: "91.09.14"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 14 },
            { category_id: 2, name: "Pendidikan", total: 25 },
            { category_id: 3, name: "Ekonomi", total: 18 },
            { category_id: 5, name: "Sosial & Budaya", total: 42 } // Fokus rekonsiliasi sosial
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
            deskripsi: "Terletak di kawasan estuari dan muara sungai besar, Mimika Timur didominasi oleh suku Kamoro. Wilayah ini kaya akan potensi perikanan pesisir (kepiting karang, udang) dan hutan mangrove. Pelabuhan pendaratan ikan (PPI) Poumako menjadi nadi utama ekonomi kelautan di distrik ini.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru, Timur: Distrik Mimika Timur Jauh, Barat: Distrik Wania",
            kode_kemendagri: "91.09.02"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 8 },
            { category_id: 2, name: "Pendidikan", total: 10 },
            { category_id: 3, name: "Ekonomi", total: 45 }, // Perikanan
            { category_id: 4, name: "Infrastruktur", total: 12 }
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
            deskripsi: "Distrik Mimika Tengah sebagian besar wilayahnya merupakan hamparan dataran rendah rawa dan sungai. Transportasi air (ketinting/perahu motor) adalah satu-satunya moda transportasi yang menghubungkan kampung-kampung di wilayah ini menuju kota.",
            batas_wilayah: "Utara: Distrik Iwaka, Selatan: Laut Arafuru, Timur: Distrik Wania, Barat: Distrik Mimika Barat",
            kode_kemendagri: "91.09.10"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 5 },
            { category_id: 2, name: "Pendidikan", total: 8 },
            { category_id: 3, name: "Ekonomi", total: 15 },
            { category_id: 4, name: "Infrastruktur", total: 6 }
        ],
        last_updated: "2026-05-09T13:20:00Z"
    },
    10: {
        district_id: 10,
        district_name: "Agimuga",
        profile: {
            id: 10,
            luas_wilayah: 3120.45,
            jumlah_penduduk: 3150,
            deskripsi: "Agimuga adalah salah satu distrik terluas namun dengan kepadatan penduduk terendah di pedalaman pegunungan. Keterisolasian geografis membuat biaya hidup sangat tinggi, di mana pasokan barang hanya bisa mengandalkan pesawat perintis berbadan kecil (Cessna/Pilatus).",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Mimika Timur Jauh, Timur: Distrik Jita, Barat: Distrik Tembagapura",
            kode_kemendagri: "91.09.05"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 3 },
            { category_id: 2, name: "Pendidikan", total: 4 },
            { category_id: 3, name: "Ekonomi", total: 5 },
            { category_id: 4, name: "Infrastruktur", total: 2 } // Minim infrastruktur
        ],
        last_updated: "2026-05-05T07:15:00Z"
    },
    18: {
        district_id: 18,
        district_name: "Alama",
        profile: {
            id: 18,
            luas_wilayah: 1520.80,
            jumlah_penduduk: 1980,
            deskripsi: "Distrik paling terisolir di Kabupaten Mimika yang berada persis di sabuk Pegunungan Jayawijaya. Kondisi keamanan yang rentan dan ketiadaan jalan darat menjadikan pembangunan infrastruktur sipil sangat tersendat. Program pelayanan kesehatan berjalan ('Flying Doctor') menjadi andalan pemerintah.",
            batas_wilayah: "Utara: Kabupaten Nduga, Selatan: Distrik Agimuga, Timur: Kabupaten Asmat, Barat: Distrik Jila",
            kode_kemendagri: "91.09.18"
        },
        categories: [
            { category_id: 1, name: "Kesehatan", total: 2 },
            { category_id: 2, name: "Pendidikan", total: 3 },
            { category_id: 5, name: "Sosial & Budaya", total: 8 }
        ],
        last_updated: "2026-04-28T16:00:00Z"
    }
    // (Distrik 9, 11-17 direpresentasikan pada layer visual, 
    // mock ini menampilkan distrik perwakilan utama dari karakteristik pesisir, gunung, kota, dan industri)
};

/**
 * MOCK DATA: STATISTIK SPASIAL (Choropleth General Data Quality)
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
    { district_name: "Amar", total_dataset: 16, total_rows: 2100, avg_quality: 63.8 }
];

/**
 * MOCK DATA: GRUP KATEGORI ATLAS
 * Daftar indikator mendetail untuk di-render di Sidebar/Laci Explorer.
 */
export const MOCK_ATLAS_CATEGORIES: AtlasCategoryGroup[] = [
    {
        category_id: 1,
        category_name: "Kesehatan Publik",
        indicators: [
            { key: "stunting_rate", title: "Prevalensi Balita Stunting", category_id: 1 },
            { key: "kematian_ibu", title: "Angka Kematian Ibu (AKI)", category_id: 1 },
            { key: "imunisasi_dasar", title: "Cakupan Imunisasi Dasar Lengkap", category_id: 1 },
            { key: "fasilitas_kesehatan", title: "Aksesibilitas Puskesmas Pratama", category_id: 1 }
        ]
    },
    {
        category_id: 2,
        category_name: "Ekonomi & Investasi",
        indicators: [
            { key: "pdrb_distrik", title: "PDRB Atas Dasar Harga Berlaku", category_id: 2 },
            { key: "pengangguran_terbuka", title: "Tingkat Pengangguran Terbuka", category_id: 2 },
            { key: "rasio_umkm", title: "Rasio Pertumbuhan UMKM Aktif", category_id: 2 }
        ]
    },
    {
        category_id: 3,
        category_name: "Sosial & Kependudukan",
        indicators: [
            { key: "indeks_kemiskinan", title: "Garis Kemiskinan Ekstrem", category_id: 3 },
            { key: "kepadatan_penduduk", title: "Densitas Populasi (Jiwa/Km²)", category_id: 3 },
            { key: "indeks_pembangunan", title: "Indeks Pembangunan Manusia (IPM)", category_id: 3 }
        ]
    },
    {
        category_id: 4,
        category_name: "Infrastruktur & Lingkungan",
        indicators: [
            { key: "akses_air_bersih", title: "Akses Air Minum Layak", category_id: 4 },
            { key: "elektrifikasi_desa", title: "Rasio Elektrifikasi Kampung", category_id: 4 },
            { key: "jalan_aspal", title: "Konektivitas Jalan Aspal Tembus", category_id: 4 }
        ]
    }
];

/**
 * MOCK DATA: DETAIL INDIKATOR (Hasil Agregasi Numerik)
 * Nilai aktual untuk mewarnai Choropleth sesuai parameter.
 */
export const MOCK_INDICATOR_DETAILS: Record<string, AtlasIndicatorResponse> = {
    // 1. INDIKATOR STUNTING (Kesehatan) - Menunjukkan ketimpangan akses gizi
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
            "mimikabaru": 12.4, // Kota: Rendah
            "kualakencana": 6.2, // Industri: Sangat Rendah
            "tembagapura": 4.5,
            "wania": 16.9,
            "kwamkinarama": 18.5,
            "iwaka": 21.1,
            "mimikatimur": 24.8, // Pesisir: Tinggi
            "mimikatengah": 27.5,
            "mimikabarat": 29.1,
            "agimuga": 35.5, // Pegunungan Terisolir: Sangat Tinggi
            "jila": 38.2,
            "jita": 34.4,
            "alama": 41.5,
            "amar": 32.8
        }
    },
    // 2. INDIKATOR KEMISKINAN (Sosial)
    "indeks_kemiskinan": {
        indicator: "indeks_kemiskinan",
        metadata: {
            title: "Tingkat Kemiskinan Ekstrem",
            unit: "% dari Populasi",
            description: "Penduduk yang pengeluarannya berada di bawah garis kemiskinan ekstrem menurut standar BPS. Menunjukkan disparitas ekonomi antara ring 1 tambang dan wilayah pedalaman.",
            color_scheme: "Oranges",
            source: "BPS Kabupaten Mimika (Susenas 2025)"
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
            "amar": 36.5
        }
    },
    // 3. INDIKATOR AKSES AIR BERSIH (Infrastruktur)
    "akses_air_bersih": {
        indicator: "akses_air_bersih",
        metadata: {
            title: "Cakupan Air Minum Layak",
            unit: "% Rumah Tangga",
            description: "Proporsi rumah tangga yang memiliki akses terhadap sumber air minum layak dan aman. Data krusial untuk intervensi sanitasi dasar.",
            color_scheme: "Blues",
            source: "Dinas PUPR Kabupaten Mimika"
        },
        data: {
            "mimikabaru": 88.5, // Kota: Tinggi
            "kualakencana": 99.8, // Fasilitas Freeport: Sempurna
            "tembagapura": 98.5,
            "wania": 72.4,
            "kwamkinarama": 65.0,
            "iwaka": 58.2,
            "mimikatimur": 45.5, // Pesisir rawa: Akses sulit
            "mimikatengah": 38.0,
            "agimuga": 22.5, // Pegunungan: Mengandalkan air hujan/sungai
            "alama": 15.0,
            "jila": 18.5
        }
    },
    // 4. INDIKATOR PDRB (Ekonomi) - Anomali karena Freeport
    "pdrb_distrik": {
        indicator: "pdrb_distrik",
        metadata: {
            title: "PDRB Atas Dasar Harga Berlaku",
            unit: "Miliar Rupiah",
            description: "Nilai tambah bruto dari seluruh sektor ekonomi. Distrik Tembagapura menciptakan bias/anomali ekstrem karena menyumbang lebih dari 80% PDRB Kabupaten Mimika dari sektor pertambangan.",
            color_scheme: "Greens",
            source: "BPS Kabupaten Mimika"
        },
        data: {
            "mimikabaru": 12500, // Sektor jasa & perdagangan
            "kualakencana": 8800,
            "tembagapura": 145000, // ANOMALI EKSTREM: Pertambangan
            "wania": 3200,
            "iwaka": 1450,
            "kwamkinarama": 1800,
            "mimikatimur": 1100, // Perikanan
            "agimuga": 250, // Subsisten
            "alama": 180
        }
    }
};