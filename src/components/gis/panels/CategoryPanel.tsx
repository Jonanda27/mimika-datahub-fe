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
    Check
} from "lucide-react";
import { MOCK_ATLAS_CATEGORIES } from "@/src/app/lib/mockExplorerData";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { AtlasIndicatorBrief } from "@/src/app/types/atlas";

/**
 * CategoryPanel - Edge-to-Edge / Frameless Paradigm
 * Menggunakan arsitektur Flush List tanpa margin kontainer internal.
 */
export default function CategoryPanel() {
    const [searchQuery, setSearchQuery] = useState("");
    const { openPanel, activeIndicator, setActiveIndicator } = useExplorerStore();

    const categoryIcons: Record<number, any> = {
        1: Activity,
        2: BarChart4,
        3: Users,
        4: GraduationCap,
    };

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
        setActiveIndicator(indicator.key);
        openPanel(
            "konfigurasi",
            `Analisa: ${indicator.title}`,
            { indicatorKey: indicator.key }
        );
    };

    return (
        // Menghapus p-4 agar layout melebar penuh ke tepi (edge-to-edge)
        <div className="flex flex-col h-full bg-white pb-10">

            {/* SECTION 1: SEARCH & FILTER (Full Width Container) */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                <div className="relative group">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari indikator spasial..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none py-2.5 pl-9 pr-4 text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-none"
                    />
                </div>
            </div>

            {/* SECTION 2: CATEGORY LIST (Flush List) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                        const Icon = categoryIcons[category.category_id] || Info;

                        return (
                            <div key={category.category_id} className="flex flex-col">

                                {/* Category Header - Edge to Edge */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <Icon size={14} className="text-teal-700" />
                                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                                        {category.category_name}
                                    </h4>
                                </div>

                                {/* Indicators List - Flush Items (Lebar penuh, dibatasi border-b) */}
                                <div className="flex flex-col">
                                    {category.indicators.map((indicator) => {
                                        const isActive = activeIndicator === indicator.key;

                                        return (
                                            <button
                                                key={indicator.key}
                                                onClick={() => handleIndicatorClick(indicator)}
                                                className={`group flex items-center justify-between px-4 py-3.5 border-b border-slate-200 transition-colors text-left w-full
                                                    ${isActive
                                                        ? 'bg-teal-50/30'
                                                        : 'bg-transparent hover:bg-slate-50 active:bg-slate-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[11px] uppercase tracking-wide transition-colors ${isActive
                                                        ? 'text-teal-800 font-black'
                                                        : 'text-slate-600 font-bold group-hover:text-slate-900'
                                                        }`}>
                                                        {indicator.title}
                                                    </span>
                                                </div>

                                                {/* Indikator Status: Checkmark (Aktif) atau Chevron (Inaktif) */}
                                                {isActive ? (
                                                    <Check size={14} strokeWidth={3} className="text-teal-600" />
                                                ) : (
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State - Dipertahankan di tengah tapi mengikuti grid */
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 px-4">
                        <div className="w-14 h-14 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 shadow-none">
                            <Search size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Tidak Ditemukan</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Coba kata kunci lain</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}