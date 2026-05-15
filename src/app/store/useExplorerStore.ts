// src/app/store/useExplorerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExplorerPanel, ExplorerPanelType } from "../types/gis";

interface ExplorerState {
    // State: Array panel yang aktif di layar
    activePanels: ExplorerPanel[];

    // Actions
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
}

export const useExplorerStore = create<ExplorerState>()(
    devtools(
        (set) => ({
            activePanels: [],

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

                    // Jika panel baru, buat objek panel baru patuh pada interface Fase 1
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