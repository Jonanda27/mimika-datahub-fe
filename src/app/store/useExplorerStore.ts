// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

export type DetailTabType = "umum" | "analisis";

interface ExplorerState {
    // ==========================================
    // 1. STATE: Manajemen Panel (UI Layout)
    // ==========================================
    activePanels: ExplorerPanel[];
    activeDetailTab: DetailTabType; // Manajemen state untuk tab panel detail

    // ==========================================
    // 2. STATE: Konteks Eksplorasi Spasial
    // ==========================================
    activeIndicator: string | null;
    activeAssetLayers: string[]; // <--- MULTI-SELECTION STATE (Format: "opdKey::assetType")
    mapOpacity: number;
    activeBaseMap: string;

    // [REFACTOR] FASE 2: Controller State untuk Peta
    // Berisi nama distrik yang sedang di-highlight dari Sidebar
    focusedDistrict: string | null;

    // ==========================================
    // ACTIONS: Manajemen Panel
    // ==========================================
    openPanel: (type: ExplorerPanelType, title: string, data?: any) => void;
    closePanel: (id: string) => void;
    clearPanels: () => void;
    closePanelsToTheRight: (index: number) => void;
    setActiveDetailTab: (tab: DetailTabType) => void;

    // ==========================================
    // ACTIONS: Konteks Eksplorasi Spasial
    // ==========================================
    setActiveIndicator: (indicatorKey: string | null) => void;
    toggleAssetLayer: (opdKey: string, assetType: string) => void;
    toggleOpdAssets: (opdKey: string, assetTypes: string[], isTurnOn: boolean) => void;
    setMapOpacity: (opacity: number) => void;
    setActiveBaseMap: (baseMapId: string) => void;

    // [REFACTOR] FASE 2: Mutator Controller Distrik
    setFocusDistrict: (districtName: string | null) => void;

    resetMapData: () => void;
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set) => ({
            // Inisialisasi State Default
            activePanels: [],
            activeDetailTab: "umum",
            activeIndicator: null,
            activeAssetLayers: [],
            mapOpacity: 70,
            activeBaseMap: "satellite",
            focusedDistrict: null, // Default null (Tampilan seluruh Mimika)

            // Mutator: Konteks Eksplorasi
            setActiveIndicator: (indicatorKey) => set({ activeIndicator: indicatorKey }),

            toggleAssetLayer: (opdKey, assetType) => set((state) => {
                const layerId = `${opdKey}::${assetType}`;
                const isExists = state.activeAssetLayers.includes(layerId);
                return {
                    activeAssetLayers: isExists
                        ? state.activeAssetLayers.filter(id => id !== layerId)
                        : [...state.activeAssetLayers, layerId]
                };
            }),

            toggleOpdAssets: (opdKey, assetTypes, isTurnOn) => set((state) => {
                const layerIds = assetTypes.map(type => `${opdKey}::${type}`);
                if (isTurnOn) {
                    const newSet = new Set([...state.activeAssetLayers, ...layerIds]);
                    return { activeAssetLayers: Array.from(newSet) };
                } else {
                    return { activeAssetLayers: state.activeAssetLayers.filter(id => !layerIds.includes(id)) };
                }
            }),

            setMapOpacity: (opacity) => set({ mapOpacity: opacity }),
            setActiveBaseMap: (baseMapId) => set({ activeBaseMap: baseMapId }),

            // [REFACTOR] FASE 2: Mutator untuk state highlight distrik
            setFocusDistrict: (districtName) => set({ focusedDistrict: districtName }),

            // Mutator: Manajemen Panel Tab Detail
            setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

            // Mutator: Reset Data Peta (Jalan Keluar Analisis)
            // MEMASTIKAN FOCUSED DISTRICT IKUT TERESET KE NULL
            resetMapData: () =>
                set((state) => ({
                    activeIndicator: null,
                    activeAssetLayers: [],
                    focusedDistrict: null,
                    activePanels: state.activePanels.filter((p) => p.type !== "detil-distrik" && p.type !== "detil-aset"),
                    activeDetailTab: "umum",
                })),

            // ======================================================================
            // [REFACTOR] LOGIKA MUTUALLY EXCLUSIVE (CLEAN IMMUTABLE APPROACH)
            // ======================================================================
            openPanel: (type, title, data = null) =>
                set((state) => {
                    const isDetailPanel = type === "detil-distrik" || type === "detil-aset";

                    // 1. Bersihkan array panel yang ada (Filtering)
                    let nextPanels = [...state.activePanels];

                    if (isDetailPanel) {
                        // Aturan Singleton: Jika yang mau dibuka adalah Panel Detail (Aset/Distrik), 
                        // hapus SEMUA panel detail lama yang sedang melayang di layar.
                        nextPanels = nextPanels.filter(p => p.type !== "detil-distrik" && p.type !== "detil-aset");
                    } else {
                        // Untuk panel biasa (Menu), hapus panel dengan tipe yang sama agar tidak duplikat
                        nextPanels = nextPanels.filter(p => p.type !== type);
                    }

                    // 2. Buat panel baru dengan ID unik (Mencegah React Key Conflict)
                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    // 3. Tambahkan ke tumpukan paling atas (stack)
                    nextPanels.push(newPanel);

                    // 4. Pastikan tab kembali ke 'umum' khusus jika yang dibuka adalah profil distrik
                    const resetTabObj = type === "detil-distrik" ? { activeDetailTab: "umum" as DetailTabType } : {};

                    return { activePanels: nextPanels, ...resetTabObj };
                }),

            closePanel: (id) =>
                set((state) => {
                    const filteredPanels = state.activePanels.filter((p) => p.id !== id);
                    const isDetailClosed = !filteredPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: filteredPanels,
                        // Jika panel detail ditutup, paksa hapus juga fokus distrik di peta
                        // Ini menjaga UX konsisten. Tidak ada panel = Tidak ada highlight wilayah.
                        ...(isDetailClosed && {
                            activeDetailTab: "umum",
                            focusedDistrict: null
                        })
                    };
                }),

            closePanelsToTheRight: (index) =>
                set((state) => {
                    const slicedPanels = state.activePanels.slice(0, index + 1);
                    const isDetailStillOpen = slicedPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: slicedPanels,
                        // Jika panel detail tertutup karena aksi ini, bersihkan state kamera/fokus
                        ...(!isDetailStillOpen && {
                            activeDetailTab: "umum",
                            focusedDistrict: null
                        })
                    };
                }),

            clearPanels: () => set({
                activePanels: [],
                activeDetailTab: "umum",
                focusedDistrict: null
            }),
        }),
        { name: "ExplorerStore" }
    )
);