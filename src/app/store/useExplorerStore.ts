// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

interface ExplorerState {
    // ==========================================
    // 1. STATE: Manajemen Panel (UI Layout)
    // ==========================================
    activePanels: ExplorerPanel[];

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
     * Membuka panel baru. 
     * Jika panel dengan tipe yang sama sudah ada, maka akan di-update datanya.
     * Jika belum ada, akan ditambahkan ke tumpukan (stack) paling kanan.
     */
    openPanel: (type: ExplorerPanelType, title: string, data?: any) => void;

    /**
     * Menutup panel berdasarkan ID uniknya.
     */
    closePanel: (id: string) => void;

    /**
     * Menutup seluruh panel dan mereset explorer ke keadaan awal.
     */
    clearPanels: () => void;

    /**
     * Logika khusus GFW: Jika panel di "level" tertentu diklik, 
     * tutup semua panel yang ada di sebelah kanannya.
     */
    closePanelsToTheRight: (index: number) => void;

    // ==========================================
    // ACTIONS: Konteks Eksplorasi
    // ==========================================
    /**
     * Mengatur indikator aktif untuk memicu perubahan data Choropleth di peta.
     */
    setActiveIndicator: (indicatorKey: string | null) => void;

    /**
     * Mengatur transparansi poligon (layer data) di atas peta.
     */
    setMapOpacity: (opacity: number) => void;

    /**
     * Mengubah tile layer dasar peta.
     */
    setActiveBaseMap: (baseMapId: string) => void;

    /**
     * Me-reset eksplorasi peta ke kondisi awal (Blank Canvas).
     * Menghapus indikator aktif dan menutup panel detail wilayah.
     */
    resetMapData: () => void;
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set) => ({
            // Inisialisasi State Default
            activePanels: [],
            activeIndicator: null,
            mapOpacity: 70, // Default 70%
            activeBaseMap: "satellite", // Default basemap

            // Mutator: Konteks Eksplorasi
            setActiveIndicator: (indicatorKey) => set({ activeIndicator: indicatorKey }),
            setMapOpacity: (opacity) => set({ mapOpacity: opacity }),
            setActiveBaseMap: (baseMapId) => set({ activeBaseMap: baseMapId }),

            // Mutator: Reset Data Peta (Jalan Keluar Analisis)
            resetMapData: () =>
                set((state) => ({
                    activeIndicator: null, // Peta akan merespons ini dengan mengembalikan warna ke default
                    // Tutup panel detail wilayah jika sedang terbuka, biarkan panel kategori/layer tetap ada
                    activePanels: state.activePanels.filter((p) => p.type !== "district-detail"),
                })),

            // Mutator: Manajemen Panel
            openPanel: (type, title, data = null) =>
                set((state) => {
                    // Cari apakah panel dengan tipe yang sama sudah terbuka
                    const existingIndex = state.activePanels.findIndex((p) => p.type === type);

                    if (existingIndex !== -1) {
                        // Jika sudah ada, update datanya tapi jangan duplikasi di stack
                        const updatedPanels = [...state.activePanels];
                        updatedPanels[existingIndex] = {
                            ...updatedPanels[existingIndex],
                            title,
                            data,
                            isVisible: true,
                        };
                        return { activePanels: updatedPanels };
                    }

                    // Jika panel baru, buat objek panel baru
                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`, // Unique ID untuk list rendering
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    return { activePanels: [...state.activePanels, newPanel] };
                }),

            closePanel: (id) =>
                set((state) => ({
                    activePanels: state.activePanels.filter((p) => p.id !== id),
                })),

            closePanelsToTheRight: (index) =>
                set((state) => ({
                    activePanels: state.activePanels.slice(0, index + 1),
                })),

            clearPanels: () => set({ activePanels: [] }),
        }),
        { name: "ExplorerStore" }
    )
);