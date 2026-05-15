// src/components/gis/panels/DetailPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    MapPin,
    Users,
    Maximize2,
    History,
    ChevronRight,
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
 * DetailPanel - Menampilkan profil mendalam sebuah wilayah.
 * Menggunakan pola asinkronus untuk memuat data profil dan kepadatan sektoral.
 * Desain (Tahap 4): Menampilkan Micro-Dashboard dengan Horizontal Bar Chart bergaya Glassmorphism.
 */
export default function DetailPanel({ districtId, districtName }: DetailPanelProps) {
    const [data, setData] = useState<DistrictDrilldownResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Animasi on-mount untuk bar chart
    const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setAnimateBars(false); // Reset animasi tiap distrik berubah

        const loadDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await gisService.fetchDistrictDrilldown(districtId);
                if (isMounted) {
                    setData(response);
                    // Trigger animasi setelah data ter-render
                    setTimeout(() => {
                        if (isMounted) setAnimateBars(true);
                    }, 100);
                }
            } catch (err) {
                if (isMounted) setError("Gagal memuat profil wilayah. Silakan coba lagi.");
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadDetail();
        return () => { isMounted = false; };
    }, [districtId]);

    // Kalkulasi agregat untuk proporsi Bar Chart
    const totalDatasets = data ? data.categories.reduce((acc, curr) => acc + curr.total, 0) : 0;
    const maxCategoryValue = data && data.categories.length > 0
        ? Math.max(...data.categories.map(c => c.total))
        : 1; // Mencegah division by zero

    // Fungsi pemetaan warna berdasarkan nama sektor
    const getCategoryColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kesehatan')) return 'from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.4)]';
        if (lowerName.includes('ekonomi')) return 'from-blue-400 to-blue-500 shadow-[0_0_12px_rgba(96,165,250,0.4)]';
        if (lowerName.includes('infrastruktur')) return 'from-purple-400 to-purple-500 shadow-[0_0_12px_rgba(192,132,252,0.4)]';
        if (lowerName.includes('pendidikan')) return 'from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)]';
        return 'from-slate-400 to-slate-500 shadow-[0_0_12px_rgba(148,163,184,0.4)]'; // Default
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 w-full bg-white/5 rounded-2xl" />
                <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded-xl" />
                    <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="space-y-4 pt-4">
                    <div className="h-12 w-full bg-white/5 rounded-xl" />
                    <div className="h-12 w-full bg-white/5 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="text-red-400 mb-4" size={40} />
                <p className="text-sm text-white/60">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 overflow-x-hidden">

            {/* SECTION 1: QUICK STATS GRID */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Maximize2 size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 relative z-10">
                        <Maximize2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Luas Wilayah</span>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-white relative z-10 truncate">
                        {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-white/40 font-bold">km²</span>
                    </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Users size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 relative z-10">
                        <Users size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Populasi</span>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-white relative z-10 truncate">
                        {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-white/40 font-bold">Jiwa</span>
                    </p>
                </div>
            </div>

            {/* SECTION 2: DESKRIPSI WILAYAH */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/40 px-1">
                    <FileText size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Gambaran Umum</h4>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-sm text-white/70 leading-relaxed text-justify">
                        {data?.profile.deskripsi || "Informasi deskripsi untuk wilayah ini belum tersedia di database spasial Bappeda."}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <MapPin size={14} className="text-blue-500 shrink-0" />
                        <p className="text-[11px] text-white/40 font-medium italic truncate">
                            Batas: {data?.profile.batas_wilayah || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: TAHAP 4 MICRO-DASHBOARD (DISTRIBUSI DATA SEKTORAL) */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-white/40">
                        <PieChart size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Densitas Dataset</h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                        <TrendingUp size={12} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400">
                            Total {totalDatasets} Indikator
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {data?.categories.map((cat, index) => {
                        // Kalkulasi persentase untuk animasi bar (berdasarkan nilai tertinggi)
                        const barPercentage = maxCategoryValue > 0 ? (cat.total / maxCategoryValue) * 100 : 0;
                        // Kalkulasi persentase dari total (untuk informasi teks)
                        const totalPercentage = totalDatasets > 0 ? ((cat.total / totalDatasets) * 100).toFixed(1) : 0;
                        // Dapatkan warna spesifik
                        const barColor = getCategoryColor(cat.name);

                        return (
                            <div
                                key={cat.category_id}
                                className="group relative p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                                            {cat.name}
                                        </span>
                                        <span className="text-[9px] font-medium text-white/30 uppercase tracking-widest">
                                            {totalPercentage}% dari total data
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black text-white group-hover:text-blue-100 transition-colors">
                                            {cat.total}
                                        </span>
                                        <span className="text-[10px] ml-1 text-white/40 font-medium">Dataset</span>
                                    </div>
                                </div>

                                {/* Micro-Bar Chart dengan Efek Glassmorphism & Neon Glow */}
                                <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div
                                        className={`h-full bg-linear-to-r ${barColor} rounded-full transition-all ease-out duration-1000`}
                                        style={{
                                            width: animateBars ? `${Math.max(barPercentage, 2)}%` : '0%', // Minimal 2% agar bar selalu terlihat sedikit
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 4: METADATA & HISTORY */}
            <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-white/20">
                    <div className="flex items-center gap-2">
                        <History size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter italic">Terakhir Diperbarui</span>
                    </div>
                    <span className="text-[9px] font-mono">
                        {data?.last_updated ? new Date(data.last_updated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                    </span>
                </div>
            </div>

        </div>
    );
}