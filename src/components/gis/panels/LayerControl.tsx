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

/**
 * LayerControl - Pengaturan Lapisan & Legenda Visual
 * Memungkinkan user mengatur base-map, transparansi data, dan skema warna.
 */
export default function LayerControl() {
    const [opacity, setOpacity] = useState(70);
    const [activeBaseMap, setActiveBaseMap] = useState("satellite");
    const [showLabels, setShowLabels] = useState(true);

    // Definisi Base Maps (Indirection untuk kemudahan ekspansi)
    const baseMaps = [
        { id: "satellite", label: "Satelit", icon: Sun, desc: "Citra resolusi tinggi" },
        { id: "dark", label: "Gelap", icon: Moon, desc: "Kontras tinggi untuk data" },
        { id: "street", label: "Jalan", icon: MapIcon, desc: "Peta navigasi standar" },
    ];

    return (
        <div className="flex flex-col h-full space-y-8 pb-10">

            {/* SECTION 1: BASE MAP SELECTOR */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40 px-1">
                    <Layers size={14} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Pilih Dasar Peta</h4>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {baseMaps.map((map) => (
                        <button
                            key={map.id}
                            onClick={() => setActiveBaseMap(map.id)}
                            className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left
                ${activeBaseMap === map.id
                                    ? "bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                ${activeBaseMap === map.id ? "bg-blue-500 text-white" : "bg-white/5"}`}>
                                <map.icon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{map.label}</span>
                                <span className="text-[10px] opacity-50 font-medium">{map.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* SECTION 2: DATA OPACITY CONTROL */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-white/40">
                        <Settings2 size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Transparansi Data</h4>
                    </div>
                    <span className="text-xs font-black text-blue-400 font-mono">{opacity}%</span>
                </div>

                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                        <span>Transparan</span>
                        <span>Solid</span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: VISIBILITY TOGGLES */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40 px-1">
                    <Palette size={14} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Elemen Visual</h4>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => setShowLabels(!showLabels)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            {showLabels ? <Eye className="text-blue-400" size={18} /> : <EyeOff className="text-white/20" size={18} />}
                            <span className={`text-sm font-medium ${showLabels ? 'text-white' : 'text-white/40'}`}>Label Nama Distrik</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full p-1 transition-colors ${showLabels ? 'bg-blue-600' : 'bg-white/10'}`}>
                            <div className={`w-2 h-2 bg-white rounded-full transition-transform ${showLabels ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* SECTION 4: KETERANGAN LEGENDA (Dynamic Simulation) */}
            <div className="p-5 glass-morphism border-blue-500/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                    <Info size={14} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Legenda Aktif</h4>
                </div>
                <div className="space-y-3">
                    <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                        Warna poligon merepresentasikan <span className="text-white">Densitas Dataset</span>.
                    </p>
                    <div className="flex items-center gap-1 w-full h-2 rounded-full overflow-hidden">
                        <div className="flex-1 h-full bg-blue-900" />
                        <div className="flex-1 h-full bg-blue-700" />
                        <div className="flex-1 h-full bg-blue-500" />
                        <div className="flex-1 h-full bg-blue-300" />
                        <div className="flex-1 h-full bg-blue-100" />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase">
                        <span>Rendah</span>
                        <span>Tinggi</span>
                    </div>
                </div>
            </div>

        </div>
    );
}