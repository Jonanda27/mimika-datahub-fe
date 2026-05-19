// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

export type DetailTabType = "umum" | "analisis";

interface ExplorerState {
    // ==========================================
    // 1. STATE: Navigasi UI (GFW Paradigm)
    // ==========================================
    activePanels: ExplorerPanel[];
    activeDetailTab: DetailTabType; // Manajemen state untuk tab panel detail

    // State khusus untuk Accordion OPD di Sidebar. 
    // Menyimpan ID OPD yang sedang diekspansi menunya. Null = tidak ada yang terbuka.
    expandedOpdId: number | null;

    // ==========================================
    // 2. STATE: Spasial (Dual-Layering Map)
    // ==========================================

    // Layer Statistik (Poligon) - SIFAT: Mutlak Single-Selection
    // Menyimpan ID dari SpatialIndicator (contoh: "stunting_rate")
    activeChoropleth: string | null;

    // Layer Aset (Titik/Marker) - SIFAT: Kombinatorial Multi-Selection
    // Menyimpan array ID dari AssetLayer (contoh: ["asset_puskesmas", "asset_jembatan"])
    activeAssetLayers: string[];

    mapOpacity: number;             // Tingkat transparansi poligon peta (0 - 100)
    activeBaseMap: string;          // Jenis basemap yang aktif ("satellite", "dark", "street")

    // ==========================================
    // ACTIONS: Navigasi & UI
    // ==========================================
    openPanel: (type: ExplorerPanelType, title: string, data?: any) => void;
    closePanel: (id: string) => void;
    clearPanels: () => void;
    closePanelsToTheRight: (index: number) => void;
    setActiveDetailTab: (tab: DetailTabType) => void;

    // Mengontrol Accordion OPD di Sidebar. Menutup yang lama, membuka yang baru.
    setExpandedOpd: (opdId: number | null) => void;

    // ==========================================
    // ACTIONS: Spasial & Peta
    // ==========================================

    // Mutator Single-Selection: Menyalakan Poligon (mengganti yang lama jika ada)
    setChoroplethLayer: (indicatorId: string | null) => void;

    // Mutator Multi-Selection: Menyalakan/Mematikan Titik Aset (Push/Remove)
    toggleAssetLayer: (assetLayerId: string) => void;

    setMapOpacity: (opacity: number) => void;
    setActiveBaseMap: (baseMapId: string) => void;

    // Me-reset eksplorasi peta ke kondisi awal (Blank Canvas).
    // Mematikan semua poligon dan aset yang menyala, serta mereset UI.
    resetMapData: () => void;
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set, get) => ({
            // ------------------------------------------
            // INITIAL STATE
            // ------------------------------------------
            activePanels: [],
            activeDetailTab: "umum",
            expandedOpdId: null,

            activeChoropleth: null,
            activeAssetLayers: [],
            mapOpacity: 70,
            activeBaseMap: "satellite",

            // ------------------------------------------
            // MUTATORS: SPASIAL & PETA
            // ------------------------------------------

            // Logika Single-Selection (Replace)
            setChoroplethLayer: (indicatorId) => set({ activeChoropleth: indicatorId }),

            // Logika Multi-Selection (Toggle: Tambah jika belum ada, Hapus jika sudah ada)
            toggleAssetLayer: (assetLayerId) => {
                const currentLayers = get().activeAssetLayers;
                const isCurrentlyActive = currentLayers.includes(assetLayerId);

                if (isCurrentlyActive) {
                    // Hapus dari array
                    set({ activeAssetLayers: currentLayers.filter(id => id !== assetLayerId) });
                } else {
                    // Tambahkan ke array
                    set({ activeAssetLayers: [...currentLayers, assetLayerId] });
                }
            },

            setMapOpacity: (opacity) => set({ mapOpacity: opacity }),
            setActiveBaseMap: (baseMapId) => set({ activeBaseMap: baseMapId }),

            // Reset Peta (Membersihkan Z-Stacking)
            resetMapData: () =>
                set((state) => ({
                    activeChoropleth: null, // Matikan poligon
                    activeAssetLayers: [],  // Matikan semua aset
                    expandedOpdId: null,    // Tutup accordion OPD
                    // Tutup panel detail wilayah, biarkan panel OPD utama ('seleksi-opd') tetap ada
                    activePanels: state.activePanels.filter((p) => p.type !== "detil-distrik"),
                    activeDetailTab: "umum",
                })),

            // ------------------------------------------
            // MUTATORS: UI & NAVIGASI GFW
            // ------------------------------------------
            setExpandedOpd: (opdId) => set({ expandedOpdId: opdId }),

            setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

            openPanel: (type, title, data = null) =>
                set((state) => {
                    const existingIndex = state.activePanels.findIndex((p) => p.type === type);

                    if (existingIndex !== -1) {
                        const updatedPanels = [...state.activePanels];
                        updatedPanels[existingIndex] = {
                            ...updatedPanels[existingIndex],
                            title,
                            data,
                            isVisible: true,
                        };

                        const resetTabObj = type === "detil-distrik" ? { activeDetailTab: "umum" as DetailTabType } : {};
                        return { activePanels: updatedPanels, ...resetTabObj };
                    }

                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    const resetTabObj = type === "detil-distrik" ? { activeDetailTab: "umum" as DetailTabType } : {};
                    return { activePanels: [...state.activePanels, newPanel], ...resetTabObj };
                }),

            closePanel: (id) =>
                set((state) => {
                    const filteredPanels = state.activePanels.filter((p) => p.id !== id);
                    const isDetailClosed = !filteredPanels.some(p => p.type === "detil-distrik");

                    return {
                        activePanels: filteredPanels,
                        ...(isDetailClosed && { activeDetailTab: "umum" })
                    };
                }),

            closePanelsToTheRight: (index) =>
                set((state) => {
                    const slicedPanels = state.activePanels.slice(0, index + 1);
                    const isDetailStillOpen = slicedPanels.some(p => p.type === "detil-distrik");

                    return {
                        activePanels: slicedPanels,
                        ...(!isDetailStillOpen && { activeDetailTab: "umum" })
                    };
                }),

            clearPanels: () => set({
                activePanels: [],
                activeDetailTab: "umum",
                expandedOpdId: null // Reset juga UI accordion OPD jika panel dibersihkan
            }),
        }),
        { name: "ExplorerStore" }
    )
);