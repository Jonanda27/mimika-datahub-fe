// src/components/gis/panels/CategoryPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    ChevronRight,
    Activity,
    GraduationCap,
    BarChart4,
    Users,
    Info,
    CheckCircle2
} from "lucide-react";
import { MOCK_ATLAS_CATEGORIES } from "@/src/app/lib/mockExplorerData";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { AtlasIndicatorBrief } from "@/src/app/types/atlas";

/**
 * CategoryPanel - Komponen untuk memilih kategori dan indikator data.
 * Memungkinkan user melakukan pencarian lintas sektoral.
 * Terintegrasi dengan ExplorerStore untuk memicu update pada Map & Panel lain.
 */
export default function CategoryPanel() {
    const [searchQuery, setSearchQuery] = useState("");
    const { openPanel } = useExplorerStore();

    // Mapping Icon berdasarkan ID Kategori (Information Expert)
    const categoryIcons: Record<number, any> = {
        1: Activity,      // Kesehatan
        2: BarChart4,     // Ekonomi
        3: Users,         // Sosial & Kependudukan
        4: GraduationCap, // Pendidikan (contoh tambahan)
    };

    // Logika Pencarian Indikator (Client-side filtering for speed)
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return MOCK_ATLAS_CATEGORIES;

        return MOCK_ATLAS_CATEGORIES.map(cat => ({
            ...cat,
            indicators: cat.indicators.filter(ind =>
                ind.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.indicators.length > 0);
    }, [searchQuery]);

    const handleIndicatorClick = (indicator: AtlasIndicatorBrief) => {
        // 1. Perintahkan Map untuk memuat data Choropleth (via logic di phase selanjutnya)
        console.log(`Mengaktifkan Indikator: ${indicator.key}`);

        // 2. Buka Panel Konfigurasi/Legenda untuk indikator tersebut
        openPanel(
            "indicator-config",
            `Analisa: ${indicator.title}`,
            { indicatorKey: indicator.key }
        );
    };

    return (
        <div className="flex flex-col h-full space-y-6">

            {/* SECTION 1: SEARCH & FILTER */}
            <div className="relative group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors"
                    size={16}
                />
                <input
                    type="text"
                    placeholder="Cari indikator (mis: Stunting)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                />
            </div>

            {/* SECTION 2: CATEGORY LIST */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                        const Icon = categoryIcons[category.category_id] || Info;

                        return (
                            <div key={category.category_id} className="space-y-4">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 px-1">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <Icon size={18} />
                                    </div>
                                    <h4 className="text-xs font-black text-white/80 uppercase tracking-widest">
                                        {category.category_name}
                                    </h4>
                                    <div className="flex-1 h-px bg-white/5 ml-2" />
                                </div>

                                {/* Indicators List */}
                                <div className="grid gap-2">
                                    {category.indicators.map((indicator) => (
                                        <button
                                            key={indicator.key}
                                            onClick={() => handleIndicatorClick(indicator)}
                                            className="group flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all text-left active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                    {indicator.title}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className="text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                            <Search size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white/60">Indikator tidak ditemukan</p>
                            <p className="text-xs text-white/30">Coba gunakan kata kunci yang lebih umum.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 3: FOOTER INFO */}
            <div className="pt-6 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[11px] font-black text-white uppercase tracking-tight">Kesiapan Data</p>
                        <p className="text-[10px] text-white/40 leading-relaxed">
                            Seluruh indikator telah divalidasi oleh tim <span className="text-blue-400">Bappeda Mimika</span> untuk periode tahun 2025/2026.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}