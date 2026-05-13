// src/app/lib/dummyAtlasData.ts

export const DUMMY_ATLAS_DATA: Record<string, any> = {
    "jumlah_penduduk": {
        metadata: {
            title: "Distribusi Penduduk 2024",
            unit: "Jiwa",
            description: "Konsentrasi populasi tertinggi berada di area urban dan lingkar tambang.",
            color_scheme: "Blues"
        },
        data: {
            "mimikabaru": 142000, "kualakencana": 35000, "wania": 28000, "tembagapura": 22000,
            "mimikatimur": 15000, "agimuga": 4000, "jila": 3000, "jita": 2500
        }
    },
    "stunting": {
        metadata: {
            title: "Darurat Gizi Anak",
            unit: "%",
            description: "Persentase balita stunting yang membutuhkan intervensi gizi segera.",
            color_scheme: "Reds"
        },
        data: {
            "mimikabaru": 12.5, "kualakencana": 8.0, "wania": 18.2, "tembagapura": 5.4,
            "mimikatimur": 22.1, "agimuga": 35.5, "jila": 41.2, "jita": 38.0
        }
    },
    "pdrb": {
        metadata: {
            title: "Kekuatan Ekonomi Daerah",
            unit: "Miliar Rp",
            description: "Kontribusi ekonomi setiap distrik terhadap Produk Domestik Regional Bruto.",
            color_scheme: "Greens"
        },
        data: {
            "mimikabaru": 8500, "kualakencana": 12000, "wania": 3200, "tembagapura": 45000,
            "mimikatimur": 1100, "agimuga": 150, "jila": 80, "jita": 95
        }
    }
};