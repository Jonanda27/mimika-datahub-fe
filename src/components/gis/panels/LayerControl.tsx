// src/components/gis/panels/LayerControl.tsx
"use client";

import React from "react";
import {
    Layers,
    Settings2,
    Map as MapIcon,
    Sun,
    Moon,
    Info,
    Check
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * LayerControl - Edge-to-Edge / Frameless Paradigm
 * Desain tanpa card internal (Flush List). Lebar penuh, dipisahkan oleh hairline.
 */
export default function LayerControl() {
    const {
        mapOpacity,
        setMapOpacity,
        activeBaseMap,
        setActiveBaseMap
    } = useExplorerStore();

    const baseMaps = [
        { id: "satellite", label: "Satelit Resolusi Tinggi", icon: Sun, desc: "Citra Raster Google (Default)" },
        { id: "street", label: "Peta Jalan (Roadmap)", icon: MapIcon, desc: "Navigasi Standar Vektor" },
        { id: "dark", label: "Kanvas Gelap (Dark Mode)", icon: Moon, desc: "Kontras Tinggi untuk Data Poligon" },
    ];

    return (
        // Container utama membuang p-4 agar elemen di dalamnya bisa menyentuh tepi (edge-to-edge)
        <div className="flex flex-col h-full pb-10 bg-white">

            {/* SECTION 1: BASEMAP GALLERY */}
            <div className="flex flex-col">
                {/* Header Section - Edge to Edge */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Layers size={14} className="text-teal-700" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Basemap Gallery</h4>
                </div>

                {/* List Items - Tanpa Card, Lebar Penuh */}
                <div className="flex flex-col">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                className={`group flex items-center justify-between px-4 py-3.5 border-b border-slate-200 transition-colors text-left w-full
                                    ${isActive
                                        ? "bg-teal-50/30"
                                        : "bg-transparent hover:bg-slate-50 active:bg-slate-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    {/* Icon Indicator (Tanpa Kotak) */}
                                    <div className={`transition-colors ${isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"}`}>
                                        <map.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <span className={`text-[12px] font-bold tracking-tight ${isActive ? 'text-teal-900' : 'text-slate-800 group-hover:text-slate-900'}`}>
                                            {map.label}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500">{map.desc}</span>
                                    </div>
                                </div>

                                {/* Active Checkmark (Menggantikan Border Tebal) */}
                                {isActive && (
                                    <Check size={16} strokeWidth={3} className="text-teal-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: OPACITY CONTROL */}
            <div className="flex flex-col mt-4">
                {/* Header Section - Edge to Edge */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-y border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Settings2 size={14} className="text-teal-700" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Opacity Control</h4>
                    </div>
                    <span className="text-[10px] font-black text-teal-800 font-mono bg-teal-100 px-1.5 py-0.5">{mapOpacity}%</span>
                </div>

                {/* Slider Area - Tanpa Box Tambahan */}
                <div className="px-4 py-5 border-b border-slate-200 bg-white space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mapOpacity}
                        onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Transparan</span>
                        <span>Solid</span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: LAYER CONTEXT INFO */}
            <div className="flex flex-col px-4 py-5 gap-2 bg-transparent">
                <div className="flex items-center gap-2 text-slate-400">
                    <Info size={14} strokeWidth={2.5} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Feature Layer Info</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed text-justify">
                    Warna poligon (Choropleth) dan skala legenda dikalkulasi otomatis berdasarkan <strong className="text-slate-700 font-bold">Data Layer Sektoral</strong> yang aktif pada katalog data.
                </p>
            </div>

        </div>
    );
}