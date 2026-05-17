// src/components/gis/panels/LayerControl.tsx
"use client";

import React from "react";
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
 * LayerControl - Flat Instrument Panel
 * Diratakan tanpa bayangan atau margin eksterior (Docked style).
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
        { id: "dark", label: "Kanvas Gelap", icon: Moon, desc: "Kontras Tinggi untuk Data Poligon" },
    ];

    return (
        <div className="flex flex-col h-full bg-white divide-y divide-slate-200">

            {/* SECTION 1: BASEMAP GALLERY */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-slate-500 px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <Layers size={14} className="text-teal-700" strokeWidth={2.5} />
                    <h4 className="text-[9px] font-black uppercase tracking-widest">Basemap Gallery</h4>
                </div>

                <div className="flex flex-col">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 transition-colors text-left
                                    ${isActive ? "bg-teal-50" : "bg-white hover:bg-slate-50"}`}
                            >
                                <div className={`w-8 h-8 rounded-none flex items-center justify-center transition-colors
                                    ${isActive ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <map.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[11px] uppercase tracking-tight ${isActive ? 'text-teal-900 font-black' : 'text-slate-800 font-bold'}`}>
                                        {map.label}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-500">{map.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: OPACITY CONTROL */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Settings2 size={14} className="text-teal-700" strokeWidth={2.5} />
                        <h4 className="text-[9px] font-black uppercase tracking-widest">Opacity Control</h4>
                    </div>
                    <span className="text-[10px] font-black text-slate-800 font-mono">{mapOpacity}%</span>
                </div>

                <div className="px-4 py-5 bg-white space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mapOpacity}
                        onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-none appearance-none cursor-pointer accent-teal-700"
                    />
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Transparan</span>
                        <span>Solid</span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: LAYER CONTEXT INFO */}
            <div className="px-4 py-4 bg-slate-50 space-y-2 border-b-0">
                <div className="flex items-center gap-2 text-slate-700">
                    <Info size={14} strokeWidth={2.5} />
                    <h4 className="text-[9px] font-black uppercase tracking-widest">Feature Layer Info</h4>
                </div>
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed text-justify">
                    Kalkulasi warna poligon dirender secara dinamis melalui data sektoral pada katalog *Data Layer*.
                </p>
            </div>

        </div>
    );
}