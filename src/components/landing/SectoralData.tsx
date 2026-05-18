"use client";

import React from "react";
import Link from "next/link";
import {
    FileText,
    ShieldCheck,
    Zap,
    BarChart3
} from "lucide-react";

// SUB-KOMPONEN KHUSUS UNTUK ITEM STATISTIK (Internal)
function StatItem({ label, val }: { label: string, val: string }) {
    return (
        <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <span className="text-blue-100 text-xs font-bold uppercase">{label}</span>
            <span className="text-white text-2xl font-bold leading-none tracking-tighter">{val}</span>
        </div>
    );
}

export default function SectoralData() {
    return (
        <section id="fitur" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">

                {/* HEADER SECTION */}
                <div className="border-b-4 border-[#0071bc] pb-6">
                    <h2 className="text-3xl font-bold text-[#002244] uppercase tracking-tight">
                        Transparansi Data Sektoral
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-12">

                    {/* KOLOM KIRI (LEBAR): DASHBOARD ANALISIS */}
                    <div className="md:col-span-4 bg-[#f8fafc] border border-gray-200 p-8 md:p-10 flex flex-col justify-between shadow-sm rounded-sm">
                        <div>
                            <h3 className="text-2xl font-bold text-[#002244] mb-6">
                                Analisis Indikator Makro Ekonomi
                            </h3>
                            <p className="text-gray-600 mb-8 leading-relaxed text-base">
                                Mimika DataHub menyediakan dasbor interaktif yang dirancang untuk membantu pengambil kebijakan dan publik memantau pertumbuhan ekonomi serta tata kelola data secara efisien sesuai standar nasional.
                            </p>

                            {/* Feature Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 shadow-sm border border-gray-100 rounded">
                                        <FileText size={20} className="text-[#0071bc]" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 leading-tight">
                                        Kepatuhan Standar Satu Data Indonesia
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 shadow-sm border border-gray-100 rounded">
                                        <ShieldCheck size={20} className="text-[#0071bc]" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 leading-tight">
                                        Integritas & Keamanan Data Terjamin
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 shadow-sm border border-gray-100 rounded">
                                        <Zap size={20} className="text-[#0071bc]" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 leading-tight">
                                        Update Berkala dari 54 Instansi
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 shadow-sm border border-gray-100 rounded">
                                        <BarChart3 size={20} className="text-[#0071bc]" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 leading-tight">
                                        Visualisasi Grafik Dinamis
                                    </span>
                                </div>
                            </div>
                        </div>

                        <a href="#" className="inline-block bg-[#0071bc] text-white px-8 py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#005a96] transition-all w-max shadow-lg rounded-sm active:scale-95">
                            Buka Dashboard Sektoral
                        </a>
                    </div>

                    {/* KOLOM KANAN (SEMPIT): STATUS PORTAL & API */}
                    <div className="md:col-span-2 space-y-8" id="statistik">

                        {/* Box Biru Gelap: Statistik Portal */}
                        <div className="bg-[#002244] text-white p-8 shadow-xl rounded-sm border-b-4 border-blue-500">
                            <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-8">Status Portal</h4>
                            <div className="space-y-6">
                                <StatItem label="Total Dataset" val="2,450" />
                                <StatItem label="Instansi OPD" val="54" />
                                <StatItem label="Verifikasi" val="100%" />
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-blue-100 text-[10px] font-black uppercase">Sinkronisasi</span>
                                    <span className="text-emerald-400 font-black text-lg uppercase tracking-widest">Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* Box Putih: Akses API */}
                        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
                            <h4 className="text-[#002244] font-black mb-4 uppercase text-[10px] tracking-[0.2em]">Akses Data API</h4>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">
                                Kami menyediakan akses sistem bagi pengembang dan pengelola data OPD melalui portal terenkripsi.
                            </p>
                            <Link href="/login" className="block text-center border-2 border-[#0071bc] text-[#0071bc] py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#0071bc] hover:text-white transition-all active:scale-95">
                                Portal Login
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}