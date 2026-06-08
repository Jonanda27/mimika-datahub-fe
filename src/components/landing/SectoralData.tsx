"use client";

import React from "react";
import Link from "next/link";
import {
    FileText,
    ShieldCheck,
    Zap,
    BarChart3,
    ArrowRight // <-- Tambahkan ini
} from "lucide-react";

// SUB-KOMPONEN KHUSUS UNTUK ITEM STATISTIK (Internal)
function StatItem({ label, val }: { label: string, val: string }) {
    return (
        <div className="flex justify-between items-end border-b border-white/10 pb-3">
            <span className="text-blue-200 text-[11px] font-bold uppercase tracking-wider">{label}</span>
            <span className="text-white text-3xl font-black leading-none tracking-tighter">{val}</span>
        </div>
    );
}

export default function SectoralData() {
    return (
        <section id="fitur" className="py-24 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">

                {/* HEADER SECTION */}
                <div className="border-b-4 border-[#0071bc] pb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">
                        Transparansi Data Sektoral
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-12 items-stretch">

                    {/* KOLOM KIRI (LEBAR): DASHBOARD ANALISIS */}
                    <div className="lg:col-span-4 bg-slate-50 border border-gray-200 p-8 md:p-12 flex flex-col justify-between shadow-sm">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#002244] mb-4 leading-tight tracking-tight">
                                Analisis Indikator Makro Ekonomi
                            </h3>
                            <p className="text-gray-600 mb-10 leading-relaxed text-[15px] max-w-3xl">
                                Mimika DataHub menyediakan dasbor interaktif yang dirancang untuk membantu pengambil kebijakan dan publik memantau pertumbuhan ekonomi serta tata kelola data secara efisien sesuai standar nasional.
                            </p>

                            {/* Feature Grid (Icon dengan bg light-blue agar lebih premium) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100/50 p-2.5 rounded text-[#0071bc] shrink-0 mt-0.5">
                                        <FileText size={20} strokeWidth={2} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[#002244] leading-snug">
                                        Kepatuhan Standar Satu Data Indonesia
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100/50 p-2.5 rounded text-[#0071bc] shrink-0 mt-0.5">
                                        <ShieldCheck size={20} strokeWidth={2} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[#002244] leading-snug">
                                        Integritas & Keamanan Data Terjamin
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100/50 p-2.5 rounded text-[#0071bc] shrink-0 mt-0.5">
                                        <Zap size={20} strokeWidth={2} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[#002244] leading-snug">
                                        Update Berkala dari 54 Instansi OPD
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100/50 p-2.5 rounded text-[#0071bc] shrink-0 mt-0.5">
                                        <BarChart3 size={20} strokeWidth={2} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[#002244] leading-snug">
                                        Visualisasi Grafik Dinamis & Runtun Waktu
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Kiri diubah jadi Flexbox dgn Ikon */}
                        <div>
                            <Link
                                href="#"
                                className="inline-flex items-center gap-3 bg-[#002244] text-white px-8 py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-[#0071bc] transition-all shadow-md group"
                            >
                                Buka Dashboard Sektoral
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* KOLOM KANAN (SEMPIT): STATUS PORTAL & API */}
                    <div className="lg:col-span-2 flex flex-col gap-8" id="statistik">

                        {/* Box Biru Gelap: Statistik Portal */}
                        <div className="bg-[#002244] text-white p-8 md:p-10 shadow-xl border-b-4 border-blue-500 flex-1 flex flex-col">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-8">
                                Live Status Portal
                            </h4>
                            <div className="space-y-6 mt-auto">
                                <StatItem label="Total Dataset" val="2,450" />
                                <StatItem label="Instansi OPD" val="54" />
                                <StatItem label="Verifikasi" val="100%" />

                                {/* Status Aktif dengan Animasi Titik Berkedip */}
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-blue-200 text-[11px] font-bold uppercase tracking-wider">Sinkronisasi</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-emerald-400 font-black text-lg uppercase tracking-widest leading-none">Aktif</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box Putih: Akses API */}
                        <div className="bg-white border border-gray-200 p-8 shadow-sm flex flex-col justify-center">
                            <h4 className="text-[#002244] font-black mb-3 uppercase text-[11px] tracking-[0.2em]">
                                Akses Data API
                            </h4>
                            <p className="text-[13px] text-gray-500 mb-6 leading-relaxed font-medium">
                                Tersedia akses sistem (*endpoint*) bagi pengembang dan pengelola data OPD via portal terenkripsi.
                            </p>
                            <Link
                                href="/login"
                                className="block text-center border-2 border-[#0071bc] text-[#0071bc] py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#0071bc] hover:text-white transition-all"
                            >
                                Portal Login
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}