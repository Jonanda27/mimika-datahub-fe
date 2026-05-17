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

interface DetailPanelProps {
    districtId: number;
    districtName: string;
}

type TabType = "umum" | "analisis";

/**
 * DetailPanel - Frameless 2-Sided Architecture (GFW Paradigm)
 * Menghilangkan sub-card. Navigasi melalui tab minimalis.
 */
export default function DetailPanel({ districtId, districtName }: DetailPanelProps) {
    const [data, setData] = useState<DistrictDrilldownResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State Tab GFW Style
    const [activeTab, setActiveTab] = useState<TabType>("umum");
    const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setAnimateBars(false);

        const loadDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await gisService.fetchDistrictDrilldown(districtId);
                if (isMounted) {
                    setData(response);
                }
            } catch (err) {
                if (isMounted) setError("Gagal memuat profil wilayah. Silakan coba lagi.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadDetail();
        return () => { isMounted = false; };
    }, [districtId]);

    // Memicu animasi bar chart saat masuk ke tab analisis
    useEffect(() => {
        if (activeTab === "analisis" && data) {
            setTimeout(() => setAnimateBars(true), 50);
        } else {
            setAnimateBars(false);
        }
    }, [activeTab, data]);

    const totalDatasets = data ? data.categories.reduce((acc, curr) => acc + curr.total, 0) : 0;
    const maxCategoryValue = data && data.categories.length > 0
        ? Math.max(...data.categories.map(c => c.total))
        : 1;

    const getCategoryColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kesehatan')) return 'bg-rose-500';
        if (lowerName.includes('ekonomi')) return 'bg-teal-500';
        if (lowerName.includes('infrastruktur')) return 'bg-amber-500';
        if (lowerName.includes('pendidikan')) return 'bg-blue-500';
        return 'bg-slate-500';
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="h-8 w-full bg-slate-200" />
                <div className="h-4 w-3/4 bg-slate-200" />
                <div className="h-4 w-full bg-slate-200" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center p-4">
                <AlertCircle className="text-rose-600 mb-4" size={32} />
                <p className="text-sm font-bold text-slate-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* HEADER TABS - FRAMELESS */}
            <div className="flex border-b border-slate-300 bg-white sticky top-0 z-10">
                <button
                    onClick={() => setActiveTab("umum")}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "umum"
                        ? "border-b-2 border-teal-700 text-teal-800 bg-slate-50"
                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                        }`}
                >
                    Data Umum
                </button>
                <button
                    onClick={() => setActiveTab("analisis")}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "analisis"
                        ? "border-b-2 border-teal-700 text-teal-800 bg-slate-50"
                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                        }`}
                >
                    Analitik Data
                </button>
            </div>

            {/* TAB CONTENT: DATA UMUM */}
            {activeTab === "umum" && (
                <div className="flex flex-col pb-8">
                    {/* STATISTIK DASAR */}
                    <div className="flex flex-col border-b border-slate-200 py-4 px-5 gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Maximize2 size={16} strokeWidth={2} />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Luas Wilayah</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-slate-900">
                                    {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[10px] ml-1 text-slate-500 font-bold">km²</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Users size={16} strokeWidth={2} />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Populasi</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-slate-900">
                                    {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[10px] ml-1 text-slate-500 font-bold">Jiwa</span>
                            </div>
                        </div>
                    </div>

                    {/* GAMBARAN UMUM */}
                    <div className="flex flex-col border-b border-slate-200 py-5 px-5 gap-3">
                        <div className="flex items-center gap-2 text-slate-600">
                            <FileText size={16} />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Gambaran Umum</h4>
                        </div>
                        <p className="text-sm text-slate-700 font-normal leading-relaxed text-justify">
                            {data?.profile.deskripsi || "Informasi deskripsi untuk wilayah ini belum tersedia di database spasial Bappeda."}
                        </p>
                    </div>

                    {/* BATAS WILAYAH */}
                    <div className="flex flex-col border-b border-slate-200 py-4 px-5 gap-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={16} />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Batas Administrasi</h4>
                        </div>
                        <p className="text-[12px] text-slate-800 font-medium">
                            {data?.profile.batas_wilayah || "Tidak terdefinisi"}
                        </p>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DATA ANALISIS */}
            {activeTab === "analisis" && (
                <div className="flex flex-col pb-8">
                    {/* SUMMARY HEADER */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 py-4 px-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Densitas Dataset</span>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp size={14} className="text-teal-700" />
                            <span className="text-[11px] font-black text-teal-800">
                                {totalDatasets} Indikator Total
                            </span>
                        </div>
                    </div>

                    {/* BARS: FRAMELESS LIST */}
                    <div className="flex flex-col">
                        {data?.categories.map((cat, index) => {
                            const barPercentage = maxCategoryValue > 0 ? (cat.total / maxCategoryValue) * 100 : 0;
                            const totalPercentage = totalDatasets > 0 ? ((cat.total / totalDatasets) * 100).toFixed(1) : 0;
                            const barColor = getCategoryColor(cat.name);

                            return (
                                <div key={cat.category_id} className="flex flex-col border-b border-slate-200 py-4 px-5 gap-2 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[13px] font-black text-slate-900 uppercase">
                                                {cat.name}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                {totalPercentage}% dari total
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-black text-slate-900">
                                                {cat.total}
                                            </span>
                                            <span className="text-[9px] ml-1 text-slate-500 font-bold uppercase">Set</span>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR - SHARP EDGES */}
                                    <div className="w-full h-1.5 bg-slate-200 rounded-none overflow-hidden mt-1">
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

            {/* FOOTER METADATA - ALL TABS */}
            <div className="py-4 px-5 text-slate-400 flex items-center justify-between border-t border-slate-300 mt-auto">
                <div className="flex items-center gap-2">
                    <History size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Update Terakhir</span>
                </div>
                <span className="text-[9px] font-bold">
                    {data?.last_updated ? new Date(data.last_updated).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                </span>
            </div>

        </div>
    );
}