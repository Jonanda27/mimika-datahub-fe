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
 * LayerControl - GFW Paradigm (High-Density Data & Solid UI)
 * Desain tanpa card internal (Flush List). Lebar penuh, dipisahkan oleh hairline.
 * Menggunakan Toggle Switch UI untuk interaksi pemilihan.
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
        <div className="flex flex-col h-full pb-10 bg-white">

            {/* SECTION 1: BASEMAP GALLERY */}
            <div className="flex flex-col">
                {/* Header Section - Rapat dan Solid (Aturan Densitas) */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Layers size={14} className="text-teal-700" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Basemap Gallery</h4>
                </div>

                {/* List Items - Flush List dengan Custom Toggle */}
                <div className="flex flex-col">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                // Background selalu putih, hover state minimalis
                                className="group flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left w-full"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Custom UI Toggle Switch (Kiri) */}
                                    <div
                                        className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-teal-500' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'
                                                }`}
                                        />
                                    </div>

                                    {/* Icon & Label (Tengah - Tipografi Reguler/Medium) */}
                                    <div className="flex items-center gap-2.5">
                                        <div className={`transition-colors ${isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"}`}>
                                            <map.icon size={16} strokeWidth={2} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span
                                                className={`text-[12px] transition-colors ${isActive
                                                    ? 'text-teal-800 font-medium'
                                                    : 'text-slate-700 font-normal group-hover:text-slate-900'
                                                    }`}
                                            >
                                                {map.label}
                                            </span>
                                            <span className="text-[11px] font-normal text-slate-500">{map.desc}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ikon Info (Kanan) */}
                                <div className="p-1 hover:bg-slate-200 rounded-none transition-colors" title="Info Basemap">
                                    <Info size={14} className="text-slate-400 group-hover:text-teal-600" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: OPACITY CONTROL */}
            <div className="flex flex-col mt-0"> {/* Margin top dihilangkan agar rapat jika digabung */}
                {/* Header Section - Rapat dan Solid */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Settings2 size={14} className="text-teal-700" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">Opacity Control</h4>
                    </div>
                    <span className="text-[11px] font-medium text-teal-800 font-mono bg-teal-50 px-1.5 py-0.5 border border-teal-100">
                        {mapOpacity}%
                    </span>
                </div>

                {/* Slider Area - Spasi dirampingkan (py-3) */}
                <div className="px-4 py-3 border-b border-slate-200 bg-white space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mapOpacity}
                        onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        <span>Transparan</span>
                        <span>Solid</span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: LAYER CONTEXT INFO */}
            <div className="flex flex-col px-4 py-4 gap-1.5 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-400">
                    <Info size={14} strokeWidth={2} />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Feature Layer Info</h4>
                </div>
                <p className="text-[12px] text-slate-600 font-normal leading-relaxed text-justify">
                    Warna poligon (Choropleth) dan skala legenda dikalkulasi otomatis berdasarkan <strong className="text-slate-800 font-medium">Data Layer Sektoral</strong> yang aktif pada katalog data.
                </p>
            </div>

        </div>
    );
}