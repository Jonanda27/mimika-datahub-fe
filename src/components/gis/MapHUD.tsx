// src/components/gis/MapHUD.tsx
"use client";

import React from "react";
import { Plus, Minus, Maximize } from "lucide-react";

/**
 * MapHUD - Navigation Command Center
 * Estetika: Frameless, Sharp Edges, High-Density.
 * Komponen ini berfungsi sebagai antarmuka navigasi murni untuk memanipulasi Viewport Peta.
 */
export default function MapHUD() {

    // Dispatch events untuk di-handle oleh ExternalMapController di MimikaMap.tsx
    const triggerZoomIn = () => window.dispatchEvent(new Event('map-zoom-in'));
    const triggerZoomOut = () => window.dispatchEvent(new Event('map-zoom-out'));
    const triggerResetView = () => window.dispatchEvent(new Event('map-reset-view'));

    const buttonClass = "w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-teal-700 transition-colors active:bg-slate-100 rounded-none border-b border-slate-200 last:border-b-0";

    return (
        <div className="flex flex-col items-end justify-end pointer-events-none w-full select-none">
            {/* Kontainer Frameless:
                Menggunakan display flex column untuk menumpuk aksi navigasi.
                Pointer-events-auto mengaktifkan interaksi pada komponen ini.
            */}
            <div className="pointer-events-auto flex flex-col bg-white border border-slate-300 shadow-md rounded-none overflow-hidden">
                <button
                    onClick={triggerZoomIn}
                    className={buttonClass}
                    aria-label="Perbesar Peta"
                    title="Perbesar"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>

                <button
                    onClick={triggerResetView}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-teal-700 transition-colors active:bg-slate-100 rounded-none border-b border-slate-200"
                    aria-label="Reset Fokus Peta"
                    title="Reset Fokus"
                >
                    <Maximize size={14} strokeWidth={2.5} />
                </button>

                <button
                    onClick={triggerZoomOut}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-teal-700 transition-colors active:bg-slate-100 rounded-none"
                    aria-label="Perkecil Peta"
                    title="Perkecil"
                >
                    <Minus size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}