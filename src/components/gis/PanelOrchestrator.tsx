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
 * PanelOrchestrator - The Stacking Drawer (Frameless Paradigm)
 * Merender tumpukan panel bersudut siku dengan border tipis (Sharp UI).
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

    const PANEL_WIDTH = isMobile ? (typeof window !== 'undefined' ? window.innerWidth - 32 : 320) : 320;
    const PANEL_GAP = 12;

    return (
        <div className="relative h-full w-full flex items-start pointer-events-none">

            {/* =====================================================================
                1. SISTEM SHIFTING PANEL (FRAMELESS STACK)
            ====================================================================== */}
            {activePanels.map((panel, index) => {
                const xOffset = index * (PANEL_WIDTH + PANEL_GAP);

                return (
                    <div
                        key={panel.id}
                        className="absolute top-4 bottom-4 left-4 pointer-events-auto panel-transition"
                        style={{
                            width: `${PANEL_WIDTH}px`,
                            maxWidth: 'calc(100vw - 32px)',
                            transform: `translateX(${xOffset}px)`,
                            zIndex: 40 - index,
                        }}
                    >
                        {/* CONTAINER PANEL: Flat, Frameless, Sharp Edges */}
                        <div className="bg-white/95 backdrop-blur-md h-full w-full rounded-none flex flex-col overflow-hidden border border-slate-300 shadow-none">

                            {/* HEADER PANEL */}
                            <div className="px-4 py-3.5 border-b border-slate-300 flex justify-between items-center bg-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-teal-700 uppercase tracking-[0.2em] leading-none">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-xs font-black text-slate-800 truncate max-w-50 tracking-tight mt-1">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-1.5 rounded-none bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors active:scale-95"
                                >
                                    <X size={14} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* BODY PANEL: Frameless layout container */}
                            <div
                                className="flex-1 overflow-y-auto custom-scrollbar"
                                onClick={() => closePanelsToTheRight(index)}
                            >
                                {renderPanelContent(panel.type, panel.data)}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* =====================================================================
                2. LEGENDA DINAMIS PETA (FRAMELESS)
            ====================================================================== */}
            {activeIndicator && <MapLegend indicatorKey={activeIndicator} />}

        </div>
    );
}

function renderPanelContent(type: ExplorerPanelType, data: any) {
    switch (type) {
        case "seleksi-kategori": return <CategoryPanel />;
        case "detil-distrik": return <DetailPanel districtId={data?.id || 0} districtName={data?.name || "Unknown"} />;
        case "konfigurasi": return <LayerControl />;
        case "tentang": return <AboutPanel />;
        case "hasil-pencarian":
            return (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-400 p-4">
                    <MapIcon size={40} className="text-teal-600/40" />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Modul Pencarian</p>
                        <p className="text-[10px]">Fitur pencarian spasial sedang dalam tahap integrasi.</p>
                    </div>
                </div>
            );
        default:
            return <div className="text-slate-400 text-[10px] p-4">Komponen panel belum didefinisikan.</div>;
    }
}

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
        <div className="fixed bottom-8 right-24 md:right-32 pointer-events-auto z-50 bg-white/95 backdrop-blur-md border border-slate-300 p-4 rounded-none shadow-none w-56 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-300 pb-2">
                <MapIcon size={14} className="text-teal-700" />
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
                                className="w-3.5 h-3.5 rounded-none border border-slate-300"
                                style={{ backgroundColor: boxColor }}
                            />
                            <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                {bin.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}