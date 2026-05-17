// src/components/gis/PanelOrchestrator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Map as MapIcon } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

// Import Komponen Nyata
import CategoryPanel from "./panels/CategoryPanel";
import DetailPanel from "./panels/DetailPanel";
import LayerControl from "./panels/LayerControl";
import AboutPanel from "./panels/AboutPanel";

// PERBAIKAN KRUSIAL: Import helper warna dari Pure Fabrication Engine (gisUtils)
import { getSemanticColor } from "@/src/app/lib/gisUtils";

/**
 * PanelOrchestrator - The Stacking Drawer (Floating Paradigm)
 * Bertanggung jawab merender tumpukan panel melayang di atas peta.
 * Ukuran diperkecil (320px) untuk efisiensi "Map Real Estate".
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

    // LOGIKA UKURAN GFW: 320px (Compact & Efficient)
    // Di mobile, penuhi layar dikurangi margin 32px (16px kiri + 16px kanan)
    const PANEL_WIDTH = isMobile ? (typeof window !== 'undefined' ? window.innerWidth - 32 : 320) : 320;
    const PANEL_GAP = 12; // Gap antar laci dipersempit dari 16px ke 12px

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* =====================================================================
                1. SISTEM SHIFTING PANEL (LACI MELAYANG / FLOATING STACK)
            ====================================================================== */}
            {activePanels.map((panel, index) => {
                // Logika Shifting: Menghitung posisi X berdasarkan urutan (index)
                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);

                return (
                    <div
                        key={panel.id}
                        // PERUBAHAN: Menggunakan top-4 bottom-4 left-4 untuk efek melayang
                        className="absolute top-4 bottom-4 left-4 pointer-events-auto panel-transition"
                        style={{
                            width: `${PANEL_WIDTH}px`,
                            maxWidth: 'calc(100vw - 32px)',
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index,
                        }}
                    >
                        {/* CONTAINER PANEL: Shadow lebih dalam agar efek melayang terasa */}
                        <div className="bg-white/95 backdrop-blur-md h-full w-full rounded-2xl flex flex-col overflow-hidden border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">

                            {/* HEADER PANEL: Padding diperkecil (px-4 py-3) agar hemat ruang vertikal */}
                            <div className="px-4 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-teal-600 uppercase tracking-[0.2em] leading-none">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-xs font-black text-slate-800 truncate max-w-50 tracking-tight mt-1">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 hover:border-rose-200 transition-all active:scale-95"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>

                            {/* BODY PANEL: Padding dikunci di p-4 (Standard GFW) */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar p-4"
                                onClick={() => closePanelsToTheRight(index)}
                            >
                                {renderPanelContent(panel.type, panel.data)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* =====================================================================
                2. LEGENDA DINAMIS PETA (SINKRONISASI MUTLAK)
            ====================================================================== */}
            {activeIndicator && <MapLegend indicatorKey={activeIndicator} />}

        </div>
    );
}

/**
 * Helper: Menyuntikkan Komponen Panel berdasarkan Tipe
 */
function renderPanelContent(type: ExplorerPanelType, data: any) {
    switch (type) {
        case "seleksi-kategori":
            return <CategoryPanel />;

        case "detil-distrik":
            return <DetailPanel districtId={data?.id || 0} districtName={data?.name || "Unknown"} />;

        case "konfigurasi":
            return <LayerControl />;

        case "tentang":
            return <AboutPanel />;

        case "hasil-pencarian":
            return (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-400">
                    <MapIcon size={40} className="text-teal-500/40" />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Modul Pencarian</p>
                        <p className="text-[10px]">Fitur pencarian spasial sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );

        default:
            return <div className="text-slate-400 text-[10px]">Komponen panel belum didefinisikan.</div>;
    }
}

/**
 * Sub-komponen Map Legend (Floating Bottom Right)
 */
function MapLegend({ indicatorKey }: { indicatorKey: string }) {
    const formattedTitle = indicatorKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const scaleBins = [
        { label: "> 80% (Sangat Padat)", value: 90 },
        { label: "60% - 80% (Padat)", value: 70 },
        { label: "40% - 60% (Sedang)", value: 50 },
        { label: "20% - 40% (Rendah)", value: 30 },
        { label: "< 20% (Sangat Rendah)", value: 10 },
    ];

    const MAX_VALUE = 100;

    return (
        // Legend dipindahkan agar sejajar dengan HUD
        <div className="fixed bottom-8 right-24 md:right-32 pointer-events-auto z-50 bg-white/95 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-xl w-56 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <MapIcon size={14} className="text-teal-600" />
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest truncate">
                    {formattedTitle}
                </h4>
            </div>

            <div className="space-y-2.5">
                {scaleBins.map((bin, idx) => {
                    const boxColor = getSemanticColor(bin.value, MAX_VALUE, indicatorKey);
                    return (
                        <div key={idx} className="flex items-center gap-3 group cursor-default">
                            <div
                                className="w-3.5 h-3.5 rounded-sm border border-black/5 shadow-sm"
                                style={{ backgroundColor: boxColor }}
                            />
                            <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                                {bin.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}