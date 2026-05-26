// src/components/gis/panels/CategoryPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Activity,
    GraduationCap,
    BarChart4,
    Users,
    Info
} from "lucide-react";

// [REFACTOR] Import dipindahkan ke domain spesifik (mockIndicators)
import { MOCK_ATLAS_CATEGORIES } from "@/src/app/lib/mocks/mockIndicators";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { AtlasIndicatorBrief } from "@/src/app/types/atlas";

/**
 * CategoryPanel - GFW Paradigm (High-Density Data & Solid UI)
 * Menggunakan arsitektur Flush List tanpa margin kontainer internal.
 * Interaksi menggunakan UI Toggle Switch (bukan block button).
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

    // Logika Pseudo-Radio: Jika layer yang sama diklik, matikan (Toggle OFF)
    // Jika layer berbeda diklik, hidupkan dan timpa yang lama (Toggle ON)
    const handleIndicatorClick = (indicator: AtlasIndicatorBrief) => {
        if (activeIndicator === indicator.key) {
            setActiveIndicator(null);
        } else {
            setActiveIndicator(indicator.key);
            // Tetap buka panel konfigurasi di sebelah kanan untuk pengaturan layer lanjutan
            openPanel(
                "konfigurasi",
                `Layer: ${indicator.title}`,
                { indicatorKey: indicator.key }
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-white pb-10">

            {/* SECTION 1: SEARCH & FILTER (Solid & High-Density) */}
            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari indikator spasial..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        // Tipografi diubah ke font-medium (reguler), bukan bold/black
                        className="w-full bg-white border border-slate-200 rounded-none py-1.5 pl-8 pr-3 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
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

                                {/* Category Header - Rapat dan Solid (Aturan Densitas) */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <Icon size={14} className="text-teal-700" />
                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        {category.category_name}
                                    </h4>
                                </div>

                                {/* Indicators List - Flexbox Row (Toggle UI) */}
                                <div className="flex flex-col">
                                    {category.indicators.map((indicator) => {
                                        const isActive = activeIndicator === indicator.key;

                                        return (
                                            <button
                                                key={indicator.key}
                                                onClick={() => handleIndicatorClick(indicator)}
                                                // Background selalu putih solid, padding lebih rapat (py-2.5)
                                                className="group flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left w-full"
                                            >
                                                <div className="flex items-center gap-3">

                                                    {/* Custom UI Toggle Switch */}
                                                    <div
                                                        className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-teal-500' : 'bg-slate-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'
                                                                }`}
                                                        />
                                                    </div>

                                                    {/* Label Indikator (Tipografi Reguler/Medium) */}
                                                    <span
                                                        className={`text-[12px] transition-colors ${isActive
                                                            ? 'text-teal-800 font-medium'
                                                            : 'text-slate-700 font-normal group-hover:text-slate-900'
                                                            }`}
                                                    >
                                                        {indicator.title}
                                                    </span>
                                                </div>

                                                {/* Ikon Info di sebelah kanan (Aturan Interaksi) */}
                                                <div className="p-1 hover:bg-slate-200 rounded-none transition-colors" title="Lihat Metadata">
                                                    <Info size={14} className="text-slate-400 group-hover:text-teal-600" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State - High Density Typography */
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-4">
                        <div className="w-12 h-12 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                            <Search size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-slate-700">Tidak Ditemukan</p>
                            <p className="text-[11px] text-slate-500 font-normal">Coba kata kunci lain</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}