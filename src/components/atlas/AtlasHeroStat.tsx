// src/components/atlas/AtlasHeroStat.tsx
"use client";

import React, { useMemo } from 'react';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';
import { Target, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

// Pemetaan ID menjadi Nama Distrik yang proper
const DISTRICT_NAMES: Record<string, string> = {
    "mimikabaru": "Mimika Baru", "kualakencana": "Kuala Kencana", "tembagapura": "Tembagapura",
    "wania": "Wania", "iwaka": "Iwaka", "kwamkinarama": "Kwamki Narama",
    "mimikatimur": "Mimika Timur", "mimikatengah": "Mimika Tengah", "mimikabarat": "Mimika Barat",
    "agimuga": "Agimuga", "jila": "Jila", "jita": "Jita", "mimikatimurjauh": "Mim. Timur Jauh",
    "mimikabaratjauh": "Mim. Barat Jauh", "mimikabarattengah": "Mim. Barat Tengah",
    "amar": "Amar", "hoya": "Hoya", "alama": "Alama"
};

export default function AtlasHeroStat() {
    const { currentData, isLoading } = useAtlasStore();

    // ============================================================================
    // INFORMATION EXPERT LOGIC: Menghitung Agregat On-the-Fly
    // ============================================================================
    const stats = useMemo(() => {
        if (!currentData || !currentData.spatialData) return null;

        const data = currentData.spatialData;
        const entries = Object.entries(data);
        if (entries.length === 0) return null;

        let sum = 0;
        let maxVal = -Infinity;
        let minVal = Infinity;
        let maxDist = "";
        let minDist = "";

        // Iterasi tunggal O(N) untuk mencari Sum, Max, dan Min sekaligus
        for (const [key, val] of entries) {
            sum += val;
            if (val > maxVal) { maxVal = val; maxDist = key; }
            if (val < minVal) { minVal = val; minDist = key; }
        }

        const avgVal = sum / entries.length;

        // Helper untuk memformat angka (bulat untuk jiwa/uang besar, desimal 1 digit untuk persentase)
        const formatNum = (num: number) => {
            if (currentData.metadata.unit === "%" || num < 100) return num.toFixed(1);
            return Math.round(num).toLocaleString('id-ID');
        };

        return {
            average: formatNum(avgVal),
            max: { value: formatNum(maxVal), district: DISTRICT_NAMES[maxDist] || maxDist },
            min: { value: formatNum(minVal), district: DISTRICT_NAMES[minDist] || minDist }
        };
    }, [currentData]);

    // ============================================================================
    // STYLING: Konfigurasi Tema Warna Dinamis
    // ============================================================================
    const getTheme = () => {
        const scheme = currentData?.metadata.color_scheme;
        switch (scheme) {
            case 'Reds': return {
                bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: 'bg-red-100 text-red-600'
            };
            case 'Greens': return {
                bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-600'
            };
            case 'Purples': return {
                bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', icon: 'bg-purple-100 text-purple-600'
            };
            default: return {
                bg: 'bg-blue-50', text: 'text-[#0071bc]', border: 'border-blue-100', icon: 'bg-blue-100 text-[#0071bc]'
            };
        }
    };

    // --- SKELETON LOADER ---
    if (isLoading || !currentData || !stats) {
        return (
            <div className="w-full h-full flex flex-col gap-4 animate-pulse">
                <div className="h-48 bg-slate-100 rounded-3xl w-full border border-slate-200"></div>
                <div className="flex gap-4">
                    <div className="h-32 bg-slate-100 rounded-2xl w-1/2 border border-slate-200"></div>
                    <div className="h-32 bg-slate-100 rounded-2xl w-1/2 border border-slate-200"></div>
                </div>
            </div>
        );
    }

    const theme = getTheme();
    const meta = currentData.metadata;

    return (
        <div className="w-full h-full flex flex-col gap-5">

            {/* 1. KARTU HERO (RATA-RATA KABUPATEN) */}
            <div className={`relative p-8 rounded-3xl border ${theme.border} ${theme.bg} overflow-hidden shadow-sm`}>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Target size={18} className={theme.text} />
                        <h3 className={`text-xs font-black uppercase tracking-[0.2em] opacity-80 ${theme.text}`}>
                            Rata-Rata Mimika
                        </h3>
                    </div>

                    <div className="flex items-baseline gap-3 mb-2">
                        <span className={`text-6xl md:text-7xl font-black tracking-tighter ${theme.text}`}>
                            {stats.average}
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-gray-500">
                            {meta.unit}
                        </span>
                    </div>

                    <p className="text-sm font-medium text-gray-600 max-w-sm leading-relaxed">
                        Kalkulasi agregat dari 18 distrik berdasarkan dataset <strong className={theme.text}>{meta.title}</strong> tahun terakhir.
                    </p>
                </div>

                {/* Ornamen Abstrak (Meningkatkan Estetika Enterprise) */}
                <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
                    <Target size={250} className={theme.text} strokeWidth={1} />
                </div>
            </div>

            {/* 2. KARTU INSIGHT (TERTINGGI & TERENDAH) */}
            <div className="grid grid-cols-2 gap-5">

                {/* Tertinggi */}
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${theme.icon} group-hover:scale-110 transition-transform`}>
                            <TrendingUp size={16} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Angka Tertinggi
                        </span>
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-black text-[#002244]">{stats.max.value}</span>
                        <span className="text-xs font-bold text-gray-400 ml-1">{meta.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mt-2 pt-2 border-t border-gray-50">
                        <MapPin size={14} className={theme.text} />
                        Distrik {stats.max.district}
                    </div>
                </div>

                {/* Terendah */}
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:scale-110 transition-transform">
                            <TrendingDown size={16} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Angka Terendah
                        </span>
                    </div>
                    <div className="mb-1">
                        <span className="text-3xl font-black text-[#002244]">{stats.min.value}</span>
                        <span className="text-xs font-bold text-gray-400 ml-1">{meta.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mt-2 pt-2 border-t border-gray-50">
                        <MapPin size={14} className="text-slate-400" />
                        Distrik {stats.min.district}
                    </div>
                </div>

            </div>
        </div>
    );
}