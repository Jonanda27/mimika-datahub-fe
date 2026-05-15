// src/components/gis/panels/LayerControl.tsx
"use client";

import React, { useState } from "react";
import {
    Layers,
    Eye,
    EyeOff,
    Settings2,
    Map as MapIcon,
    Sun,
    Moon,
    Palette,
    Info
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * LayerControl - Pengaturan Lapisan & Legenda Visual (Light Theme)
 * Tema terang yang selaras dengan GFW.
 */
export default function LayerControl() {
    const {
        mapOpacity,
        setMapOpacity,
        activeBaseMap,
        setActiveBaseMap
    } = useExplorerStore();

    const [showLabels, setShowLabels] = useState(true);

    const baseMaps = [
        { id: "satellite", label: "Satelit", icon: Sun, desc: "Citra resolusi tinggi" },
        { id: "street", label: "Jalan", icon: MapIcon, desc: "Peta navigasi standar" },
        { id: "dark", label: "Gelap", icon: Moon, desc: "Kontras tinggi untuk data" },
    ];

    return (
        <div className="flex flex-col h-full space-y-8 pb-10">

            {/* SECTION 1: BASE MAP SELECTOR */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 px-1">
                    <Layers size={16} className="text-teal-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Pilih Dasar Peta</h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left shadow-sm
                                    ${isActive
                                        ? "bg-teal-50 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm
                                    ${isActive ? "bg-teal-600 text-white border-teal-700" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                    <map.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-black ${isActive ? 'text-teal-800' : 'text-slate-700'}`}>
                                        {map.label}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">{map.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: DATA OPACITY CONTROL */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Settings2 size={16} className="text-teal-600" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Transparansi Data</h4>
                    </div>
                    <span className="text-xs font-black text-teal-600 font-mono bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">{mapOpacity}%</span>
                </div>

                <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mapOpacity}
                        onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 shadow-inner"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>Transparan</span>
                        <span>Solid</span>
                    </div>
                </div>
            </div>

            {/* SECTION 4: KETERANGAN INFO */}
            <div className="p-5 bg-teal-50 border border-teal-100 shadow-sm rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-teal-700">
                    <Info size={16} strokeWidth={2.5} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Konteks Analisis</h4>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed text-justify">
                    Warna poligon dan skala legenda akan menyesuaikan secara otomatis berdasarkan kategori <span className="text-teal-700 font-bold">Indikator Sektoral</span> yang sedang Anda pilih di panel Kategori.
                </p>
            </div>

        </div>
    );
}