// src/components/gis/panels/AssetPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    MapPin,
    Building2,
    ChevronDown,
    CheckSquare,
    Square
} from "lucide-react";
import { ASSET_TAXONOMY_CONFIG } from "@/src/app/lib/assetConfig";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * AssetPanel - GFW Paradigm (High-Density Data & Solid UI)
 * Bertindak sebagai antarmuka katalog Sebaran Aset Fisik (GeoTagging).
 * Menggunakan arsitektur Frameless Flush List yang menyatu dengan panel.
 */
export default function AssetPanel() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOpd, setExpandedOpd] = useState<string | null>("dinas_kesehatan");

    // Atomic Selectors untuk reaktivitas array yang stabil di Next.js
    const activeAssetLayers = useExplorerStore((state) => state.activeAssetLayers);
    const toggleAssetLayer = useExplorerStore((state) => state.toggleAssetLayer);
    const toggleOpdAssets = useExplorerStore((state) => state.toggleOpdAssets);

    const safeActiveLayers = activeAssetLayers || [];

    // Filter pencarian berdasarkan nama instansi atau jenis aset
    const filteredTaxonomy = useMemo(() => {
        if (!searchQuery) return ASSET_TAXONOMY_CONFIG;
        const lowerQuery = searchQuery.toLowerCase();

        return ASSET_TAXONOMY_CONFIG.filter(opd =>
            opd.opdName.toLowerCase().includes(lowerQuery) ||
            opd.categories.some(cat => cat.label.toLowerCase().includes(lowerQuery))
        );
    }, [searchQuery]);

    return (
        <div className="flex flex-col h-full bg-white pb-10">

            {/* SECTION 1: SEARCH & FILTER (Solid & High-Density) */}
            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari instansi atau jenis aset..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none py-1.5 pl-8 pr-3 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                </div>
            </div>

            {/* SECTION 2: ASSET CATALOG LIST (Frameless Flush List) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                {/* Header Petunjuk (Konteks GeoTagging) */}
                <div className="px-4 py-3 bg-teal-50/50 border-b border-slate-200 flex items-start gap-2.5">
                    <MapPin size={14} className="text-teal-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                        Nyalakan sakelar untuk menampilkan sebaran titik aset fisiknya di atas kanvas spasial. Titik akan dikelompokkan otomatis (Clustering).
                    </p>
                </div>

                {filteredTaxonomy.length > 0 ? (
                    filteredTaxonomy.map((opd) => {
                        const isExpanded = expandedOpd === opd.opdKey;
                        const opdLayerIds = opd.categories.map(c => `${opd.opdKey}::${c.type}`);

                        const isAllActive = opdLayerIds.length > 0 && opdLayerIds.every(id => safeActiveLayers.includes(id));
                        const isSomeActive = opdLayerIds.some(id => safeActiveLayers.includes(id)) && !isAllActive;

                        return (
                            <div key={opd.opdKey} className="flex flex-col">

                                {/* Rumpun OPD Header (Frameless) */}
                                <div className="flex items-center justify-between bg-slate-50 px-4 py-2 border-b border-slate-200 transition-colors">
                                    <button
                                        className="flex items-center gap-2 flex-1 text-left"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setExpandedOpd(isExpanded ? null : opd.opdKey);
                                        }}
                                    >
                                        <ChevronDown
                                            size={14}
                                            className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                        <Building2 size={13} className="text-teal-700" />
                                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider truncate">
                                            {opd.opdName}
                                        </h4>
                                    </button>

                                    {/* Master Toggle */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            toggleOpdAssets(opd.opdKey, opd.categories.map(c => c.type), !isAllActive);
                                        }}
                                        className="ml-2 text-teal-600 hover:text-teal-800 active:scale-95 transition-transform"
                                        title={isAllActive ? "Matikan Semua" : "Nyalakan Semua"}
                                    >
                                        {isAllActive ? (
                                            <CheckSquare size={15} />
                                        ) : isSomeActive ? (
                                            <div className="w-3.75 h-3.75 border-2 border-teal-600 flex items-center justify-center rounded-xs bg-white">
                                                <div className="w-1.5 h-1.5 bg-teal-600" />
                                            </div>
                                        ) : (
                                            <Square size={15} className="text-slate-300" />
                                        )}
                                    </button>
                                </div>

                                {/* Instansi List - Flush List */}
                                {isExpanded && (
                                    <div className="flex flex-col bg-white">
                                        {opd.categories.map((cat) => {
                                            const layerId = `${opd.opdKey}::${cat.type}`;
                                            const isActive = safeActiveLayers.includes(layerId);

                                            return (
                                                <button
                                                    key={layerId}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleAssetLayer(opd.opdKey, cat.type);
                                                    }}
                                                    className={`group flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left w-full ${isActive ? "bg-teal-50/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Custom UI Toggle Switch Asli */}
                                                        <div
                                                            className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-teal-500' : 'bg-slate-300'}`}
                                                        >
                                                            <span
                                                                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`}
                                                            />
                                                        </div>

                                                        {/* Label Aset */}
                                                        <span
                                                            className={`text-[11px] transition-colors ${isActive
                                                                ? 'text-teal-800 font-bold'
                                                                : 'text-slate-600 font-medium group-hover:text-slate-900'
                                                                }`}
                                                        >
                                                            {cat.label}
                                                        </span>
                                                    </div>

                                                    {/* Indikator Visual Ikon */}
                                                    <div className="p-1 transition-colors flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full shadow-sm"
                                                            style={{ backgroundColor: cat.color }}
                                                            title={`Warna Marker: ${cat.label}`}
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
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
                            <p className="text-[12px] font-bold text-slate-700">Instansi Tidak Ditemukan</p>
                            <p className="text-[11px] text-slate-500 font-normal">Coba kata kunci pencarian lain</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}