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
// Ini memutus rantai SSR error "window is not defined" dari Leaflet.
import { getSemanticColor } from "@/src/app/lib/gisUtils";

/**
 * PanelOrchestrator - The Stacking Drawer (Light Theme)
 * Bertanggung jawab merender tumpukan panel secara dinamis di sisi kiri 
 * dan Legenda Global di kanan bawah (Sinkronisasi Mutlak).
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
                1. SISTEM SHIFTING PANEL (LACI BERTUMPUK TEMA TERANG)
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
                            maxWidth: 'calc(100vw - 32px)',
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index,
                        }}
                    >
                        {/* TUGAS 1: CONTAINER PANEL (Light Theme: Putih, Bayangan Lembut) */}
                        <div className="bg-white/95 backdrop-blur-md h-full w-full rounded-2xl flex flex-col overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/10">

                            {/* HEADER PANEL */}
                            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em]">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-sm font-black text-slate-800 truncate max-w-50 md:max-w-60 tracking-tight mt-0.5">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 hover:border-rose-200 transition-all active:scale-95"
                                >
                                    <X size={16} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* BODY PANEL (Konten Dinamis) */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar p-5"
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
                    <MapIcon size={48} className="text-teal-500/50" />
                    <div className="space-y-1">
                        <p className="text-sm font-black text-slate-700 uppercase tracking-widest">Modul Pencarian</p>
                        <p className="text-xs">Fitur pencarian spasial sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );

        default:
            return <div className="text-slate-400 text-xs">Komponen panel belum didefinisikan.</div>;
    }
}

/**
 * TUGAS 2: Sub-komponen Map Legend (Sinkronisasi Mutlak)
 * Merender kotak legenda secara dinamis dengan membaca mesin warna `getSemanticColor`.
 */
function MapLegend({ indicatorKey }: { indicatorKey: string }) {
    // Format teks indikator agar cantik (misal: "stunting_rate" -> "Stunting Rate")
    const formattedTitle = indicatorKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Definisi skala rentang nilai
    const scaleBins = [
        { label: "> 80% (Sangat Padat)", value: 90 },
        { label: "60% - 80% (Padat)", value: 70 },
        { label: "40% - 60% (Sedang)", value: 50 },
        { label: "20% - 40% (Rendah)", value: 30 },
        { label: "< 20% (Sangat Rendah)", value: 10 },
    ];

    // Nilai maksimum patokan (disamakan dengan nilai max di MimikaMap)
    const MAX_VALUE = 100;

    return (
        <div className="fixed bottom-8 right-22 md:right-28 pointer-events-auto z-50 bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-xl w-60 md:w-64 animate-in fade-in slide-in-from-bottom-4">

            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <MapIcon size={16} className="text-teal-600" />
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest truncate" title={formattedTitle}>
                    {formattedTitle}
                </h4>
            </div>

            <div className="space-y-3">
                {scaleBins.map((bin, idx) => {
                    // PANGGIL MESIN WARNA UTAMA:
                    // Dapatkan warna aktual untuk rentang nilai ini berdasarkan tipe indikatornya
                    const boxColor = getSemanticColor(bin.value, MAX_VALUE, indicatorKey);

                    return (
                        <div key={idx} className="flex items-center gap-3 group cursor-default">
                            {/* Kotak warna dirender dengan backgroundColor dinamis */}
                            <div
                                className="w-4 h-4 rounded-sm border border-black/10 group-hover:scale-110 transition-transform shadow-sm"
                                style={{ backgroundColor: boxColor }}
                            />
                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                                {bin.label}
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}