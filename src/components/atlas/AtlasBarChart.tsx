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
import { BarChart2 } from 'lucide-react';

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
    // Berkomunikasi dengan Controller Store menggunakan skema state terbaru
    const { currentData, isLoading } = useAtlasStore();

    // Transformasi dan pengurutan data untuk konsumsi Recharts
    const chartData = useMemo(() => {
        if (!currentData || !currentData.spatialData) return [];

        const formattedData = Object.entries(currentData.spatialData).map(([key, value]) => ({
            name: DISTRICT_NAMES[key] || key,
            value: value
        }));

        // Untuk BarChart bertipe "vertical" (horizontal bar), Recharts menggambar dari bawah ke atas.
        // Agar ranking 1 berada di paling atas, kita urutkan secara Ascending (Kecil ke Besar).
        return formattedData.sort((a, b) => a.value - b.value);
    }, [currentData]);

    // Penentuan warna dinamis berdasarkan skema warna metadata
    const getChartColor = () => {
        const scheme = currentData?.metadata.color_scheme || "Default";
        switch (scheme) {
            case "Reds": return "#ef4444";
            case "Greens": return "#10b981";
            case "Purples": return "#a855f7";
            case "Oranges": return "#f97316";
            default: return "#0071bc"; // Blues / Default Mimika
        }
    };

    const mainColor = getChartColor();
    const meta = currentData?.metadata;

    if (isLoading || !currentData || chartData.length === 0) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Merakit Kalkulasi Ranking...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
            {/* Header Grafik */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart2 size={16} className="text-gray-400" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Peringkat Distrik
                        </h3>
                    </div>
                    <h2 className="text-xl font-black text-[#002244]">
                        Distribusi {meta?.title}
                    </h2>
                </div>
            </div>

            {/* Container Grafik Recharts (Horizontal Bar) */}
            <div className="grow w-full min-h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical" // Mengubah orientasi menjadi menyamping
                        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />

                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            domain={[0, 'dataMax']}
                        />

                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                            width={110} // Ruang untuk nama distrik agar tidak terpotong
                        />

                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-[#002244] text-white p-4 rounded-xl shadow-xl border border-white/10">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                                Distrik {payload[0].payload.name}
                                            </p>
                                            <p className="text-xl font-black text-white">
                                                {payload[0].value} <span className="text-xs font-normal text-gray-300">{meta?.unit}</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]} // Sudut melengkung di bagian ujung kanan
                            animationDuration={1500}
                            barSize={16} // Ketebalan batang
                        >
                            {chartData.map((entry, index) => {
                                // 3 distrik teratas (ingat, array diurutkan asc, jadi 3 teratas ada di akhir array)
                                const isTop3 = index >= chartData.length - 3;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={mainColor}
                                        fillOpacity={isTop3 ? 1 : 0.4} // Top 3 warna solid, sisanya pudar
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}