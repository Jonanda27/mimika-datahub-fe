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
    PieChart,
    TrendingUp
} from "lucide-react";
import { gisService } from "@/src/app/services/gis.service";
import { DistrictDrilldownResponse } from "@/src/app/types/gis";

interface DetailPanelProps {
    districtId: number;
    districtName: string;
}

/**
 * DetailPanel - Menampilkan profil mendalam sebuah wilayah (Light Theme).
 * Desain (Tahap 4): Micro-Dashboard yang bersih, font tebal, readability tinggi.
 */
export default function DetailPanel({ districtId, districtName }: DetailPanelProps) {
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
                if (isMounted) {
                    setData(response);
                    setTimeout(() => {
                        if (isMounted) setAnimateBars(true);
                    }, 100);
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

    const totalDatasets = data ? data.categories.reduce((acc, curr) => acc + curr.total, 0) : 0;
    const maxCategoryValue = data && data.categories.length > 0
        ? Math.max(...data.categories.map(c => c.total))
        : 1;

    // Warna gradien pekat untuk Bar Chart di atas latar putih
    const getCategoryColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kesehatan')) return 'from-rose-400 to-rose-600 shadow-rose-200';
        if (lowerName.includes('ekonomi')) return 'from-teal-400 to-teal-600 shadow-teal-200';
        if (lowerName.includes('infrastruktur')) return 'from-amber-400 to-amber-600 shadow-amber-200';
        if (lowerName.includes('pendidikan')) return 'from-blue-400 to-blue-600 shadow-blue-200';
        return 'from-slate-400 to-slate-600 shadow-slate-200';
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 w-full bg-slate-200 rounded-2xl" />
                <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                    <div className="h-4 w-full bg-slate-200 rounded-full" />
                    <div className="h-4 w-5/6 bg-slate-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-200 rounded-xl" />
                    <div className="h-20 bg-slate-200 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="text-rose-500 mb-4" size={40} />
                <p className="text-sm font-bold text-slate-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 overflow-x-hidden">

            {/* SECTION 1: QUICK STATS GRID */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-teal-900 group-hover:scale-110 transition-transform duration-500">
                        <Maximize2 size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 relative z-10">
                        <Maximize2 size={16} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Luas Wilayah</span>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-slate-800 relative z-10 truncate">
                        {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-slate-400 font-bold">km²</span>
                    </p>
                </div>
                <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 text-teal-900 group-hover:scale-110 transition-transform duration-500">
                        <Users size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 relative z-10">
                        <Users size={16} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Populasi</span>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-slate-800 relative z-10 truncate">
                        {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-slate-400 font-bold">Jiwa</span>
                    </p>
                </div>
            </div>

            {/* SECTION 2: DESKRIPSI WILAYAH */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 px-1">
                    <FileText size={16} className="text-teal-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gambaran Umum</h4>
                </div>
                <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed text-justify">
                        {data?.profile.deskripsi || "Informasi deskripsi untuk wilayah ini belum tersedia di database spasial Bappeda."}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                        <MapPin size={14} className="text-teal-500 shrink-0" />
                        <p className="text-[11px] text-slate-500 font-bold italic truncate">
                            Batas: {data?.profile.batas_wilayah || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: MICRO-DASHBOARD (DISTRIBUSI DATA SEKTORAL) */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <PieChart size={16} className="text-teal-600" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Densitas Dataset</h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full shadow-sm">
                        <TrendingUp size={12} className="text-teal-600" />
                        <span className="text-[10px] font-black text-teal-700">
                            Total {totalDatasets} Indikator
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {data?.categories.map((cat, index) => {
                        const barPercentage = maxCategoryValue > 0 ? (cat.total / maxCategoryValue) * 100 : 0;
                        const totalPercentage = totalDatasets > 0 ? ((cat.total / totalDatasets) * 100).toFixed(1) : 0;
                        const barColor = getCategoryColor(cat.name);

                        return (
                            <div
                                key={cat.category_id}
                                className="group relative p-4 bg-white border border-slate-200 hover:border-teal-300 hover:bg-slate-50 shadow-sm rounded-2xl transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-black text-slate-800 group-hover:text-teal-800 transition-colors">
                                            {cat.name}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {totalPercentage}% dari total data
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black text-slate-800 group-hover:text-teal-700 transition-colors">
                                            {cat.total}
                                        </span>
                                        <span className="text-[10px] ml-1 text-slate-500 font-bold">Dataset</span>
                                    </div>
                                </div>

                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                    <div
                                        className={`h-full bg-linear-to-r ${barColor} rounded-full shadow-sm transition-all ease-out duration-1000`}
                                        style={{
                                            width: animateBars ? `${Math.max(barPercentage, 2)}%` : '0%',
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 4: METADATA & HISTORY */}
            <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                        <History size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter italic">Terakhir Diperbarui</span>
                    </div>
                    <span className="text-[9px] font-bold">
                        {data?.last_updated ? new Date(data.last_updated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                    </span>
                </div>
            </div>

        </div>
    );
}