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
 * PanelOrchestrator - Dual Docked Architecture (GFW Style)
 * Mengelola dua area terpisah: Left Dock (Drawer) dan Right Dock (Detail Context).
 */
export default function PanelOrchestrator() {
    const { activeDrawer, activeDetail, closePanel, activeIndicator } = useExplorerStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Konstanta Lebar Panel
    const DRAWER_WIDTH = isMobile ? (typeof window !== 'undefined' ? window.innerWidth : 320) : 320;
    const DETAIL_WIDTH = isMobile ? (typeof window !== 'undefined' ? window.innerWidth : 360) : 360;

    return (
        <div className="relative h-full w-full pointer-events-none overflow-hidden">

            {/* =====================================================================
                ENTITAS 1: LEFT DOCKED DRAWER (Panel Kontrol Sektor/Layer/Search)
            ====================================================================== */}
            {activeDrawer && (
                <div
                    key={activeDrawer.id}
                    className="absolute top-0 bottom-16 md:bottom-0 left-0 md:left-16 pointer-events-auto transition-transform duration-300 ease-out z-40 bg-white border-r border-slate-300 shadow-[10px_0_30px_rgba(0,0,0,0.03)]"
                    style={{ width: `${DRAWER_WIDTH}px`, maxWidth: '100vw' }}
                >
                    <div className="h-full w-full flex flex-col overflow-hidden">
                        {/* HEADER DRAWER */}
                        <div className="px-4 py-3.5 border-b border-slate-300 flex justify-between items-center bg-slate-50">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-teal-700 uppercase tracking-[0.2em] leading-none">
                                    {activeDrawer.type.replace("-", " ")}
                                </span>
                                <h3 className="text-xs font-black text-slate-800 truncate max-w-50 tracking-tight mt-1">
                                    {activeDrawer.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => closePanel(activeDrawer.id)}
                                className="p-1.5 rounded-none bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors active:scale-95"
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* BODY DRAWER */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {renderPanelContent(activeDrawer.type, activeDrawer.data)}
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================================
                ENTITAS 2: RIGHT CONTEXTUAL CARD (Profil Distrik)
            ====================================================================== */}
            {activeDetail && (
                <div
                    key={activeDetail.id}
                    className="absolute top-0 bottom-16 md:bottom-0 right-0 pointer-events-auto z-40 bg-white border-l border-slate-300 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out"
                    style={{ width: `${DETAIL_WIDTH}px`, maxWidth: '100vw' }}
                >
                    <div className="h-full w-full flex flex-col overflow-hidden">
                        {/* HEADER DETAIL PANEL */}
                        <div className="px-4 py-3.5 border-b border-slate-300 flex justify-between items-center bg-slate-50">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
                                    Profil Kewilayahan
                                </span>
                                <h3 className="text-xs font-black text-slate-900 truncate max-w-50 tracking-tight mt-1 uppercase">
                                    {activeDetail.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => closePanel(activeDetail.id)}
                                className="p-1.5 rounded-none bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors active:scale-95"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>

                        {/* BODY DETAIL PANEL */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                            <DetailPanel districtId={activeDetail.data?.id || 0} districtName={activeDetail.data?.name || "Unknown"} />
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================================
                3. LEGENDA DINAMIS PETA (SINKRONISASI MUTLAK)
            ====================================================================== */}
            {activeIndicator && <MapLegend indicatorKey={activeIndicator} isDetailOpen={!!activeDetail} detailWidth={DETAIL_WIDTH} />}

        </div>
    );
}

function renderPanelContent(type: ExplorerPanelType, data: any) {
    switch (type) {
        case "seleksi-kategori": return <CategoryPanel />;
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

function MapLegend({ indicatorKey, isDetailOpen, detailWidth }: { indicatorKey: string, isDetailOpen: boolean, detailWidth: number }) {
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
        <div
            className="fixed bottom-20 md:bottom-8 pointer-events-auto z-50 bg-white/95 backdrop-blur-md border border-slate-300 p-3 rounded-none shadow-none w-52 transition-all duration-300 ease-out"
            // Logika responsif: Jika right dock terbuka, geser legenda agar tidak tertimpa
            style={{ right: isDetailOpen ? `${detailWidth + 16}px` : '1.5rem' }}
        >
            <div className="flex items-center gap-2 mb-2.5 border-b border-slate-300 pb-1.5">
                <MapIcon size={12} className="text-teal-700" />
                <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest truncate">
                    {formattedTitle}
                </h4>
            </div>

            <div className="space-y-2">
                {scaleBins.map((bin, idx) => {
                    const boxColor = getSemanticColor(bin.value, MAX_VALUE, indicatorKey);
                    return (
                        <div key={idx} className="flex items-center gap-2.5 group cursor-default">
                            <div
                                className="w-3 h-3 rounded-none border border-slate-300"
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