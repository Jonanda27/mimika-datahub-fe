// src/components/gis/MapHUD.tsx
"use client";

import React from "react";
import {
    Plus,
    Minus,
    Maximize,
    Info,
    ShieldCheck,
    MousePointer2
} from "lucide-react";

/**
 * MapHUD (Heads-Up Display) - The Interactive Overlay
 * Komponen ini menampung kontrol peta kustom yang melayang di atas kanvas.
 * Terpisah dari engine Leaflet untuk fleksibilitas styling maksimal.
 */
export default function MapHUD() {

    // Fungsi pemicu event kustom yang didengarkan oleh ExternalMapController di MimikaMap
    const triggerZoomIn = () => {
        window.dispatchEvent(new Event('map-zoom-in'));
    };

    const triggerZoomOut = () => {
        window.dispatchEvent(new Event('map-zoom-out'));
    };

    const triggerResetView = () => {
        // Event tambahan jika ingin kembali ke koordinat pusat Mimika
        window.dispatchEvent(new Event('map-reset-view'));
    };

    return (
        <div className="flex flex-col items-end gap-6 pointer-events-none w-full max-w-[300px]">

            {/* 1. WIDGET: STATUS INTEGRITAS DATA (Top HUD) */}
            <div className="pointer-events-auto group">
                <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-[#00E5FF]/20 px-5 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-start gap-4 transition-all duration-300 hover:border-[#00E5FF]/50 hover:translate-y-[-2px]">
                    <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] shrink-0 border border-[#00E5FF]/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.2em] leading-none">
                            Kesiapan Data
                        </span>
                        <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                            Dataset tervalidasi <span className="text-white font-bold">Bappeda</span> untuk periode <span className="text-white font-bold">2025/2026</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. WIDGET: CUSTOM MAP CONTROLS (Floating Action Buttons) */}
            <div className="pointer-events-auto flex flex-col gap-3">

                {/* Zoom In */}
                <button
                    onClick={triggerZoomIn}
                    className="w-12 h-12 bg-[#0A192F]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex items-center justify-center text-white hover:bg-[#00E5FF] hover:text-[#0A192F] transition-all group active:scale-90"
                    title="Perbesar Peta"
                >
                    <Plus size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Zoom Out */}
                <button
                    onClick={triggerZoomOut}
                    className="w-12 h-12 bg-[#0A192F]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex items-center justify-center text-white hover:bg-[#00E5FF] hover:text-[#0A192F] transition-all group active:scale-90"
                    title="Perkecil Peta"
                >
                    <Minus size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Divider */}
                <div className="h-px w-8 bg-white/10 mx-auto my-1" />

                {/* Reset View / Full Extent */}
                <button
                    onClick={triggerResetView}
                    className="w-12 h-12 bg-[#0A192F]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex items-center justify-center text-white hover:bg-[#00E5FF] hover:text-[#0A192F] transition-all group active:scale-90"
                    title="Reset Fokus Wilayah"
                >
                    <Maximize size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>

            </div>

            {/* 3. WIDGET: QUICK INFO / COORDINATES (Bottom HUD) */}
            <div className="pointer-events-auto">
                <div className="bg-[#0A192F]/60 backdrop-blur-md border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
                    <MousePointer2 size={12} className="text-[#00E5FF] animate-pulse" />
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                        Mode Eksplorasi Aktif
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
            </div>

        </div>
    );
}