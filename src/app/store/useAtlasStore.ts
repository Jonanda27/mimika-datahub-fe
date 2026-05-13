// src/app/store/useAtlasStore.ts
import { create } from 'zustand';
import { DUMMY_ATLAS_DATA, AtlasIndicatorContent } from '../lib/dummyAtlasData';

interface AtlasState {
    // ==========================================
    // STATE DEFINITIONS (Interactive Dashboard Mode)
    // ==========================================
    activeIndicator: string;            // Key indikator yang aktif (misal: "stunting")
    currentData: AtlasIndicatorContent | null; // Seluruh paket data untuk indikator aktif
    isLoading: boolean;
    error: string | null;

    // ==========================================
    // ACTIONS / CONTROLLER LOGIC
    // ==========================================
    /**
     * Memperbarui indikator aktif saat user memilih dari Dropdown.
     */
    setActiveIndicator: (indicatorKey: string) => void;

    /**
     * Mengambil data statis dari dummy file berdasarkan indikator aktif.
     * Menggunakan async untuk mensimulasikan delay API nyata.
     */
    fetchAtlasData: (indicatorKey: string) => Promise<void>;

    /**
     * Reset state saat komponen di-unmount.
     */
    resetAtlas: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
    // Inisialisasi State Dasar (Default langsung menunjuk ke PDRB)
    activeIndicator: "pdrb",
    currentData: null,
    isLoading: false,
    error: null,

    setActiveIndicator: (indicatorKey: string) => {
        const currentState = get();
        // Hanya memicu fetch jika indikatornya benar-benar berubah
        if (currentState.activeIndicator !== indicatorKey) {
            set({ activeIndicator: indicatorKey });
            get().fetchAtlasData(indicatorKey);
        }
    },

    fetchAtlasData: async (indicatorKey: string) => {
        set({ isLoading: true, error: null });

        try {
            // Simulasi delay jaringan (600ms) agar transisi loading terasa natural
            await new Promise(resolve => setTimeout(resolve, 600));

            const response = DUMMY_ATLAS_DATA[indicatorKey];

            if (!response) {
                throw new Error(`Data statis untuk indikator [${indicatorKey}] tidak ditemukan.`);
            }

            set({
                currentData: response,
                isLoading: false
            });
        } catch (err: any) {
            set({
                error: err.message || "Gagal memuat data atlas statis.",
                isLoading: false,
                currentData: null
            });
        }
    },

    resetAtlas: () => {
        set({
            activeIndicator: "pdrb",
            currentData: null,
            error: null,
            isLoading: false
        });
    }
}));