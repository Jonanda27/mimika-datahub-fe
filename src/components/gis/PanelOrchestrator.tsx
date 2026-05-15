// src/components/gis/PanelOrchestrator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Map as MapIcon } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

// TAHAP 5: Import Komponen Nyata yang sudah dibangun di tahap sebelumnya
import CategoryPanel from "./panels/CategoryPanel";
import DetailPanel from "./panels/DetailPanel";
import LayerControl from "./panels/LayerControl"; // <-- Import LayerControl

/**
 * PanelOrchestrator - The Stacking Drawer (FASE 3 & 5)
 * Bertanggung jawab merender tumpukan panel secara dinamis di sisi kiri 
 * (docking ke Slim Sidebar) dan Legenda Global di kanan bawah.
 */
export default function PanelOrchestrator() {
    const { activePanels, closePanel, closePanelsToTheRight, activeIndicator } = useExplorerStore();

    // State untuk deteksi layar mobile
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Inisialisasi
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Lebar standar panel. Di mobile, penuhi layar (dikurangi margin), di desktop 360px.
    const PANEL_WIDTH = isMobile ? window.innerWidth - 32 : 360;
    const PANEL_GAP = isMobile ? 8 : 16;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* =====================================================================
                1. SISTEM SHIFTING PANEL (LACI BERTUMPUK)
            ====================================================================== */}
            {activePanels.map((panel, index) => {
                // Logika Shifting: Menghitung posisi X berdasarkan urutan (index)
                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);

                return (
                    <div
                        key={panel.id}
                        className="absolute top-0 bottom-0 pointer-events-auto panel-transition"
                        style={{
                            width: `${PANEL_WIDTH}px`,
                            maxWidth: 'calc(100vw - 32px)', // Keamanan responsivitas mobile
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index, // Panel lebih kanan berada "di bawah" secara visual
                        }}
                    >
                        {/* CONTAINER PANEL (Identitas Bold: Papuan Midnight & Neon) */}
                        <div className="bg-[#0A192F]/95 backdrop-blur-xl h-full w-full rounded-2xl flex flex-col overflow-hidden border border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,0,0,0.6)]">

                            {/* HEADER PANEL */}
                            <div className="px-5 py-4 border-b border-[#00E5FF]/20 flex justify-between items-center bg-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-[#00E5FF] uppercase tracking-[0.2em]">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-sm font-black text-white truncate max-w-[200px] md:max-w-[240px] tracking-tight mt-0.5">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00E5FF] hover:text-[#0A192F] text-white/50 hover:border-[#00E5FF] transition-all active:scale-95"
                                >
                                    <X size={16} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* BODY PANEL (Konten Dinamis terintegrasi dengan komponen asli) */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar p-5"
                                onClick={() => closePanelsToTheRight(index)} // Autofokus: tutup panel di kanannya
                            >
                                {renderPanelContent(panel.type, panel.data)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* =====================================================================
                2. TAHAP 5: LEGENDA DINAMIS PETA (GLOBAL OVERLAY)
            ====================================================================== */}
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
            // TAHAP 2 & 3: Integrasi komponen LayerControl untuk mengatur Basemap & Opacity
            return <LayerControl />;

        case "search-result":
            return (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                    <MapIcon size={48} className="text-[#00E5FF]" />
                    <div className="space-y-1">
                        <p className="text-sm font-black text-white uppercase tracking-widest">Modul Pencarian</p>
                        <p className="text-xs text-white/60">Fitur pencarian spasial sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );

        default:
            return <div className="text-white/40 text-xs">Komponen panel belum didefinisikan.</div>;
    }
}

/**
 * TAHAP 5: Sub-komponen Map Legend
 * Merender kotak legenda secara "Fixed" di pojok kanan bawah agar merespon viewport secara utuh.
 */
function MapLegend({ indicatorKey }: { indicatorKey: string }) {
    // Format teks indikator agar cantik (misal: "stunting_rate" -> "Stunting Rate")
    const formattedTitle = indicatorKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        // Menggunakan posisi "fixed" agar menempel di kanan bawah layar berdampingan dengan Custom Zoom HUD
        <div className="fixed bottom-8 right-[88px] md:right-8 pointer-events-auto z-50 bg-[#0A192F]/90 backdrop-blur-xl border border-[#00E5FF]/20 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,229,255,0.15)] w-60 md:w-64 animate-in fade-in slide-in-from-bottom-4">

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <MapIcon size={16} className="text-[#00E5FF]" />
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">
                    {formattedTitle}
                </h4>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-4 h-4 rounded-sm bg-[#1e3a8a] border border-white/10 shadow-[0_0_10px_rgba(30,58,138,0.8)] group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-[#00E5FF] transition-colors"> 80% (Sangat Padat)</span>
                </div>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-4 h-4 rounded-sm bg-[#1d4ed8] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-[#00E5FF] transition-colors">60% - 80% (Padat)</span>
                </div>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-4 h-4 rounded-sm bg-[#3b82f6] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-[#00E5FF] transition-colors">40% - 60% (Sedang)</span>
                </div>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-4 h-4 rounded-sm bg-[#93c5fd] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-[#00E5FF] transition-colors">20% - 40% (Rendah)</span>
                </div>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-4 h-4 rounded-sm bg-[#dbeafe] border border-white/10 group-hover:scale-110 transition-transform"></div>
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-[#00E5FF] transition-colors">&lt; 20% (Sangat Rendah)</span>
                </div>
            </div>

        </div>
    );
}