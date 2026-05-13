// src/components/atlas/AtlasLineChart.tsx
"use client";

import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';
import { CalendarClock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AtlasLineChart() {
    const { currentData, isLoading } = useAtlasStore();

    // ============================================================================
    // STYLING: Konfigurasi Tema Warna Dinamis & Gradien
    // ============================================================================
    const getThemeColors = () => {
        const scheme = currentData?.metadata.color_scheme || "Blues";
        switch (scheme) {
            case "Reds": return { stroke: "#ef4444", fill: "#fca5a5" };
            case "Greens": return { stroke: "#10b981", fill: "#6ee7b7" };
            case "Purples": return { stroke: "#a855f7", fill: "#d8b4fe" };
            case "Oranges": return { stroke: "#f97316", fill: "#fdba74" };
            default: return { stroke: "#0071bc", fill: "#93c5fd" }; // Blues Mimika
        }
    };

    const theme = getThemeColors();
    const meta = currentData?.metadata;
    const trendData = currentData?.trendData || [];

    // ============================================================================
    // INFORMATION EXPERT: Analisa Tren Cepat (Naik/Turun)
    // ============================================================================
    const trendInsight = useMemo(() => {
        if (trendData.length < 2) return null;

        const oldest = trendData[0].value;
        const newest = trendData[trendData.length - 1].value;
        const diff = newest - oldest;
        const isPositive = diff > 0;

        // Persentase perubahan
        const percentChange = ((Math.abs(diff) / oldest) * 100).toFixed(1);

        return {
            isPositive,
            diffText: `${isPositive ? '+' : '-'}${percentChange}%`,
            description: isPositive
                ? `Mengalami peningkatan sebesar ${percentChange}% sejak tahun ${trendData[0].year}.`
                : `Mengalami penurunan sebesar ${percentChange}% sejak tahun ${trendData[0].year}.`
        };
    }, [trendData]);


    // --- SKELETON LOADER ---
    if (isLoading || !currentData || trendData.length === 0) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Membaca Histori Waktu...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col relative overflow-hidden">

            {/* Background Ornamen Halus */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <CalendarClock size={200} />
            </div>

            {/* Header Grafik */}
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <CalendarClock size={16} className="text-gray-400" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Tren 5 Tahun Terakhir
                        </h3>
                    </div>
                    <h2 className="text-xl font-black text-[#002244] mb-2">
                        Histori {meta?.title}
                    </h2>

                    {/* Auto-Insight Badge */}
                    {trendInsight && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${trendInsight.isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {trendInsight.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {trendInsight.diffText}
                            <span className="font-medium text-slate-500 ml-1 hidden lg:inline-block">
                                ({trendInsight.description})
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Container Grafik Recharts (Area Chart) */}
            <div className="grow w-full min-h-[350px] relative z-10 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={trendData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        {/* Definisi Gradien Warna Linear */}
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.fill} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={theme.fill} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                            tickFormatter={(val) => `${val}`}
                        />

                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0071bc] mb-1">
                                                Tahun {label}
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-black text-[#002244]">
                                                    {payload[0].value}
                                                </p>
                                                <p className="text-xs font-bold text-slate-400">
                                                    {meta?.unit}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={theme.stroke}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorGradient)"
                            animationDuration={1500}
                            activeDot={{ r: 6, fill: theme.stroke, stroke: '#fff', strokeWidth: 3 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}