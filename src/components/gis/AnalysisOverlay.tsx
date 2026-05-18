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
                className="group pointer-events-auto flex items-center gap-3 pl-3.5 pr-4 py-2 bg-white/95 backdrop-blur-xl border border-rose-200 shadow-[0_15px_35px_rgba(225,29,72,0.12)] rounded-none transition-all hover:bg-rose-50 hover:border-rose-300 active:scale-95"
            >
                {/* 1. ANIMASI ROTASI TANPA BACKGROUND KOTAK */}
                <div className="w-5 h-5 flex items-center justify-center text-rose-600 group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                    <RefreshCcw size={15} strokeWidth={2.5} />
                </div>

                {/* 2. TEKS SEJAJAR HORIZONTAL KE SAMPING */}
                {/* Menyuntikkan whitespace-nowrap agar teks tidak dipatahkan ke bawah oleh browser */}
                <div className="flex flex-row items-center leading-none whitespace-nowrap">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-80">
                        Reset Peta
                    </p>
                </div>
            </button>
        </div>
    );
}