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
    PieChart
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
 * Desain: Glassmorphism terstruktur dengan penekanan pada data numerik.
 */
export default function DetailPanel({ districtId, districtName }: DetailPanelProps) {
    const [data, setData] = useState<DistrictDrilldownResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await gisService.fetchDistrictDrilldown(districtId);
                if (isMounted) setData(response);
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
        <div className="space-y-8 pb-12">

            {/* SECTION 1: QUICK STATS GRID */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Maximize2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Luas Wilayah</span>
                    </div>
                    <p className="text-xl font-black text-white">
                        {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-white/40 font-bold">km²</span>
                    </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Users size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Populasi</span>
                    </div>
                    <p className="text-xl font-black text-white">
                        {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                        <span className="text-[10px] ml-1 text-white/40 font-bold">Jiwa</span>
                    </p>
                </div>
            </div>

            {/* SECTION 2: DESKRIPSI WILAYAH */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/40">
                    <FileText size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Gambaran Umum</h4>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-sm text-white/70 leading-relaxed text-justify">
                        {data?.profile.deskripsi || "Informasi deskripsi untuk wilayah ini belum tersedia di database spasial Bappeda."}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <MapPin size={14} className="text-blue-500" />
                        <p className="text-[11px] text-white/40 font-medium italic">
                            Batas: {data?.profile.batas_wilayah || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: DISTRIBUSI DATA SEKTORAL */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-white/40">
                        <PieChart size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Densitas Dataset</h4>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        Total {data?.categories.reduce((acc, curr) => acc + curr.total, 0)} Items
                    </span>
                </div>

                <div className="space-y-2">
                    {data?.categories.map((cat) => (
                        <div
                            key={cat.category_id}
                            className="group p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                                    {cat.name}
                                </span>
                                <span className="text-xs font-black text-blue-400">{cat.total} <span className="text-[10px] text-white/20">Files</span></span>
                            </div>
                            {/* Simple Progress Bar */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 group-hover:bg-blue-400 transition-all duration-1000"
                                    style={{ width: `${Math.min((cat.total / 50) * 100, 100)}%` }} // Normalisasi ke max 50 untuk visual
                                />
                            </div>
                        </div>
                    ))}
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