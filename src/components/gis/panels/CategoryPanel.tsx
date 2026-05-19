// src/components/gis/panels/CategoryPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Info,
    ChevronDown,
    HeartPulse,
    HardHat,
    LineChart,
    Building2,
    Tent,
    GitBranch,
    Droplets,
    Map,
    MapPin
} from "lucide-react";
import {
    MOCK_OPDS,
    MOCK_POLYGON_LAYERS,
    MOCK_ASSET_LAYERS
} from "@/src/app/lib/mockExplorerData";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

// Dictionary pemetaan string (dari DB) ke Komponen Ikon Lucide
const IconRegistry: Record<string, any> = {
    HeartPulse,
    HardHat,
    LineChart,
    Building2,
    Tent,
    GitBranch,
    Droplets
};

/**
 * CategoryPanel (Refactored to OPD-Centric Accordion) - GFW Paradigm
 * Desain: High-Density, Sharp Edges (rounded-none), Pemisahan Mutlak Poligon vs Aset.
 */
export default function CategoryPanel() {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        openPanel,
        expandedOpdId, setExpandedOpd,
        activeChoropleth, setChoroplethLayer,
        activeAssetLayers, toggleAssetLayer
    } = useExplorerStore();

    // Filter OPD berdasarkan nama OPD atau nama layer yang dimilikinya
    const filteredOPDs = useMemo(() => {
        if (!searchQuery) return MOCK_OPDS;
        const query = searchQuery.toLowerCase();

        return MOCK_OPDS.filter(opd => {
            const matchOpdName = opd.name.toLowerCase().includes(query) || (opd.acronym && opd.acronym.toLowerCase().includes(query));
            const matchPolygons = MOCK_POLYGON_LAYERS.some(p => p.opd_id === opd.id && p.name.toLowerCase().includes(query));
            const matchAssets = MOCK_ASSET_LAYERS.some(a => a.opd_id === opd.id && a.name.toLowerCase().includes(query));

            return matchOpdName || matchPolygons || matchAssets;
        });
    }, [searchQuery]);

    // Membuka panel detail/konfigurasi metadata tanpa mem-forcing toggle layer
    const openMetadataPanel = (e: React.MouseEvent, title: string, type: 'polygon' | 'asset', id: string) => {
        e.stopPropagation(); // Mencegah event merambat ke tombol toggle
        openPanel("konfigurasi", `Metadata: ${title}`, { type, id });
    };

    return (
        <div className="flex flex-col h-full bg-white pb-10">

            {/* SECTION 1: SEARCH & FILTER (Solid & High-Density) */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari instansi atau nama data..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none py-2 pl-8 pr-3 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* SECTION 2: ACCORDION OPD LIST (Flush List) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {filteredOPDs.length > 0 ? (
                    filteredOPDs.map((opd) => {
                        const OpdIcon = IconRegistry[opd.default_icon] || Building2;
                        const isExpanded = expandedOpdId === opd.id;

                        // Ekstraksi layer milik OPD ini
                        const opdPolygons = MOCK_POLYGON_LAYERS.filter(p => p.opd_id === opd.id);
                        const opdAssets = MOCK_ASSET_LAYERS.filter(a => a.opd_id === opd.id);

                        return (
                            <div key={opd.id} className="flex flex-col border-b border-slate-200">

                                {/* Accordion Header: Identitas OPD */}
                                <button
                                    onClick={() => setExpandedOpd(isExpanded ? null : opd.id)}
                                    className={`flex items-center justify-between px-4 py-3 w-full text-left transition-colors rounded-none outline-none
                                        ${isExpanded ? 'bg-slate-800 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 flex items-center justify-center rounded-none"
                                            style={{ backgroundColor: isExpanded ? 'rgba(255,255,255,0.1)' : opd.theme_color + '20' }}
                                        >
                                            <OpdIcon size={14} color={isExpanded ? '#ffffff' : opd.theme_color} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[12px] font-black tracking-tight leading-tight ${isExpanded ? 'text-white' : 'text-slate-800'}`}>
                                                {opd.acronym || opd.name}
                                            </span>
                                            <span className={`text-[9px] font-medium tracking-wider uppercase ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {opdPolygons.length} Poligon • {opdAssets.length} Aset
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : 'text-slate-400'}`}
                                    />
                                </button>

                                {/* Accordion Body: Dual-Layering Toggles */}
                                {isExpanded && (
                                    <div className="flex flex-col bg-slate-50 shadow-inner">

                                        {/* BLOK 1: STATISTIK WILAYAH (Single-Selection) */}
                                        {opdPolygons.length > 0 && (
                                            <div className="flex flex-col pt-3 pb-1 border-b border-slate-200/50">
                                                <div className="px-5 mb-2 flex items-center gap-1.5 text-slate-400">
                                                    <Map size={12} strokeWidth={2.5} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Statistik Wilayah (Single)</span>
                                                </div>
                                                {opdPolygons.map(poly => {
                                                    const isActive = activeChoropleth === poly.id;
                                                    return (
                                                        <div key={poly.id} className="flex items-center justify-between px-5 py-2 hover:bg-slate-100 transition-colors group">
                                                            <button
                                                                onClick={() => setChoroplethLayer(isActive ? null : poly.id)}
                                                                className="flex items-center gap-3 flex-1 text-left"
                                                            >
                                                                <div className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-none transition-colors duration-200 ease-in-out ${isActive ? 'bg-slate-800' : 'bg-slate-300 border border-slate-400'}`}>
                                                                    <span className={`inline-block h-2.5 w-2.5 transform rounded-none bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-[2px]'}`} />
                                                                </div>
                                                                <span className={`text-[11px] leading-tight ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium group-hover:text-slate-900'}`}>
                                                                    {poly.name}
                                                                </span>
                                                            </button>
                                                            <button onClick={(e) => openMetadataPanel(e, poly.name, 'polygon', poly.id)} className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors">
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* BLOK 2: ASET FISIK (Multi-Selection) */}
                                        {opdAssets.length > 0 && (
                                            <div className="flex flex-col pt-3 pb-2">
                                                <div className="px-5 mb-2 flex items-center gap-1.5 text-slate-400">
                                                    <MapPin size={12} strokeWidth={2.5} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aset Fisik (Multi)</span>
                                                </div>
                                                {opdAssets.map(asset => {
                                                    const isActive = activeAssetLayers.includes(asset.id);
                                                    const AssetIcon = IconRegistry[asset.icon_name] || MapPin;

                                                    return (
                                                        <div key={asset.id} className="flex items-center justify-between px-5 py-2 hover:bg-slate-100 transition-colors group">
                                                            <button
                                                                onClick={() => toggleAssetLayer(asset.id)}
                                                                className="flex items-center gap-3 flex-1 text-left"
                                                            >
                                                                {/* Custom Checkbox/Toggle untuk Multi-Select */}
                                                                <div
                                                                    className={`w-3.5 h-3.5 border flex items-center justify-center rounded-none transition-colors duration-200 ${isActive ? 'border-transparent' : 'border-slate-400 bg-slate-200'}`}
                                                                    style={{ backgroundColor: isActive ? (asset.color || opd.theme_color) : '' }}
                                                                >
                                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-none" />}
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <AssetIcon size={12} color={asset.color || opd.theme_color} />
                                                                    <span className={`text-[11px] leading-tight ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium group-hover:text-slate-900'}`}>
                                                                        {asset.name}
                                                                    </span>
                                                                </div>
                                                            </button>
                                                            <button onClick={(e) => openMetadataPanel(e, asset.name, 'asset', asset.id)} className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors">
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Empty State khusus jika OPD tidak memiliki data sama sekali */}
                                        {opdPolygons.length === 0 && opdAssets.length === 0 && (
                                            <div className="px-5 py-4 text-center">
                                                <span className="text-[10px] text-slate-400 font-medium italic">Belum ada data spasial untuk instansi ini.</span>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    /* Empty State Global - Jika pencarian tidak ada hasil */
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-4">
                        <div className="w-12 h-12 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                            <Search size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-slate-700">Instansi Tidak Ditemukan</p>
                            <p className="text-[11px] text-slate-500 font-normal">Coba kata kunci akronim lain (Cth: DINKES)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}