// src/components/gis/panels/AboutPanel.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
    Info,
    ShieldCheck,
    Database,
    Code,
    Globe,
    CheckCircle2,
    Building2,
    Users,
    Cpu
} from "lucide-react";

/**
 * AboutPanel - Edge-to-Edge / Frameless Paradigm
 * Menyajikan narasi visi digitalisasi Mimika tanpa menggunakan kotak (card) internal.
 */
export default function AboutPanel() {
    return (
        // Menghilangkan space-y-8 agar antar seksi menempel presisi dibatasi hairline
        <div className="flex flex-col h-full bg-white pb-12 animate-in fade-in slide-in-from-left-4 duration-500 overflow-y-auto custom-scrollbar">

            {/* 1. HERO SECTION: Edge-to-Edge Background */}
            <div className="flex flex-col items-center text-center py-2 px-4 bg-slate-50 border-b border-slate-200">
                {/* Sharp Logo Container (Tanpa Rounded) */}
                <div className="relative w-24 h-24 bg-transparent pointer-events-none">
                    <Image
                        src="/logo-mimika.png"
                        alt="Logo Mimika"
                        fill
                        sizes="256px"
                        className="object-contain p-1.5"
                    />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase">
                        Mimika <span className="text-teal-700">DataHub</span>
                    </h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        v1.0.0-beta Eksplorasi Spasial
                    </p>
                </div>
            </div>

            {/* 2. VISI & MISI: Flush List Layout */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <ShieldCheck size={14} className="text-teal-700" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Visi Pembangunan Digital</h4>
                </div>

                <div className="px-4 py-5 bg-teal-50/30 border-b border-slate-200">
                    <p className="text-[11px] font-bold text-teal-900 italic leading-relaxed text-center">
                        "Mewujudkan Tata Kelola Data Kabupaten Mimika yang Terintegrasi, Akurat, dan Akuntabel untuk Pengambilan Kebijakan Berbasis Data."
                    </p>
                </div>

                {/* List Misi (Edge-to-Edge Items) */}
                <div className="flex flex-col">
                    {[
                        "Konsolidasi Data Sektoral OPD",
                        "Visualisasi Spasial Real-time",
                        "Transparansi Informasi Publik"
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 w-full">
                            <CheckCircle2 size={14} strokeWidth={2.5} className="text-teal-600" />
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. GOVERNANSI DATA: Informasi Sumber */}
            <div className="flex flex-col mt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Database size={14} className="text-teal-700" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Otoritas & Sumber Data</h4>
                </div>

                <div className="flex flex-col bg-white">
                    <div className="px-4 py-4 border-b border-slate-200">
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed text-justify">
                            Data yang tersaji dikelola secara kolaboratif oleh walidata dan produsen data di lingkungan <strong className="text-slate-800 font-black">Pemerintah Kabupaten Mimika</strong>.
                        </p>
                    </div>

                    {/* Grid OPD Tanpa Kotak Tebal, Menggunakan Garis Pemisah (Divider) */}
                    <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-200 bg-slate-50/50">
                        {[
                            { name: "Bappeda", icon: Building2 },
                            { name: "Dinas Kesehatan", icon: Users },
                            { name: "BPS Mimika", icon: Globe },
                            { name: "Dinas Pendidikan", icon: CheckCircle2 }
                        ].map((opd, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-3">
                                <opd.icon size={12} className="text-teal-700" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">{opd.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. KREDIT: Tim Pengembang */}
            <div className="flex flex-col mt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Code size={14} className="text-teal-700" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Tim Pengembang</h4>
                </div>

                <div className="flex flex-col px-4 py-5 bg-white border-b border-slate-200 gap-4">
                    <div className="flex items-start gap-3">
                        {/* Kotak Ikon Sharp */}
                        <div className="w-10 h-10 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                            <Cpu size={18} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Teknologi Spasial V4</p>
                            <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                                Dikembangkan oleh <span className="text-teal-700 font-bold">Geocitra</span> menggunakan arsitektur modern Next.js 15 dan Leaflet Engine.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-6 bg-white">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center leading-relaxed">
                        © 2026 Pemerintah Kabupaten Mimika. <br /> All rights reserved.
                    </p>
                </div>
            </div>

        </div>
    );
}