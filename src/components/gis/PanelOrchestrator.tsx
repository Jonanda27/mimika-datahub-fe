// src/components/gis/PanelOrchestrator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Map as MapIcon } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

import CategoryPanel from "./panels/CategoryPanel";
import DetailPanel from "./panels/DetailPanel";
import LayerControl from "./panels/LayerControl";
import AboutPanel from "./panels/AboutPanel";

import { getSemanticColor } from "@/src/app/lib/gisUtils";

/**
 * PanelOrchestrator - The Stacking Drawer (GFW Paradigm)
 * Mengatur dua jenis perilaku panel dengan Sumbu X (Width) yang sangat ramping:
 * 1. Panel Menu (Flush/Docked): 280px, menempel rapat di kiri.
 * 2. Panel Detail (Floating): 280px, melayang di sebelah kanan menu dengan shadow tegas.
 */
export default function PanelOrchestrator() {
    const { activePanels, closePanel, closePanelsToTheRight, activeIndicator } = useExplorerStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sumbu X: Base width 280px (Ultra Slim)
    const PANEL_WIDTH = isMobile ? (typeof window !== 'undefined' ? window.innerWidth - 32 : 280) : 280;
    const PANEL_GAP = 0;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* =====================================================================
                1. SISTEM SHIFTING & FLOATING PANEL
            ====================================================================== */}
            {activePanels.map((panel, index) => {
                const isFloating = panel.type === "detil-distrik";

                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);
                const floatingLeft = isMobile ? 16 : (PANEL_WIDTH + 16);

                return (
                    <div
                        key={panel.id}
                        className={`absolute pointer-events-auto panel-transition ${isFloating ? 'shadow-lg border border-slate-200' : 'border-r border-slate-200 shadow-none'
                            }`}
                        style={isFloating ? {
                            // Floating Detail Panel (X-Axis ramping 280px)
                            left: `${floatingLeft}px`,
                            top: '16px',
                            bottom: '16px',
                            width: '280px',
                            maxWidth: 'calc(100vw - 32px)',
                            zIndex: 50,
                        } : {
                            // Menu Reguler: Docking & Flush (280px)
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${PANEL_WIDTH}px`,
                            maxWidth: 'calc(100vw - 32px)',
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index,
                        }}
                    >
                        <div className="bg-white h-full w-full rounded-none flex flex-col overflow-hidden">

                            {/* Header Panel (Hanya untuk Menu Reguler) */}
                            {!isFloating && (
                                <div className="px-3 py-2 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                                            {panel.type.replace("-", " ")}
                                        </span>
                                        <h3 className="text-[11px] font-medium text-slate-800 truncate max-w-50 tracking-tight mt-0.5">
                                            {panel.title}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => closePanel(panel.id)}
                                        className="p-1 rounded-none bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors active:scale-95"
                                    >
                                        <X size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            )}

                            {/* BODY PANEL */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar"
                                onClick={() => !isFloating && closePanelsToTheRight(index)}
                            >
                                {renderPanelContent(panel.type, panel.data, panel.id)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* =====================================================================
                2. LEGENDA DINAMIS PETA (ULTRA-COMPACT CONTINUOUS RAMP)
            ====================================================================== */}
            {activeIndicator && <MapLegend indicatorKey={activeIndicator} />}

        </div>
    );
}

function renderPanelContent(type: ExplorerPanelType, data: any, panelId: string) {
    switch (type) {
        case "seleksi-kategori": return <CategoryPanel />;
        case "detil-distrik": return <DetailPanel districtId={data?.id || 0} districtName={data?.name || "Unknown"} panelId={panelId} />;
        case "konfigurasi": return <LayerControl />;
        case "tentang": return <AboutPanel />;
        case "hasil-pencarian":
            return (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-400 p-4">
                    <MapIcon size={32} className="text-teal-600/40" />
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modul Pencarian</p>
                        <p className="text-[11px] text-slate-600 mt-1">Fitur pencarian sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );
        default:
            return <div className="text-slate-500 text-[11px] p-4">Komponen panel belum didefinisikan.</div>;
    }
}

/**
 * Komponen Legenda (Ultra-Compact Continuous Color Ramp).
 */
function MapLegend({ indicatorKey }: { indicatorKey: string }) {
    const formattedTitle = indicatorKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const scaleBins = [
        { label: "Sangat Padat (>80%)", value: 90 },
        { label: "Padat (60-80%)", value: 70 },
        { label: "Sedang (40-60%)", value: 50 },
        { label: "Rendah (20-40%)", value: 30 },
        { label: "Sangat Rendah (<20%)", value: 10 },
    ];

    const MAX_VALUE = 100;

    return (
        // Lebar kontainer dirampingkan menjadi w-[170px]
        <div className="fixed bottom-8 right-19.5 pointer-events-auto z-50 bg-white border border-slate-200 shadow-lg w-42.5 rounded-none animate-in fade-in slide-in-from-bottom-4">

            {/* Header Legenda - Spasi Ultra Rapat */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                    <MapIcon size={10} className="text-teal-700" />
                    <h4 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider truncate">
                        Legenda
                    </h4>
                </div>
            </div>

            {/* Body Legenda */}
            <div className="px-2.5 py-2.5 flex flex-col gap-1.5">
                <h5 className="text-[9px] font-bold text-slate-800 leading-tight line-clamp-2">
                    {formattedTitle}
                </h5>

                <div className="flex mt-0.5">
                    {/* Pilar Warna (Lebar 2.5, Tinggi 4) */}
                    <div className="flex flex-col w-2.5 border border-slate-200 rounded-none shrink-0 shadow-sm">
                        {scaleBins.map((bin, idx) => {
                            const boxColor = getSemanticColor(bin.value, MAX_VALUE, indicatorKey);
                            return (
                                <div
                                    key={`color-${idx}`}
                                    className="h-4 w-full"
                                    style={{ backgroundColor: boxColor }}
                                />
                            );
                        })}
                    </div>

                    {/* Label Keterangan */}
                    <div className="flex flex-col justify-between ml-2 py-0">
                        {scaleBins.map((bin, idx) => (
                            <div key={`label-${idx}`} className="h-4 flex items-center">
                                <span className="text-[9px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
                                    {bin.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}