// src/components/gis/panels/DetailPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    MapPin,
    Users,
    Maximize2,
    History,
    FileText,
    AlertCircle,
    TrendingUp
} from "lucide-react";
import { gisService } from "@/src/app/services/gis.service";
import { DistrictDrilldownResponse } from "@/src/app/types/gis";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

interface DetailPanelProps {
    districtId: number;
    districtName: string;
}

/**
 * DetailPanel - Ultra-Dense Information Dashboard (GFW Paradigm)
 * Interior: Frameless, padat, tanpa margin berlebih.
 * Eksterior: Memiliki drop-shadow & border radius untuk efek Floating Card.
 */
export default function DetailPanel({ districtId, districtName }: DetailPanelProps) {
    const { activeDetailTab, setActiveDetailTab } = useExplorerStore();

    const [data, setData] = useState<DistrictDrilldownResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setAnimateBars(false);

        const loadDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await gisService.fetchDistrictDrilldown(districtId);
                if (isMounted) setData(response);
            } catch (err) {
                if (isMounted) setError("Gagal memuat profil wilayah.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadDetail();
        return () => { isMounted = false; };
    }, [districtId]);

    // Animasi chart saat masuk ke tab analisis
    useEffect(() => {
        if (activeDetailTab === "analisis" && data) {
            setTimeout(() => setAnimateBars(true), 50);
        } else {
            setAnimateBars(false);
        }
    }, [activeDetailTab, data]);

    const totalDatasets = data ? data.categories.reduce((acc, curr) => acc + curr.total, 0) : 0;
    const maxCategoryValue = data && data.categories.length > 0
        ? Math.max(...data.categories.map(c => c.total))
        : 1;

    const getCategoryColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kesehatan')) return 'bg-rose-600';
        if (lowerName.includes('ekonomi')) return 'bg-teal-600';
        if (lowerName.includes('infrastruktur')) return 'bg-amber-500';
        if (lowerName.includes('pendidikan')) return 'bg-blue-600';
        return 'bg-slate-600';
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse p-4 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-xl h-full">
                <div className="h-6 w-full bg-slate-200 rounded-md" />
                <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-3 w-full bg-slate-200 rounded-md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center p-4 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-xl h-full">
                <AlertCircle className="text-rose-600 mb-3" size={28} />
                <p className="text-xs font-bold text-slate-700">{error}</p>
            </div>
        );
    }

    return (
        // INJEKSI TARGET: Drop-shadow luar, border halus, dan rounded-xl
        <div className="flex flex-col w-full h-full bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden pointer-events-auto">

            {/* HEADER TABS - FLAT & SHARP */}
            <div className="flex border-b border-slate-300 bg-white sticky top-0 z-10 shrink-0">
                <button
                    onClick={() => setActiveDetailTab("umum")}
                    className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest transition-colors ${activeDetailTab === "umum"
                        ? "border-b-2 border-teal-700 text-teal-800 bg-slate-50"
                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                        }`}
                >
                    Data Umum
                </button>
                <button
                    onClick={() => setActiveDetailTab("analisis")}
                    className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest transition-colors ${activeDetailTab === "analisis"
                        ? "border-b-2 border-teal-700 text-teal-800 bg-slate-50"
                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                        }`}
                >
                    Analitik Dataset
                </button>
            </div>

            {/* TAB CONTENT: DATA UMUM */}
            {activeDetailTab === "umum" && (
                <div className="flex flex-col pb-4 overflow-y-auto custom-scrollbar">
                    {/* STATISTIK DASAR (Dense Layout) */}
                    <div className="flex flex-col border-b border-slate-200 py-3 px-4 gap-3 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Maximize2 size={14} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Luas Wilayah</span>
                            </div>
                            <div className="text-right flex items-baseline gap-1">
                                <span className="text-lg font-black text-slate-900 leading-none">
                                    {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">km²</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Users size={14} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Populasi</span>
                            </div>
                            <div className="text-right flex items-baseline gap-1">
                                <span className="text-lg font-black text-slate-900 leading-none">
                                    {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Jiwa</span>
                            </div>
                        </div>
                    </div>

                    {/* GAMBARAN UMUM (Dense Typography) */}
                    <div className="flex flex-col border-b border-slate-200 py-3 px-4 gap-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <FileText size={14} strokeWidth={2.5} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gambaran Umum</h4>
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium leading-relaxed text-justify">
                            {data?.profile.deskripsi || "Informasi deskripsi kewilayahan belum didokumentasikan."}
                        </p>
                    </div>

                    {/* BATAS WILAYAH */}
                    <div className="flex flex-col border-b border-slate-200 py-3 px-4 gap-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={14} strokeWidth={2.5} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Batas Administrasi</h4>
                        </div>
                        <p className="text-[11px] text-slate-800 font-bold leading-snug">
                            {data?.profile.batas_wilayah || "Tidak terdefinisi"}
                        </p>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DATA ANALISIS */}
            {activeDetailTab === "analisis" && (
                <div className="flex flex-col pb-4 overflow-y-auto custom-scrollbar">
                    {/* SUMMARY HEADER */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 py-3 px-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Densitas Dataset</span>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp size={12} className="text-teal-700" strokeWidth={3} />
                            <span className="text-[10px] font-black text-teal-800 uppercase tracking-tight">
                                {totalDatasets} Indikator Total
                            </span>
                        </div>
                    </div>

                    {/* BARS: ZERO MARGIN LIST */}
                    <div className="flex flex-col">
                        {data?.categories.map((cat, index) => {
                            const barPercentage = maxCategoryValue > 0 ? (cat.total / maxCategoryValue) * 100 : 0;
                            const totalPercentage = totalDatasets > 0 ? ((cat.total / totalDatasets) * 100).toFixed(1) : 0;
                            const barColor = getCategoryColor(cat.name);

                            return (
                                <div key={cat.category_id} className="flex flex-col border-b border-slate-100 py-3 px-4 gap-1.5 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-0">
                                            <span className="text-xs font-black text-slate-900 uppercase">
                                                {cat.name}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                                {totalPercentage}% dari total
                                            </span>
                                        </div>
                                        <div className="text-right flex items-baseline gap-1">
                                            <span className="text-sm font-black text-slate-900 leading-none">
                                                {cat.total}
                                            </span>
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Set</span>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR - SHARP EDGES */}
                                    <div className="w-full h-1 bg-slate-200 rounded-none overflow-hidden mt-0.5">
                                        <div
                                            className={`h-full ${barColor} rounded-none transition-all ease-out duration-1000`}
                                            style={{ width: animateBars ? `${Math.max(barPercentage, 1)}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* FOOTER METADATA - ALL TABS (Selalu menempel di paling bawah) */}
            <div className="py-3 px-4 text-slate-400 flex items-center justify-between border-t border-slate-300 mt-auto bg-slate-50 shrink-0">
                <div className="flex items-center gap-1.5">
                    <History size={12} strokeWidth={2.5} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Pembaruan Sinkronisasi</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">
                    {data?.last_updated ? new Date(data.last_updated).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                </span>
            </div>

        </div>
    );
}