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
 * AboutPanel - Modul Informasi Sistem (Light Theme)
 * Menyajikan narasi visi digitalisasi Mimika, integritas data, dan kredit pengembang.
 */
export default function AboutPanel() {
    return (
        <div className="flex flex-col h-full space-y-8 pb-12 animate-in fade-in slide-in-from-left-4 duration-500">

            {/* 1. HERO SECTION: Identitas Aplikasi */}
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="relative w-20 h-20 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <Image
                        src="/logo-mimika.png"
                        alt="Logo Mimika"
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                    />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                        Mimika <span className="text-teal-600">DataHub</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        v1.0.0-beta Eksplorasi Spasial
                    </p>
                </div>
            </div>

            {/* 2. VISI & MISI: Paradigma Digital */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 px-1">
                    <ShieldCheck size={16} className="text-teal-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Visi Pembangunan Digital</h4>
                </div>
                <div className="p-5 bg-teal-50 border border-teal-100 rounded-2xl shadow-sm">
                    <p className="text-sm font-bold text-teal-900 italic leading-relaxed text-center">
                        "Mewujudkan Tata Kelola Data Kabupaten Mimika yang Terintegrasi, Akurat, dan Akuntabel untuk Pengambilan Kebijakan Berbasis Data."
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        "Konsolidasi Data Sektoral OPD",
                        "Visualisasi Spasial Real-time",
                        "Transparansi Informasi Publik"
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                            <CheckCircle2 size={14} className="text-teal-500" />
                            <span className="text-xs font-bold text-slate-600">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. GOVERNANSI DATA: Sumber Informasi */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 px-1">
                    <Database size={16} className="text-teal-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Otoritas & Sumber Data</h4>
                </div>
                <div className="space-y-2">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            Data yang tersaji dalam portal ini dikelola secara kolaboratif oleh walidata dan produsen data di lingkungan Pemerintah Kabupaten Mimika.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: "Bappeda", icon: Building2 },
                                { name: "Dinas Kesehatan", icon: Users },
                                { name: "BPS Mimika", icon: Globe },
                                { name: "Dinas Pendidikan", icon: CheckCircle2 }
                            ].map((opd, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <opd.icon size={12} className="text-teal-600" />
                                    <span className="text-[10px] font-black text-slate-700">{opd.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. KREDIT: Tim Pengembang */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 px-1">
                    <Code size={16} className="text-teal-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tim Pengembang</h4>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <Cpu size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Teknologi Spasial V4</p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                Dikembangkan oleh <span className="text-teal-700 font-bold">Tim IT Brida / Bappeda Mimika</span> menggunakan arsitektur modern Next.js 15 dan Leaflet Engine.
                            </p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold text-center italic">
                            © 2026 Pemerintah Kabupaten Mimika. <br /> All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}