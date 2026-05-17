// src/components/gis/panels/LayerControl.tsx
"use client";

import React, { useState } from "react";
import {
    Layers,
    Settings2,
    Map as MapIcon,
    Sun,
    Moon,
    Info
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * LayerControl - Pengaturan Lapisan & Legenda Visual (Frameless/Sharp UI)
 * Menggunakan terminologi GIS standar.
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
        <div className="flex flex-col h-full space-y-8 pb-10">

            {/* SECTION 1: BASEMAP GALLERY */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 px-1">
                    <Layers size={16} className="text-teal-700" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Basemap Gallery</h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                className={`flex items-center gap-4 p-3 rounded-none border transition-all text-left shadow-none
                                    ${isActive
                                        ? "bg-slate-50 border-teal-700"
                                        : "bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-none flex items-center justify-center transition-colors shadow-none
                                    ${isActive ? "bg-teal-700 text-white border-none" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                                    <map.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-black ${isActive ? 'text-teal-800' : 'text-slate-800'}`}>
                                        {map.label}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500">{map.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: OPACITY CONTROL */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Settings2 size={16} className="text-teal-700" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Opacity Control</h4>
                    </div>
                    <span className="text-xs font-black text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded-none border border-slate-300">{mapOpacity}%</span>
                </div>

                <div className="p-5 bg-white border border-slate-300 shadow-none rounded-none space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mapOpacity}
                        onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-teal-700 shadow-none"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>0% (Transparan)</span>
                        <span>100% (Solid)</span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: LAYER CONTEXT INFO */}
            <div className="p-5 bg-slate-50 border border-slate-300 shadow-none rounded-none space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                    <Info size={16} strokeWidth={2.5} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Feature Layer Info</h4>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed text-justify">
                    Warna poligon (Choropleth) dan skala legenda akan dikalkulasi secara otomatis berdasarkan <span className="text-slate-900 font-black">Data Layer Sektoral</span> yang aktif pada katalog data.
                </p>
            </div>

        </div>
    );
}