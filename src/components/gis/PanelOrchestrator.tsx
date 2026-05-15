// src/components/gis/PanelOrchestrator.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

/**
 * PanelOrchestrator - The Shifting Engine
 * Bertanggung jawab merender tumpukan panel secara dinamis.
 * Menggunakan perhitungan index-based positioning untuk efek geser.
 */
export default function PanelOrchestrator() {
    const { activePanels, closePanel, closePanelsToTheRight } = useExplorerStore();

    // Lebar standar panel (360px) + Gap antar panel (12px)
    const PANEL_WIDTH = 360;
    const PANEL_GAP = 12;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">
            {activePanels.map((panel, index) => {
                // Logika Shifting: Menghitung posisi X berdasarkan urutan (index)
                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);

                return (
                    <div
                        key={panel.id}
                        className="absolute top-0 bottom-0 pointer-events-auto panel-transition"
                        style={{
                            width: `${PANEL_WIDTH}px`,
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index, // Panel lebih kanan berada "di bawah" secara visual jika tumpang tindih
                        }}
                    >
                        {/* CONTAINER PANEL (Glassmorphism) */}
                        <div className="glass-morphism-dark h-full w-full rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl">

                            {/* HEADER PANEL */}
                            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-sm font-black text-white truncate max-w-60">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* BODY PANEL (Konten Dinamis) */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar p-5"
                                onClick={() => closePanelsToTheRight(index)} // Jika body diklik, fokus ke panel ini (tutup kanan)
                            >
                                {renderPanelContent(panel.type, panel.data)}
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Helper: Menyuntikkan Komponen Panel berdasarkan Tipe
 * (Indirection: Memisahkan logika render dari logika orchestrator)
 */
function renderPanelContent(type: ExplorerPanelType, data: any) {
    switch (type) {
        case "category-selector":
            return <div className="text-white/60 text-sm italic font-medium">Menyiapkan daftar kategori sektoral...</div>;

        case "district-detail":
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-xs text-blue-300 leading-relaxed font-medium">
                            Memuat data mendalam untuk wilayah: <span className="text-white font-bold">{data?.name || "ID: " + data}</span>
                        </p>
                    </div>
                    <div className="w-full h-32 bg-white/5 rounded-xl animate-pulse" />
                    <div className="w-2/3 h-4 bg-white/5 rounded-full animate-pulse" />
                    <div className="w-full h-4 bg-white/5 rounded-full animate-pulse" />
                </div>
            );

        case "indicator-config":
            return <div className="text-white/60 text-sm italic font-medium">Pengaturan visualisasi indikator...</div>;

        case "search-result":
            return <div className="text-white/60 text-sm italic font-medium">Hasil pencarian spasial...</div>;

        default:
            return <div className="text-white/40 text-xs">Komponen panel belum didefinisikan.</div>;
    }
}