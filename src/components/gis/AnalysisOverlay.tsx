// src/components/gis/AnalysisOverlay.tsx
"use client";

import React from "react";
import { XCircle, RefreshCcw } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * AnalysisOverlay - Global Action Bar (Top Right)
 * Komponen prestisius untuk mengontrol status analisis data yang sedang aktif.
 * Menggunakan standar mikro-tipografi dan skema warna Rose untuk aksi destruktif (reset).
 */
export default function AnalysisOverlay() {
    const { activeIndicator, resetMapData } = useExplorerStore();

    // Komponen hanya muncul jika ada indikator (layer) yang sedang aktif di peta
    if (!activeIndicator) return null;

    return (
        <div className="absolute top-4 right-4 z-40 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none">
            <button
                onClick={resetMapData}
                className="group pointer-events-auto flex items-center gap-3 pl-3.5 pr-4 py-2 bg-white/95 backdrop-blur-xl border border-rose-200 shadow-[0_15px_35px_rgba(225,29,72,0.12)] rounded-2xl transition-all hover:bg-rose-50 hover:border-rose-300 active:scale-95"
            >
                {/* Visual Indicator: Animasi rotasi pada icon saat hover */}
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:rotate-180 transition-transform duration-700 ease-in-out shadow-sm border border-rose-200/50">
                    <RefreshCcw size={15} strokeWidth={2.5} />
                </div>

                <div className="flex flex-col items-start leading-none gap-1">
                    <p className="text-[7.5px] font-black text-rose-500 uppercase tracking-widest opacity-80">
                        Reset Peta 
                    </p>
                </div>

                {/* Secondary Icon: Penutup visual */}
                <div className="ml-2 border-l border-rose-100 pl-3">
                    <XCircle size={15} className="text-rose-300 group-hover:text-rose-500 transition-colors" />
                </div>
            </button>
        </div>
    );
}