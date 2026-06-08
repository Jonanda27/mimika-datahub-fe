"use client";

import React from "react";
import Link from "next/link";
import { Database, BarChart3, Globe, ChevronRight } from "lucide-react";

export default function QuickLinks() {
    return (
        <section className="border-b border-gray-200 bg-slate-50 py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid System: 1 Kolom di Mobile, 3 Kolom di Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-gray-200">

                    {/* Item 1: Data Sektoral */}
                    <div className="flex items-start gap-4 md:px-6">
                        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 shrink-0 mt-1">
                            <Database className="text-[#0071bc]" size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-1">Data Sektoral</h3>
                            <p className="text-gray-600 text-[13px] leading-snug mb-3">
                                Eksplorasi data mentah berdasarkan Organisasi Perangkat Daerah (OPD) Mimika.
                            </p>
                            <a href="#fitur" className="text-[#0071bc] font-bold text-[12px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Lihat Sektor <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Item 2: Indikator Utama */}
                    <div className="flex items-start gap-4 md:px-8">
                        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 shrink-0 mt-1">
                            <BarChart3 className="text-[#0071bc]" size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-1">Indikator Utama</h3>
                            <p className="text-gray-600 text-[13px] leading-snug mb-3">
                                Runtun waktu indikator makro pembangunan daerah secara periodik.
                            </p>
                            <a href="#statistik" className="text-[#0071bc] font-bold text-[12px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Lihat Indikator <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Item 3: GIS Mimika */}
                    <div className="flex items-start gap-4 md:px-8">
                        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 shrink-0 mt-1">
                            <Globe className="text-[#0071bc]" size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-1">GIS Mimika</h3>
                            <p className="text-gray-600 text-[13px] leading-snug mb-3">
                                Visualisasi geospasial kondisi pembangunan antar distrik secara interaktif.
                            </p>
                            <Link href="/explorer" className="text-[#0071bc] font-bold text-[12px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Buka Peta <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}