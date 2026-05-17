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
    Info
} from "lucide-react";
import { MOCK_ATLAS_CATEGORIES } from "@/src/app/lib/mockExplorerData";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { AtlasIndicatorBrief } from "@/src/app/types/atlas";

/**
 * CategoryPanel - Flat & Dense Indicator List
 * Tema terang yang terkompaksi tanpa margin pembatas luar (GFW Style).
 * Menempel solid ke drawer.
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
        <div className="flex flex-col h-full bg-white">

            {/* SECTION 1: SEARCH & FILTER (Flat Design) */}
            <div className="relative group border-b border-slate-200 shrink-0">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-700 transition-colors"
                    size={16}
                    strokeWidth={2.5}
                />
                <input
                    type="text"
                    placeholder="Cari indikator sektoral..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-none rounded-none py-4 pl-11 pr-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:bg-slate-50 transition-all shadow-none"
                />
            </div>

            {/* SECTION 2: CATEGORY LIST (Zero Margin) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                        const Icon = categoryIcons[category.category_id] || Info;

                        return (
                            <div key={category.category_id} className="border-b border-slate-200 last:border-b-0">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                                    <div className="text-teal-700">
                                        <Icon size={16} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                                        {category.category_name}
                                    </h4>
                                </div>

                                {/* Indicators List (Flat Rows) */}
                                <div className="flex flex-col">
                                    {category.indicators.map((indicator) => {
                                        const isActive = activeIndicator === indicator.key;

                                        return (
                                            <button
                                                key={indicator.key}
                                                onClick={() => handleIndicatorClick(indicator)}
                                                className={`group flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-b-0 transition-colors text-left ${isActive
                                                    ? 'bg-teal-50'
                                                    : 'bg-white hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-none transition-colors ${isActive ? 'bg-teal-600' : 'bg-slate-300 group-hover:bg-slate-400'
                                                        }`} />
                                                    <span className={`text-[11px] uppercase tracking-tight transition-colors ${isActive ? 'text-teal-900 font-black' : 'text-slate-700 font-bold group-hover:text-slate-900'
                                                        }`}>
                                                        {indicator.title}
                                                    </span>
                                                </div>
                                                <ChevronRight
                                                    size={14}
                                                    strokeWidth={2.5}
                                                    className={`transition-transform ${isActive ? 'text-teal-700 translate-x-1' : 'text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1'
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
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <div className="text-slate-300 mb-2">
                            <Search size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Indikator Tidak Ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}