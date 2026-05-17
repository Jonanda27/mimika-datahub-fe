// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

export type DetailTabType = "umum" | "analisis";

interface ExplorerState {
    // ==========================================
    // 1. STATE: Manajemen Panel (UI Layout Terpisah)
    // ==========================================
    activeDrawer: ExplorerPanel | null; // Entitas 1: Laci kiri yang menempel (Sektor, Layer, Search)
    activeDetail: ExplorerPanel | null; // Entitas 2: Panel informasi floating di kanan (Profil Distrik)
    activeDetailTab: DetailTabType;     // Manajemen state untuk tab pada panel detail

    // ==========================================
    // 2. STATE: Konteks Eksplorasi Spasial (Reaktivitas Peta)
    // ==========================================
    activeIndicator: string | null; // ID metrik yang sedang dianalisis (misal: "stunting_rate")
    mapOpacity: number;             // Tingkat transparansi poligon peta (0 - 100)
    activeBaseMap: string;          // Jenis basemap yang aktif ("satellite", "dark", "street")

    // ==========================================
    // ACTIONS: Manajemen Panel
    // ==========================================
    /**
     * Membuka panel dengan logika perutean (Routing Logic) berdasarkan tipe.
     * Tipe 'detil-distrik' akan diarahkan ke kanan, sisanya ke laci kiri.
     */
    openPanel: (type: ExplorerPanelType, title: string, data?: any) => void;

    /**
     * Menutup panel berdasarkan ID uniknya.
     */
    closePanel: (id: string) => void;

    /**
     * Menutup seluruh panel dan mereset layout ke keadaan awal.
     */
    clearPanels: () => void;

    /**
     * Fungsi legacy (GFW stacking). Dipertahankan sementara untuk backward compatibility 
     * sebelum komponen Orchestrator diperbarui. Akan mereset panel sekunder.
     */
    closePanelsToTheRight: (index: number) => void;

    /**
     * Mengatur tab yang sedang aktif pada panel detail wilayah.
     */
    setActiveDetailTab: (tab: DetailTabType) => void;

    // ==========================================
    // ACTIONS: Konteks Eksplorasi
    // ==========================================
    setActiveIndicator: (indicatorKey: string | null) => void;
    setMapOpacity: (opacity: number) => void;
    setActiveBaseMap: (baseMapId: string) => void;

    /**
     * Me-reset eksplorasi peta ke kondisi awal (Blank Canvas).
     * Menghapus indikator aktif dan menutup HANYA panel detail wilayah, 
     * laci kontrol kiri dibiarkan tetap seperti semula.
     */
    resetMapData: () => void;
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set) => ({
            // Inisialisasi State Default
            activeDrawer: null,
            activeDetail: null,
            activeDetailTab: "umum",
            activeIndicator: null,
            mapOpacity: 70,
            activeBaseMap: "satellite",

            // Mutator: Konteks Eksplorasi
            setActiveIndicator: (indicatorKey) => set({ activeIndicator: indicatorKey }),
            setMapOpacity: (opacity) => set({ mapOpacity: opacity }),
            setActiveBaseMap: (baseMapId) => set({ activeBaseMap: baseMapId }),

            // Mutator: Manajemen Panel Tab Detail
            setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

            // Mutator: Reset Data Peta (Jalan Keluar Analisis)
            resetMapData: () =>
                set((state) => ({
                    activeIndicator: null,
                    activeDetail: null, // Hanya mematikan detail konteks wilayah
                    activeDetailTab: "umum", // Kembalikan ke tab dasar
                })),

            // Mutator: Manajemen Panel (Delegation Logic)
            openPanel: (type, title, data = null) =>
                set((state) => {
                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    // Delegasi objek: Pisahkan mana yang masuk drawer, mana yang masuk detail
                    if (type === "detil-distrik") {
                        return {
                            activeDetail: newPanel,
                            activeDetailTab: "umum" // Auto-reset tab ke informasi umum saat wilayah baru dipilih
                        };
                    } else {
                        // Jika panel drawer yang sama diklik lagi (toggle), tutup laci kontrol
                        if (state.activeDrawer?.type === type) {
                            return { activeDrawer: null };
                        }
                        // Ganti isi laci kiri
                        return { activeDrawer: newPanel };
                    }
                }),

            closePanel: (id) =>
                set((state) => {
                    const isDrawer = state.activeDrawer?.id === id;
                    const isDetail = state.activeDetail?.id === id;

                    return {
                        ...(isDrawer && { activeDrawer: null }),
                        ...(isDetail && { activeDetail: null, activeDetailTab: "umum" })
                    };
                }),

            closePanelsToTheRight: (index) =>
                set((state) => {
                    // Penyesuaian backward-compatible untuk menangani interaksi tumpukan legacy
                    if (index === -1) {
                        return { activeDrawer: null, activeDetail: null, activeDetailTab: "umum" };
                    }
                    return { activeDetail: null, activeDetailTab: "umum" };
                }),

            clearPanels: () => set({
                activeDrawer: null,
                activeDetail: null,
                activeDetailTab: "umum"
            }),
        }),
        { name: "ExplorerStore" }
    )
);