// src/components/gis/MapHUD.tsx
"use client";

import React from "react";
import { Plus, Minus, Maximize } from "lucide-react";

/**
 * MapHUD - Fokus murni pada Navigasi (Zoom & Center)
 * Terletak di Kanan Bawah.
 */
export default function MapHUD() {
    const triggerZoomIn = () => window.dispatchEvent(new Event('map-zoom-in'));
    const triggerZoomOut = () => window.dispatchEvent(new Event('map-zoom-out'));
    const triggerResetView = () => window.dispatchEvent(new Event('map-reset-view'));

    return (
        <div className="flex flex-col items-end justify-end pointer-events-none w-full select-none">
            <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl overflow-hidden divide-y divide-slate-100">
                <button
                    onClick={triggerZoomIn}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors active:bg-teal-100"
                    title="Perbesar"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>

                <button
                    onClick={triggerResetView}
                    className="w-10 h-9 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors active:bg-teal-100 group"
                    title="Reset Fokus"
                >
                    <Maximize size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={triggerZoomOut}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors active:bg-teal-100"
                    title="Perkecil"
                >
                    <Minus size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}