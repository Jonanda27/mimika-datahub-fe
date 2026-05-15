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
 * Tema Terang (Light Mode) untuk pembacaan analitik yang maksimal.
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
        <div className="flex flex-col h-full space-y-6">

            {/* SECTION 1: SEARCH & FILTER */}
            <div className="relative group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                    size={16}
                />
                <input
                    type="text"
                    placeholder="Cari indikator (mis: Stunting)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all shadow-sm"
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
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 shadow-sm">
                                        <Icon size={18} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                                        {category.category_name}
                                    </h4>
                                    <div className="flex-1 h-px bg-slate-200 ml-2" />
                                </div>

                                {/* Indicators List */}
                                <div className="grid gap-2">
                                    {category.indicators.map((indicator) => {
                                        const isActive = activeIndicator === indicator.key;

                                        return (
                                            <button
                                                key={indicator.key}
                                                onClick={() => handleIndicatorClick(indicator)}
                                                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all text-left active:scale-[0.98] ${isActive
                                                    ? 'bg-teal-50 border-teal-400 shadow-sm'
                                                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full transition-all ${isActive
                                                        ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]'
                                                        : 'bg-slate-300 group-hover:bg-slate-400'
                                                        }`} />
                                                    <span className={`text-sm transition-colors ${isActive
                                                        ? 'text-teal-800 font-black'
                                                        : 'text-slate-600 font-bold group-hover:text-slate-800'
                                                        }`}>
                                                        {indicator.title}
                                                    </span>
                                                </div>
                                                <ChevronRight
                                                    size={16}
                                                    className={`transition-all ${isActive ? 'text-teal-600 translate-x-1' : 'text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                            <Search size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">Indikator tidak ditemukan</p>
                            <p className="text-xs text-slate-500 font-medium">Coba gunakan kata kunci yang lebih umum.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}