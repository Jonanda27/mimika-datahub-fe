// src/components/gis/MapHUD.tsx
"use client";

import React from "react";
import {
    Plus,
    Minus,
    Maximize,
    ShieldCheck,
    XCircle
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * MapHUD (Heads-Up Display) - The Interactive Overlay (Light Theme)
 * Komponen ini menampung kontrol peta kustom yang melayang di atas kanvas.
 * Terpisah dari engine Leaflet untuk fleksibilitas styling maksimal.
 */
export default function MapHUD() {
    // Menarik fungsi reset dari Store untuk membersihkan peta
    const { activeIndicator, resetMapData } = useExplorerStore();

    // Fungsi pemicu event kustom yang didengarkan oleh ExternalMapController di MimikaMap
    const triggerZoomIn = () => {
        window.dispatchEvent(new Event('map-zoom-in'));
    };

    const triggerZoomOut = () => {
        window.dispatchEvent(new Event('map-zoom-out'));
    };

    const triggerResetView = () => {
        // Event untuk mengembalikan kamera ke koordinat pusat Mimika
        window.dispatchEvent(new Event('map-reset-view'));
    };

    return (
        // Menggunakan flex-col dengan item rata kanan (items-end)
        // Lebar maksimal dihapus agar elemen bisa menyesuaikan isi tanpa dibatasi kotak 300px
        <div className="flex flex-col items-end justify-end gap-4 pointer-events-none w-full">
            <div className="pointer-events-auto">
                {/* =========================================================
                    WIDGET 2: RESET PETA (Konteks Dinamis)
                    Muncul di sebelah kiri dari tombol Zoom.
                ========================================================== */}
                {activeIndicator && (
                    <div className="pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={resetMapData}
                            className="bg-white/95 backdrop-blur-xl border-2 border-rose-100 shadow-xl px-4 py-3 rounded-2xl flex items-center gap-3 text-rose-500 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all group active:scale-95"
                            title="Hapus Analisis dan Kembalikan Peta ke Mode Default"
                        >
                            <XCircle size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                            <div className="flex flex-col items-start text-left">
                                <span className="text-xs font-black uppercase tracking-wider leading-none mb-0.5">
                                    Bersihkan Peta
                                </span>
                                <span className="text-[9px] font-semibold text-rose-400/80">
                                    Hapus Layer Analisis
                                </span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Container untuk aksi interaktif (Reset Analisis dan Navigasi Zoom) 
                Disusun sejajar secara horizontal (flex-row) agar tidak seperti "menara" */}
            <div className="flex flex-row items-end gap-4">

                {/* =========================================================
                    WIDGET 3: KONTROL NAVIGASI ZOOM (Pill Shape)
                    Digabung dalam satu wadah memanjang ke bawah untuk menghemat batas border.
                ========================================================== */}
                <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl overflow-hidden divide-y divide-slate-100">
                    <button
                        onClick={triggerZoomIn}
                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors active:bg-teal-100"
                        title="Perbesar Peta"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={triggerResetView}
                        className="w-12 h-10 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition-colors active:bg-teal-100 group"
                        title="Reset Fokus Wilayah"
                    >
                        <Maximize size={16} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={triggerZoomOut}
                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors active:bg-teal-100"
                        title="Perkecil Peta"
                    >
                        <Minus size={20} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </div>
    );
}