// src/components/gis/PanelOrchestrator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Map as MapIcon, Layers, Info, Building2 } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

// Komponen Panel
import CategoryPanel from "./panels/CategoryPanel";
import DetailPanel from "./panels/DetailPanel";
import LayerControl from "./panels/LayerControl";
import AboutPanel from "./panels/AboutPanel";

import { getSemanticColor } from "@/src/app/lib/gisUtils";

/**
 * PanelOrchestrator - The Stacking Drawer (GFW Paradigm)
 * * Bertindak sebagai pusat kendali visual yang mengelola stack panel dinamis.
 * Menggunakan prinsip "Shifting Panels" di mana panel detail (Floating) 
 * akan melayang di atas panel menu utama (Docked).
 */
export default function PanelOrchestrator() {
    const {
        activePanels,
        closePanel,
        closePanelsToTheRight,
        activeChoropleth // Menggunakan state baru dari store kita
    } = useExplorerStore();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sumbu X: Base width 280px (Ultra Slim & High Density)
    const PANEL_WIDTH = 280;
    const PANEL_GAP = 0;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* =====================================================================
                1. SISTEM SHIFTING & FLOATING PANEL
            ====================================================================== */}
            {activePanels.map((panel, index) => {
                const isFloating = panel.type === "detil-distrik";
                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);

                // Kalkulasi pergeseran: Jika panel melayang (Detail), dia tidak mengikuti flow sidebar
                const floatingLeft = isMobile ? 16 : (index * PANEL_WIDTH) + 16;

                return (
                    <div
                        key={panel.id}
                        className={`absolute pointer-events-auto transition-all duration-300 ease-in-out ${isFloating
                            ? 'shadow-xl border-l border-slate-200'
                            : 'border-r border-slate-200 shadow-none'
                            }`}
                        style={isFloating ? {
                            left: `${floatingLeft}px`,
                            top: '16px',
                            bottom: '16px',
                            width: '280px',
                            maxWidth: 'calc(100vw - 32px)',
                            zIndex: 50,
                        } : {
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

                            {/* Header Panel (Hanya untuk Menu Reguler/Docked) */}
                            {!isFloating && (
                                <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-teal-700 uppercase tracking-widest leading-none">
                                            {panel.type.replace("-", " ")}
                                        </span>
                                        <h3 className="text-[11px] font-medium text-slate-800 truncate max-w-[200px] tracking-tight mt-1">
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

                            {/* BODY PANEL - Orchestrator bertugas menginjeksi komponen yang benar */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar bg-white"
                                onClick={() => !isFloating && closePanelsToTheRight(index)}
                            >
                                {renderPanelContent(panel.type, panel.data, panel.id)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* =====================================================================
                2. LEGENDA DINAMIS (CHOROPLETH LEGEND)
            ====================================================================== */}
            {activeChoropleth && <MapLegend indicatorKey={activeChoropleth} />}

        </div>
    );
}

/**
 * PUSAT ORKESTRASI KOMPONEN
 * Memetakan tipe panel ke komponen yang sesuai.
 */
function renderPanelContent(type: ExplorerPanelType, data: any, panelId: string) {
    switch (type) {
        // [FIXED] Mapping tipe baru ke komponen yang relevan
        case "seleksi-opd":
            return <CategoryPanel />;
        case "detil-distrik":
            return <DetailPanel districtId={data?.id || 0} districtName={data?.name || "Unknown"} panelId={panelId} />;
        case "konfigurasi":
            return <LayerControl />;
        case "tentang":
            return <AboutPanel />;
        case "hasil-pencarian":
            return (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-400 p-4">
                    <MapIcon size={32} className="text-teal-600/40" />
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modul Pencarian</p>
                        <p className="text-[11px] text-slate-600 mt-1">Fitur pencarian spasial sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );
        default:
            return (
                <div className="p-4 text-center">
                    <p className="text-[11px] text-rose-600 font-bold">Error: Komponen '{type}' belum didefinisikan.</p>
                </div>
            );
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
        { label: "Sangat Tinggi", value: 90 },
        { label: "Tinggi", value: 70 },
        { label: "Sedang", value: 50 },
        { label: "Rendah", value: 30 },
        { label: "Sangat Rendah", value: 10 },
    ];

    const MAX_VALUE = 100;

    return (
        <div className="fixed bottom-8 right-8 pointer-events-auto z-[60] bg-white border border-slate-200 shadow-xl w-[160px] rounded-none animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between px-2.5 py-2 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                    <MapIcon size={10} className="text-teal-700" />
                    <h4 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">Legenda</h4>
                </div>
            </div>

            <div className="px-2.5 py-2.5 flex flex-col gap-1.5">
                <h5 className="text-[9px] font-bold text-slate-800 leading-tight line-clamp-2 uppercase">
                    {formattedTitle}
                </h5>

                <div className="flex mt-1">
                    <div className="flex flex-col w-3 border border-slate-200 rounded-none shrink-0 shadow-sm">
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