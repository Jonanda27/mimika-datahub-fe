// src/app/lib/dummyAtlasData.ts

export interface AtlasHistoryData {
    year: number;
    value: number;
}

export interface AtlasIndicatorContent {
    metadata: {
        title: string;
        unit: string;
        description: string;
        color_scheme: "Reds" | "Blues" | "Greens" | "Oranges" | "Purples";
        category: string;
    };
    spatialData: Record<string, number>;
    trendData: AtlasHistoryData[]; // Tren rata-rata Kabupaten
    districtHistory: Record<string, AtlasHistoryData[]>; // Tren detail per distrik
}

export const DUMMY_ATLAS_DATA: Record<string, AtlasIndicatorContent> = {
    stunting: {
        metadata: {
            title: "Prevalensi Stunting Balita",
            unit: "%",
            description: "Persentase balita dengan tinggi badan di bawah standar pertumbuhan. Data mencerminkan efektivitas program intervensi gizi kronis di setiap distrik.",
            color_scheme: "Reds",
            category: "Kesehatan"
        },
        // Data Spasial Tahun Terbaru (2024)
        spatialData: {
            mimikabaru: 12.4, kualakencana: 9.1, tembagapura: 6.5, wania: 14.8,
            iwaka: 19.2, kwamkinarama: 15.5, mimikatimur: 22.4, mimikatengah: 24.1,
            mimikabarat: 28.3, agimuga: 32.5, jila: 38.2, jita: 35.0,
            mimikatimurjauh: 29.8, mimikabaratjauh: 31.4, mimikabarattengah: 27.5,
            amar: 26.8, hoya: 41.2, alama: 44.5
        },
        // Tren Rata-rata Kabupaten Mimika
        trendData: [
            { year: 2020, value: 28.5 },
            { year: 2021, value: 26.2 },
            { year: 2022, value: 23.8 },
            { year: 2023, value: 21.1 },
            { year: 2024, value: 18.4 }
        ],
        // Contoh Histori Per Distrik untuk Line Chart detail
        districtHistory: {
            mimikabaru: [
                { year: 2020, value: 18.2 }, { year: 2021, value: 16.5 }, { year: 2022, value: 15.1 }, { year: 2023, value: 13.8 }, { year: 2024, value: 12.4 }
            ],
            alama: [
                { year: 2020, value: 52.1 }, { year: 2021, value: 49.8 }, { year: 2022, value: 48.5 }, { year: 2023, value: 46.2 }, { year: 2024, value: 44.5 }
            ]
        }
    },
    pdrb: {
        metadata: {
            title: "PDRB Per Kapita",
            unit: "Juta",
            description: "Produk Domestik Regional Bruto per kapita mencerminkan tingkat produktivitas ekonomi dan kesejahteraan materiil penduduk di suatu wilayah.",
            color_scheme: "Greens",
            category: "Ekonomi"
        },
        spatialData: {
            mimikabaru: 85.2, kualakencana: 142.5, tembagapura: 620.8, wania: 42.1,
            iwaka: 31.5, kwamkinarama: 38.4, mimikatimur: 28.2, mimikatengah: 25.1,
            mimikabarat: 18.4, agimuga: 14.2, jila: 9.8, jita: 11.2,
            mimikatimurjauh: 12.5, mimikabaratjauh: 15.2, mimikabarattengah: 14.8,
            amar: 13.2, hoya: 8.5, alama: 7.2
        },
        trendData: [
            { year: 2020, value: 112.4 },
            { year: 2021, value: 118.5 },
            { year: 2022, value: 125.2 },
            { year: 2023, value: 132.8 },
            { year: 2024, value: 141.5 }
        ],
        districtHistory: {
            tembagapura: [
                { year: 2020, value: 580.1 }, { year: 2021, value: 592.4 }, { year: 2022, value: 605.2 }, { year: 2023, value: 612.8 }, { year: 2024, value: 620.8 }
            ]
        }
    },
    akses_air: {
        metadata: {
            title: "Akses Air Bersih Layak",
            unit: "%",
            description: "Persentase rumah tangga yang memiliki akses terhadap sumber air minum terlindungi dan layak konsumsi.",
            color_scheme: "Blues",
            category: "Infrastruktur"
        },
        spatialData: {
            mimikabaru: 92.5, kualakencana: 98.2, tembagapura: 96.4, wania: 85.1,
            iwaka: 72.4, kwamkinarama: 78.2, mimikatimur: 62.5, mimikatengah: 58.4,
            mimikabarat: 52.1, agimuga: 42.5, jila: 31.2, jita: 35.8,
            mimikatimurjauh: 38.4, mimikabaratjauh: 41.2, mimikabarattengah: 44.5,
            amar: 39.8, hoya: 25.4, alama: 22.1
        },
        trendData: [
            { year: 2020, value: 55.2 },
            { year: 2021, value: 58.4 },
            { year: 2022, value: 62.1 },
            { year: 2023, value: 66.5 },
            { year: 2024, value: 71.2 }
        ],
        districtHistory: {}
    },
    ipm: {
        metadata: {
            title: "Indeks Pembangunan Manusia",
            unit: "Poin",
            description: "Mengukur capaian pembangunan manusia berbasis komponen kesehatan, pendidikan, dan standar hidup layak.",
            color_scheme: "Purples",
            category: "Sosial"
        },
        spatialData: {
            mimikabaru: 74.2, kualakencana: 78.5, tembagapura: 82.1, wania: 68.4,
            iwaka: 62.1, kwamkinarama: 65.4, mimikatimur: 61.2, mimikatengah: 59.8,
            mimikabarat: 58.2, agimuga: 54.1, jila: 51.5, jita: 52.4,
            mimikatimurjauh: 53.8, mimikabaratjauh: 55.2, mimikabarattengah: 56.4,
            amar: 54.8, hoya: 48.5, alama: 46.2
        },
        trendData: [
            { year: 2020, value: 60.1 },
            { year: 2021, value: 61.5 },
            { year: 2022, value: 62.8 },
            { year: 2023, value: 63.5 },
            { year: 2024, value: 64.2 }
        ],
        districtHistory: {}
    }
};