// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

export type DetailTabType = "umum" | "analisis";

// [REFACTOR] THEATER MODE: Payload untuk state galeri global
export interface GalleryPayload {
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title: string;
}

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

    // Controller State untuk Peta
    // Berisi nama distrik yang sedang di-highlight dari Sidebar
    focusedDistrict: string | null;

    // [REFACTOR] THEATER MODE: State untuk Cinematic Gallery Overlay
    galleryState: GalleryPayload | null;

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

    // Mutator Controller Distrik
    setFocusDistrict: (districtName: string | null) => void;

    // [REFACTOR] THEATER MODE: Actions
    openGallery: (images: string[], startIndex: number, title?: string) => void;
    closeGallery: () => void;
    setGalleryIndex: (index: number) => void;

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
            galleryState: null,    // Default null (Mode Teater mati)

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

            // Mutator untuk state highlight distrik
            setFocusDistrict: (districtName) => set({ focusedDistrict: districtName }),

            // ======================================================================
            // [REFACTOR] THEATER MODE MUTATORS
            // ======================================================================
            openGallery: (images, startIndex, title = "Visualisasi Data") =>
                set({
                    galleryState: {
                        isOpen: true,
                        images,
                        currentIndex: startIndex,
                        title
                    }
                }),

            closeGallery: () => set({ galleryState: null }),

            setGalleryIndex: (index) => set((state) => ({
                galleryState: state.galleryState
                    ? { ...state.galleryState, currentIndex: index }
                    : null
            })),

            // Mutator: Manajemen Panel Tab Detail
            setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

            // Mutator: Reset Data Peta (Jalan Keluar Analisis)
            resetMapData: () =>
                set((state) => ({
                    activeIndicator: null,
                    activeAssetLayers: [],
                    focusedDistrict: null,
                    galleryState: null, // Paksa teater mati jika peta direset
                    activePanels: state.activePanels.filter((p) => p.type !== "detil-distrik" && p.type !== "detil-aset"),
                    activeDetailTab: "umum",
                })),

            // ======================================================================
            // LOGIKA MUTUALLY EXCLUSIVE (CLEAN IMMUTABLE APPROACH)
            // ======================================================================
            openPanel: (type, title, data = null) =>
                set((state) => {
                    const isDetailPanel = type === "detil-distrik" || type === "detil-aset";

                    // 1. Bersihkan array panel yang ada (Filtering)
                    let nextPanels = [...state.activePanels];

                    if (isDetailPanel) {
                        nextPanels = nextPanels.filter(p => p.type !== "detil-distrik" && p.type !== "detil-aset");
                    } else {
                        nextPanels = nextPanels.filter(p => p.type !== type);
                    }

                    // 2. Buat panel baru dengan ID unik
                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    // 3. Tambahkan ke tumpukan paling atas (stack)
                    nextPanels.push(newPanel);

                    // 4. Reset tab
                    const resetTabObj = type === "detil-distrik" ? { activeDetailTab: "umum" as DetailTabType } : {};

                    return { activePanels: nextPanels, ...resetTabObj };
                }),

            closePanel: (id) =>
                set((state) => {
                    const filteredPanels = state.activePanels.filter((p) => p.id !== id);
                    const isDetailClosed = !filteredPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: filteredPanels,
                        // Jika panel detail ditutup, paksa hapus juga fokus distrik dan Teater Galeri
                        ...(isDetailClosed && {
                            activeDetailTab: "umum",
                            focusedDistrict: null,
                            galleryState: null // Garbage Collection Teater
                        })
                    };
                }),

            closePanelsToTheRight: (index) =>
                set((state) => {
                    const slicedPanels = state.activePanels.slice(0, index + 1);
                    const isDetailStillOpen = slicedPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: slicedPanels,
                        // Jika panel detail tertutup karena aksi ini, bersihkan state kamera & Teater
                        ...(!isDetailStillOpen && {
                            activeDetailTab: "umum",
                            focusedDistrict: null,
                            galleryState: null // Garbage Collection Teater
                        })
                    };
                }),

            clearPanels: () => set({
                activePanels: [],
                activeDetailTab: "umum",
                focusedDistrict: null,
                galleryState: null // Garbage Collection Teater
            }),
        }),
        { name: "ExplorerStore" }
    )
);