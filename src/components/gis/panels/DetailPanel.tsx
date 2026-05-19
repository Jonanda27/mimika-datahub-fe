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
    TrendingUp,
    X,
    Info,
    Building2
} from "lucide-react";
import { gisService } from "@/src/app/services/gis.service";
import { DistrictDrilldownResponse } from "@/src/app/types/gis";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

interface DetailPanelProps {
    districtId: number;
    districtName: string;
    panelId?: string; // Diinjeksi oleh PanelOrchestrator untuk fungsi Close
}

type TabType = "umum" | "analisis";

/**
 * DetailPanel - GFW Paradigm (Floating & High-Density)
 * Bertindak sebagai panel melayang independen. Memiliki header kustom 
 * dan kontrol penutup (close) mandiri.
 */
export default function DetailPanel({ districtId, districtName, panelId }: DetailPanelProps) {
    const { closePanel } = useExplorerStore();
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

    // [UBAH] Kalkulasi total aset berdasarkan opd_stats yang baru
    const totalAssets = data ? data.opd_stats.reduce((acc, curr) => acc + curr.total_assets, 0) : 0;
    const maxAssetValue = data && data.opd_stats.length > 0
        ? Math.max(...data.opd_stats.map(o => o.total_assets))
        : 1;

    // [UBAH] Fungsi penentuan warna diubah menjadi representasi OPD
    const getOpdColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kesehatan')) return 'bg-emerald-500';
        if (lowerName.includes('pupr') || lowerName.includes('pekerjaan umum')) return 'bg-amber-500';
        if (lowerName.includes('bappeda') || lowerName.includes('perencanaan')) return 'bg-blue-500';
        if (lowerName.includes('pendidikan')) return 'bg-indigo-500';
        return 'bg-slate-500';
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse px-4 py-5 bg-white h-full w-full">
                <div className="h-6 w-full bg-slate-200 rounded-none" />
                <div className="h-3 w-3/4 bg-slate-200 rounded-none" />
                <div className="h-3 w-full bg-slate-200 rounded-none" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-white h-full w-full border-l border-slate-200">
                <AlertCircle className="text-rose-600 mb-3" size={28} />
                <p className="text-[12px] font-bold text-slate-700">{error}</p>
                {panelId && (
                    <button
                        onClick={() => closePanel(panelId)}
                        className="mt-4 px-4 py-2 border border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 rounded-none transition-colors"
                    >
                        Tutup Panel
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-white relative border-l border-slate-200 shadow-xl md:shadow-none">

            {/* HEADER CUSTOM & TABS - Rapat dan Presisi */}
            <div className="flex flex-col border-b border-slate-200 bg-white sticky top-0 z-10">

                {/* Title & Actions Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest leading-none mb-1">
                            Profil Wilayah / Distrik
                        </span>
                        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider truncate">
                            {districtName}
                        </h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                        {panelId && (
                            <button
                                onClick={() => closePanel(panelId)}
                                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors rounded-none"
                                title="Tutup Panel"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs Bar */}
                <div className="flex bg-white">
                    <button
                        onClick={() => setActiveTab("umum")}
                        className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors outline-none ${activeTab === "umum"
                            ? "border-b-2 border-teal-700 text-teal-800 bg-teal-50/30"
                            : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        Data Umum
                    </button>
                    <button
                        onClick={() => setActiveTab("analisis")}
                        className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors outline-none ${activeTab === "analisis"
                            ? "border-b-2 border-teal-700 text-teal-800 bg-teal-50/30"
                            : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        Distribusi Aset OPD
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: DATA UMUM */}
            {activeTab === "umum" && (
                <div className="flex flex-col pb-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* STATISTIK DASAR - High-Density Data Row */}
                    <div className="flex flex-col border-b border-slate-200 py-3 px-4 gap-2.5 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Maximize2 size={13} strokeWidth={2.5} className="text-teal-700" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Luas Wilayah</span>
                            </div>
                            <div className="text-right flex items-baseline gap-1">
                                <span className="text-[13px] font-bold tracking-tight text-slate-800">
                                    {data?.profile.luas_wilayah?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium uppercase">km²</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Users size={13} strokeWidth={2.5} className="text-teal-700" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Populasi</span>
                            </div>
                            <div className="text-right flex items-baseline gap-1">
                                <span className="text-[13px] font-bold tracking-tight text-slate-800">
                                    {data?.profile.jumlah_penduduk?.toLocaleString('id-ID') || "-"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium uppercase">Jiwa</span>
                            </div>
                        </div>
                    </div>

                    {/* GAMBARAN UMUM - Tipografi Reguler untuk Keterbacaan */}
                    <div className="flex flex-col border-b border-slate-200 py-4 px-4 gap-2 bg-white">
                        <div className="flex items-center gap-2 text-slate-500 mb-0.5">
                            <FileText size={13} strokeWidth={2.5} className="text-teal-700" />
                            <h4 className="text-[10px] font-bold uppercase tracking-wider">Gambaran Umum</h4>
                        </div>
                        <p className="text-[11px] text-slate-700 font-normal leading-relaxed text-justify">
                            {data?.profile.deskripsi || "Informasi deskripsi untuk wilayah ini belum tersedia di database spasial Bappeda."}
                        </p>
                    </div>

                    {/* BATAS WILAYAH */}
                    <div className="flex flex-col border-b border-slate-200 py-4 px-4 gap-2 bg-white">
                        <div className="flex items-center gap-2 text-slate-500 mb-0.5">
                            <MapPin size={13} strokeWidth={2.5} className="text-teal-700" />
                            <h4 className="text-[10px] font-bold uppercase tracking-wider">Batas Administrasi</h4>
                        </div>
                        <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                            {data?.profile.batas_wilayah || "Tidak terdefinisi"}
                        </p>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DATA ANALISIS (Distribusi Aset) */}
            {activeTab === "analisis" && (
                <div className="flex flex-col pb-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* SUMMARY HEADER - Solid Background */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Building2 size={13} strokeWidth={2.5} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Densitas Aset Instansi</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 shadow-sm rounded-none">
                            <span className="text-[9px] font-bold text-teal-800 uppercase tracking-wider">
                                {totalAssets} Titik Fisik
                            </span>
                        </div>
                    </div>

                    {/* BARS: FLUSH LIST (Tanpa Card dan Bayangan) */}
                    <div className="flex flex-col">
                        {data?.opd_stats.length === 0 ? (
                            <div className="px-4 py-8 text-center flex flex-col items-center gap-2 text-slate-400">
                                <AlertCircle size={20} />
                                <span className="text-[11px] font-medium italic">Belum ada pemetaan aset fisik di distrik ini.</span>
                            </div>
                        ) : (
                            data?.opd_stats.map((stat) => {
                                const barPercentage = maxAssetValue > 0 ? (stat.total_assets / maxAssetValue) * 100 : 0;
                                const totalPercentage = totalAssets > 0 ? ((stat.total_assets / totalAssets) * 100).toFixed(1) : 0;
                                const barColor = getOpdColor(stat.opd_name);

                                return (
                                    <div key={stat.opd_id} className="flex flex-col border-b border-slate-100 py-3 px-4 gap-1.5 hover:bg-slate-50 transition-colors bg-white">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                                                    {stat.opd_name}
                                                </span>
                                                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
                                                    {totalPercentage}% dari total aset distrik
                                                </span>
                                            </div>
                                            <div className="text-right flex items-baseline gap-1">
                                                <span className="text-[13px] font-bold tracking-tight text-slate-800">
                                                    {stat.total_assets}
                                                </span>
                                                <span className="text-[9px] text-slate-500 font-medium uppercase">Titik</span>
                                            </div>
                                        </div>

                                        {/* PROGRESS BAR - SHARP EDGES (rounded-none) */}
                                        <div className="w-full h-[5px] bg-slate-100 rounded-none overflow-hidden mt-1">
                                            <div
                                                className={`h-full ${barColor} rounded-none transition-all ease-out duration-1000`}
                                                style={{ width: animateBars ? `${Math.max(barPercentage, 1)}%` : '0%' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* FOOTER METADATA - Solid Edge */}
            <div className="py-2.5 px-4 bg-slate-50 text-slate-500 flex items-center justify-between border-t border-slate-200 mt-auto">
                <div className="flex items-center gap-2">
                    <History size={12} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Update Terakhir</span>
                </div>
                <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                    {data?.last_updated ? new Date(data.last_updated).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                </span>
            </div>

        </div>
    );
}