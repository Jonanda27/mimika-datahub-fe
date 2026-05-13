// src/app/store/useAtlasStore.ts
import { create } from 'zustand';
import { AtlasMetadata, AtlasSpatialData, AtlasVisualMode } from '../types/atlas';

// ==========================================
// DATA STATIS (MOCKUP) UNTUK TESTING UI/UX
// Anda bisa mengubah angka dan warna di sini seenaknya!
// ==========================================
const DUMMY_ATLAS_DATA: Record<string, { metadata: AtlasMetadata; data: AtlasSpatialData }> = {
    "jumlah_penduduk": {
        metadata: {
            title: "Distribusi Penduduk 2024",
            unit: "Jiwa",
            description: "Konsentrasi populasi tertinggi berada di area urban dan lingkar tambang.",
            color_scheme: "Blues"
        },
        data: {
            "mimikabaru": 142000, "kualakencana": 35000, "wania": 28000, "tembagapura": 22000,
            "mimikatimur": 15000, "agimuga": 4000, "jila": 3000, "jita": 2500,
            "mimikatengah": 12000, "mimikabarat": 8000, "mimikatimurjauh": 4500,
            "mimikabaratjauh": 3200, "mimikabarattengah": 2100, "amar": 1800,
            "hoya": 1200, "alama": 900, "kwamkinarama": 11000, "iwaka": 6000
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
            "mimikatimur": 22.1, "agimuga": 35.5, "jila": 41.2, "jita": 38.0,
            "mimikatengah": 20.1, "mimikabarat": 25.0, "mimikatimurjauh": 30.5,
            "mimikabaratjauh": 28.4, "mimikabarattengah": 33.1, "amar": 27.8,
            "hoya": 45.0, "alama": 42.1, "kwamkinarama": 15.0, "iwaka": 19.5
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
            "mimikatimur": 1100, "agimuga": 150, "jila": 80, "jita": 95,
            "mimikatengah": 850, "mimikabarat": 600, "mimikatimurjauh": 200,
            "mimikabaratjauh": 180, "mimikabarattengah": 120, "amar": 110,
            "hoya": 50, "alama": 45, "kwamkinarama": 2100, "iwaka": 900
        }
    }
};

interface AtlasState {
    activeTheme: string;
    activeIndicator: string;
    visualType: AtlasVisualMode;
    metadata: AtlasMetadata | null;
    spatialData: AtlasSpatialData | null;
    isLoading: boolean;
    error: string | null;

    setActiveTheme: (theme: string, visualMode: AtlasVisualMode) => void;
    fetchAtlasData: (indicatorKey: string) => Promise<void>;
    resetAtlas: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
    activeTheme: "pembukaan",
    activeIndicator: "",
    visualType: "map",
    metadata: null,
    spatialData: null,
    isLoading: false,
    error: null,

    setActiveTheme: (theme: string, visualMode: AtlasVisualMode) => {
        if (get().activeTheme !== theme || get().visualType !== visualMode) {
            set({ activeTheme: theme, visualType: visualMode });
        }
    },

    fetchAtlasData: async (indicatorKey: string) => {
        const currentState = get();

        // Hindari eksekusi ulang jika datanya sudah ada
        if (indicatorKey === currentState.activeIndicator && currentState.spatialData) {
            return;
        }

        set({ isLoading: true, error: null, activeIndicator: indicatorKey });

        try {
            // Simulasi delay jaringan agar transisi loading UI terasa natural (800ms)
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = DUMMY_ATLAS_DATA[indicatorKey];

            if (!response) {
                throw new Error(`Data statis untuk indikator [${indicatorKey}] tidak ditemukan.`);
            }

            set({
                spatialData: response.data,
                metadata: response.metadata,
                isLoading: false
            });
        } catch (err: any) {
            set({
                error: err.message || "Gagal memuat data atlas statis.",
                isLoading: false,
                spatialData: null,
                metadata: null
            });
        }
    },

    resetAtlas: () => {
        set({
            activeTheme: "pembukaan",
            activeIndicator: "",
            visualType: "map",
            metadata: null,
            spatialData: null,
            error: null,
            isLoading: false
        });
    }
}));