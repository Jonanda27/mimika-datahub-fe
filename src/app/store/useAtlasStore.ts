// src/app/store/useAtlasStore.ts
import { create } from 'zustand';
import { atlasService } from '../services/atlas.service';
import { AtlasIndicatorResponse, AtlasMetadata } from '../types/atlas';

interface AtlasState {
    // --- State ---
    activeTheme: string;        // Bab/Section yang sedang aktif (misal: "kesehatan")
    activeIndicator: string;    // Key indikator yang sedang dipetakan (misal: "stunting")
    metadata: AtlasMetadata | null; // Info narasi (judul, unit, deskripsi)
    spatialData: Record<string, number> | null; // Data nilai per distrik {"mimikabaru": 12.5}
    isLoading: boolean;
    error: string | null;

    // --- Actions ---
    /**
     * Mengubah tema narasi yang sedang dibaca user.
     */
    setActiveTheme: (theme: string) => void;

    /**
     * Mengambil data spasial dan metadata dari backend berdasarkan indikator.
     * @param indicatorKey - Key kolom dari database
     */
    fetchAtlasData: (indicatorKey: string) => Promise<void>;

    /**
     * Reset state saat meninggalkan halaman atlas.
     */
    resetAtlas: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
    // Initial State
    activeTheme: "pembukaan",
    activeIndicator: "",
    metadata: null,
    spatialData: null,
    isLoading: false,
    error: null,

    setActiveTheme: (theme: string) => {
        set({ activeTheme: theme });
    },

    fetchAtlasData: async (indicatorKey: string) => {
        // Hindari fetch ulang jika indikator yang diminta sama dengan yang sedang aktif
        if (indicatorKey === get().activeIndicator && get().spatialData) return;

        set({ isLoading: true, error: null, activeIndicator: indicatorKey });

        try {
            const response: AtlasIndicatorResponse = await atlasService.fetchIndicatorData(indicatorKey);

            set({
                spatialData: response.data,
                metadata: response.metadata,
                isLoading: false
            });
        } catch (err: any) {
            set({
                error: err.message || "Gagal memuat data spasial atlas",
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
            metadata: null,
            spatialData: null,
            error: null,
            isLoading: false
        });
    }
}));