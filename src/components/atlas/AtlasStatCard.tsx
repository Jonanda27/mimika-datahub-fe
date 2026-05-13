// src/components/atlas/AtlasStatCard.tsx
"use client";

import React, { useMemo } from 'react';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';
import { TrendingUp, AlertCircle, Activity } from 'lucide-react';

// Pemetaan nama distrik untuk narasi dinamis
const DISTRICT_NAMES: Record<string, string> = {
    "mimikabaru": "Mimika Baru", "kualakencana": "Kuala Kencana", "tembagapura": "Tembagapura",
    "wania": "Wania", "iwaka": "Iwaka", "kwamkinarama": "Kwamki Narama",
    "mimikatimur": "Mimika Timur", "mimikatengah": "Mimika Tengah", "mimikabarat": "Mimika Barat",
    "agimuga": "Agimuga", "jila": "Jila", "jita": "Jita", "mimikatimurjauh": "Mim. Timur Jauh",
    "mimikabaratjauh": "Mim. Barat Jauh", "mimikabarattengah": "Mim. Barat Tengah",
    "amar": "Amar", "hoya": "Hoya", "alama": "Alama"
};

export default function AtlasStatCard() {
    const { spatialData, metadata } = useAtlasStore();

    // Kalkulasi agregat cerdas (Information Expert logic di sisi UI)
    const stats = useMemo(() => {
        if (!spatialData) return null;

        const values = Object.values(spatialData);
        const keys = Object.keys(spatialData);

        if (values.length === 0) return null;

        // Hitung rata-rata untuk angka raksasa utama
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / values.length;

        // Cari distrik dengan nilai tertinggi untuk highlight tambahan
        let maxVal = -1;
        let maxDistKey = "";
        keys.forEach(key => {
            if (spatialData[key] > maxVal) {
                maxVal = spatialData[key];
                maxDistKey = key;
            }
        });

        // Format angka agar rapi (hilangkan desimal berlebih)
        const isPercentage = metadata?.unit.includes('%');
        const formattedAvg = isPercentage || avg < 100 ? avg.toFixed(1) : Math.round(avg).toLocaleString('id-ID');
        const formattedMax = isPercentage || maxVal < 100 ? maxVal.toFixed(1) : Math.round(maxVal).toLocaleString('id-ID');

        return {
            average: formattedAvg,
            maxValue: formattedMax,
            maxDistrict: DISTRICT_NAMES[maxDistKey] || maxDistKey
        };
    }, [spatialData, metadata]);

    // Konfigurasi tema warna imersif (Fullscreen Solid/Gradient)
    const getThemeClasses = () => {
        const scheme = metadata?.color_scheme || "Default";
        if (scheme === "Reds") return {
            bg: "bg-gradient-to-br from-[#7f1d1d] to-[#dc2626]", // Merah gelap ke merah terang
            text: "text-red-100",
            accent: "text-white",
            icon: <AlertCircle className="w-16 h-16 text-red-200/50 mb-6" />
        };
        if (scheme === "Greens") return {
            bg: "bg-gradient-to-br from-[#14532d] to-[#16a34a]", // Hijau hutan ke emerald
            text: "text-emerald-100",
            accent: "text-white",
            icon: <TrendingUp className="w-16 h-16 text-emerald-200/50 mb-6" />
        };
        return {
            bg: "bg-gradient-to-br from-[#002244] to-[#0071bc]", // Biru Bappeda
            text: "text-blue-100",
            accent: "text-white",
            icon: <Activity className="w-16 h-16 text-blue-200/50 mb-6" />
        };
    };

    if (!spatialData || !stats) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#002244] text-white">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            </div>
        );
    }

    const theme = getThemeClasses();

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-20 ${theme.bg} relative overflow-hidden`}>

            {/* Ornamen Latar Belakang Abstrak */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-1000 ease-out">
                {theme.icon}

                <h3 className={`text-sm font-black uppercase tracking-[0.4em] mb-4 opacity-80 ${theme.accent}`}>
                    Rata-rata Kabupaten
                </h3>

                {/* ANGKA RAKSASA (HERO STAT) */}
                <div className="flex items-baseline justify-center gap-4 mb-8 leading-none">
                    <span className={`text-[12rem] font-black tracking-tighter ${theme.accent} drop-shadow-2xl`}>
                        {stats.average}
                    </span>
                    <span className={`text-6xl font-bold opacity-80 ${theme.text}`}>
                        {metadata?.unit}
                    </span>
                </div>

                <h2 className={`text-4xl font-black mb-6 ${theme.accent}`}>
                    {metadata?.title}
                </h2>

                <p className={`text-xl max-w-2xl leading-relaxed font-medium opacity-90 ${theme.text}`}>
                    {metadata?.description}
                </p>

                {/* Insight Otomatis Tambahan */}
                <div className="mt-12 p-6 bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl max-w-xl">
                    <p className={`text-sm font-bold leading-relaxed ${theme.text}`}>
                        <span className="uppercase tracking-widest opacity-70 block mb-1 text-[10px]">Insight Tertinggi:</span>
                        Distrik <span className={theme.accent}>{stats.maxDistrict}</span> mencatatkan angka tertinggi pada indikator ini dengan nilai <span className={`text-xl font-black ${theme.accent}`}>{stats.maxValue} {metadata?.unit}</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}