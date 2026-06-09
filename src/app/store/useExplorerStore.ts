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

// [REFACTOR] Metadata Indikator Aktif untuk Legenda & Tooltip
export interface ActiveIndicatorMetadata {
    min: number;
    max: number;
    direction: 'positive' | 'negative';
    unit: string;
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

    // [REFACTOR] Properti Jangkar Spasial Dinamis & Arah Data (Pilar 1 & 2)
    activeMin: number | null;
    activeMax: number | null;
    activeDirection: 'positive' | 'negative' | null;
    activeUnit: string | null;

    activeAssetLayers: string[]; // <--- MULTI-SELECTION STATE (Format: "opdKey::assetType")
    mapOpacity: number;
    activeBaseMap: string;

    // Controller State untuk Peta
    focusedDistrict: string | null;

    // [REFACTOR] State Manajemen Hover Real-Time (Pilar 3)
    hoveredDistrict: string | null;
    hoveredAsset: any | null;

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
    // [REFACTOR] Mutator Indikator Aktif yang disempurnakan untuk mengikat Metadata Dinamis
    setActiveIndicator: (
        indicatorKey: string | null,
        meta?: ActiveIndicatorMetadata | null
    ) => void;

    toggleAssetLayer: (opdKey: string, assetType: string) => void;
    toggleOpdAssets: (opdKey: string, assetTypes: string[], isTurnOn: boolean) => void;
    setMapOpacity: (opacity: number) => void;
    setActiveBaseMap: (baseMapId: string) => void;

    // Mutator Controller Distrik
    setFocusDistrict: (districtName: string | null) => void;

    // [REFACTOR] Mutator State Hover
    setHoveredDistrict: (districtName: string | null) => void;
    setHoveredAsset: (asset: any | null) => void;

    // [REFACTOR] THEATER MODE: Actions
    openGallery: (images: string[], startIndex: number, title?: string) => void;
    closeGallery: () => void;
    setGalleryIndex: (index: number) => void;

    resetMapData: () => void;
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set, get) => ({
            // Inisialisasi State Default
            activePanels: [],
            activeDetailTab: "umum",
            activeIndicator: null,
            activeMin: null,
            activeMax: null,
            activeDirection: null,
            activeUnit: null,
            activeAssetLayers: [],
            mapOpacity: 70,
            activeBaseMap: "satellite",
            focusedDistrict: null,
            hoveredDistrict: null,
            hoveredAsset: null,
            galleryState: null,

            // [REFACTOR] Mutator Indikator: Menetapkan Key sekaligus mengunci parameter range dinamis
            setActiveIndicator: (indicatorKey, meta = null) => set({
                activeIndicator: indicatorKey,
                activeMin: meta ? meta.min : null,
                activeMax: meta ? meta.max : null,
                activeDirection: meta ? meta.direction : null,
                activeUnit: meta ? meta.unit : null
            }),

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

            setFocusDistrict: (districtName) => set({ focusedDistrict: districtName }),

            // [REFACTOR] Mutator Hover
            setHoveredDistrict: (districtName) => set({ hoveredDistrict: districtName }),
            setHoveredAsset: (asset) => set({ hoveredAsset: asset }),

            // [REFACTOR] THEATER MODE MUTATORS
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

            setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

            // [REFACTOR] Reset Peta dibersihkan total dari variabel sisa hover
            resetMapData: () =>
                set((state) => ({
                    activeIndicator: null,
                    activeMin: null,
                    activeMax: null,
                    activeDirection: null,
                    activeUnit: null,
                    activeAssetLayers: [],
                    focusedDistrict: null,
                    hoveredDistrict: null,
                    hoveredAsset: null,
                    galleryState: null,
                    activePanels: state.activePanels.filter((p) => p.type !== "detil-distrik" && p.type !== "detil-aset"),
                    activeDetailTab: "umum",
                })),

            openPanel: (type, title, data = null) =>
                set((state) => {
                    const isDetailPanel = type === "detil-distrik" || type === "detil-aset";
                    let nextPanels = [...state.activePanels];

                    if (isDetailPanel) {
                        nextPanels = nextPanels.filter(p => p.type !== "detil-distrik" && p.type !== "detil-aset");
                    } else {
                        nextPanels = nextPanels.filter(p => p.type !== type);
                    }

                    const newPanel: ExplorerPanel = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title,
                        isVisible: true,
                        data,
                    };

                    nextPanels.push(newPanel);
                    const resetTabObj = type === "detil-distrik" ? { activeDetailTab: "umum" as DetailTabType } : {};

                    return { activePanels: nextPanels, ...resetTabObj };
                }),

            closePanel: (id) =>
                set((state) => {
                    const filteredPanels = state.activePanels.filter((p) => p.id !== id);
                    const isDetailClosed = !filteredPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: filteredPanels,
                        ...(isDetailClosed && {
                            activeDetailTab: "umum",
                            focusedDistrict: null,
                            hoveredDistrict: null,
                            hoveredAsset: null,
                            galleryState: null
                        })
                    };
                }),

            closePanelsToTheRight: (index) =>
                set((state) => {
                    const slicedPanels = state.activePanels.slice(0, index + 1);
                    const isDetailStillOpen = slicedPanels.some(p => p.type === "detil-distrik" || p.type === "detil-aset");

                    return {
                        activePanels: slicedPanels,
                        ...(!isDetailStillOpen && {
                            activeDetailTab: "umum",
                            focusedDistrict: null,
                            hoveredDistrict: null,
                            hoveredAsset: null,
                            galleryState: null
                        })
                    };
                }),

            clearPanels: () => set({
                activePanels: [],
                activeDetailTab: "umum",
                focusedDistrict: null,
                hoveredDistrict: null,
                hoveredAsset: null,
                galleryState: null
            }),
        }),
        { name: "ExplorerStore" }
    )
);