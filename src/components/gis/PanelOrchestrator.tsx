// src/components/gis/PanelOrchestrator.tsx
"use client";

import React from "react";
import { X, Map as MapIcon } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

// TAHAP 5: Import Komponen Nyata yang sudah dibangun di tahap sebelumnya
import CategoryPanel from "./panels/CategoryPanel";
import DetailPanel from "./panels/DetailPanel";

/**
 * PanelOrchestrator - The Shifting Engine & Global Overlay
 * Bertanggung jawab merender tumpukan panel secara dinamis dan overlay global (seperti Legenda).
 */
export default function PanelOrchestrator() {
    // Menarik state panels dan activeIndicator (untuk legenda) dari Information Expert (Store)
    const { activePanels, closePanel, closePanelsToTheRight, activeIndicator } = useExplorerStore();

    // Lebar standar panel (360px) + Gap antar panel (12px)
    const PANEL_WIDTH = 360;
    const PANEL_GAP = 12;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* 1. SISTEM SHIFTING PANEL */}
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

                            {/* BODY PANEL (Konten Dinamis terintegrasi dengan komponen asli) */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar p-5"
                                onClick={() => closePanelsToTheRight(index)} // Jika body diklik, tutup panel di kanannya
                            >
                                {renderPanelContent(panel.type, panel.data)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* 2. TAHAP 5: LEGENDA DINAMIS PETA (GLOBAL OVERLAY) */}
            {activeIndicator && <MapLegend indicatorKey={activeIndicator} />}

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
            return <CategoryPanel />;

        case "district-detail":
            return <DetailPanel districtId={data?.id || 0} districtName={data?.name || "Unknown"} />;

        case "indicator-config":
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-xs text-blue-300 leading-relaxed font-medium">
                            Peta saat ini menampilkan analisis visual untuk indikator: <br />
                            <span className="text-white font-bold block mt-1">{data?.indicatorKey}</span>
                        </p>
                    </div>
                    <div className="p-4 border border-white/10 rounded-xl">
                        <p className="text-xs text-white/50">
                            Fitur filter lanjutan (berdasarkan tahun & parameter sekunder) untuk indikator ini sedang dikembangkan.
                        </p>
                    </div>
                </div>
            );

        case "search-result":
            return <div className="text-white/60 text-sm italic font-medium">Hasil pencarian spasial...</div>;

        default:
            return <div className="text-white/40 text-xs">Komponen panel belum didefinisikan.</div>;
    }
}

/**
 * TAHAP 5: Sub-komponen Map Legend
 * Merender kotak legenda di pojok kanan bawah untuk memberikan konteks pada Choropleth.
 */
function MapLegend({ indicatorKey }: { indicatorKey: string }) {
    // Format teks indikator agar lebih cantik (misal: "stunting_rate" -> "Stunting Rate")
    const formattedTitle = indicatorKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="absolute bottom-8 right-8 pointer-events-auto z-50 glass-morphism-dark border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] w-64 animate-in fade-in slide-in-from-bottom-4">

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <MapIcon size={16} className="text-blue-400" />
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">
                    {formattedTitle}
                </h4>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 group">
                    <div className="w-4 h-4 rounded-sm bg-[#1e3a8a] border border-white/10 shadow-[0_0_8px_rgba(30,58,138,0.5)] group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors"> 80% (Sangat Tinggi)</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <div className="w-4 h-4 rounded-sm bg-[#1d4ed8] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">60% - 80% (Tinggi)</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <div className="w-4 h-4 rounded-sm bg-[#3b82f6] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">40% - 60% (Sedang)</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <div className="w-4 h-4 rounded-sm bg-[#93c5fd] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">20% - 40% (Rendah)</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <div className="w-4 h-4 rounded-sm bg-[#dbeafe] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">&lt; 20% (Sangat Rendah)</span>
                </div>
            </div>

        </div>
    );
}