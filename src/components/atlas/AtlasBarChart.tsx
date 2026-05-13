// src/components/atlas/AtlasBarChart.tsx
"use client";

import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';

// Static Hash Map untuk mengubah slug kembali menjadi nama distrik yang rapi
const DISTRICT_NAMES: Record<string, string> = {
    "mimikabaru": "Mimika Baru", "kualakencana": "Kuala Kencana", "tembagapura": "Tembagapura",
    "wania": "Wania", "iwaka": "Iwaka", "kwamkinarama": "Kwamki Narama",
    "mimikatimur": "Mimika Timur", "mimikatengah": "Mimika Tengah", "mimikabarat": "Mimika Barat",
    "agimuga": "Agimuga", "jila": "Jila", "jita": "Jita", "mimikatimurjauh": "Mim. Timur Jauh",
    "mimikabaratjauh": "Mim. Barat Jauh", "mimikabarattengah": "Mim. Barat Tengah",
    "amar": "Amar", "hoya": "Hoya", "alama": "Alama"
};

export default function AtlasBarChart() {
    // Berkomunikasi dengan Controller Store tanpa perlu menerima props dari atas
    const { spatialData, metadata } = useAtlasStore();

    // Transformasi dan pengurutan data untuk konsumsi Recharts
    const chartData = useMemo(() => {
        if (!spatialData) return [];

        // Mengubah { "mimikabaru": 15, "wania": 10 } menjadi array of objects
        const formattedData = Object.entries(spatialData).map(([key, value]) => ({
            name: DISTRICT_NAMES[key] || key,
            value: value
        }));

        // Mengurutkan data dari nilai tertinggi ke terendah agar grafik batang terlihat rapi (Descending)
        return formattedData.sort((a, b) => b.value - a.value);
    }, [spatialData]);

    // Penentuan warna dinamis berdasarkan skema warna metadata dari Backend
    const getChartColor = () => {
        const scheme = metadata?.color_scheme || "Default";
        if (scheme === "Reds") return "#ef4444"; // text-red-500
        if (scheme === "Greens") return "#10b981"; // text-emerald-500
        return "#0071bc"; // Warna brand utama Mimika DataHub
    };

    const mainColor = getChartColor();

    if (!spatialData || chartData.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold uppercase tracking-widest">Merakit Grafik Data...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col pt-8 pb-12">
            {/* Header Grafik */}
            <div className="mb-10 px-12">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Distribusi Perbandingan
                </h3>
                <h2 className="text-4xl font-black text-[#002244] leading-none mb-3">
                    {metadata?.title || 'Analisis Sektoral'}
                </h2>
                <div className="w-16 h-1 bg-gray-200 rounded-full">
                    <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: mainColor }}></div>
                </div>
            </div>

            {/* Container Grafik Recharts */}
            <div className="grow w-full px-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                            angle={-45}
                            textAnchor="end"
                            interval={0} // Memaksa semua nama distrik muncul
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                            tickFormatter={(val) => `${val}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-[#002244] text-white p-4 rounded-xl shadow-2xl border border-white/10">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                                Distrik {payload[0].payload.name}
                                            </p>
                                            <p className="text-2xl font-black text-white">
                                                {payload[0].value} <span className="text-xs font-normal text-gray-300">{metadata?.unit}</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500} // Animasi transisi yang elegan
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={mainColor}
                                    fillOpacity={index < 3 ? 1 : 0.6} // 3 teratas diberi warna solid, sisanya agak transparan untuk kontras
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}