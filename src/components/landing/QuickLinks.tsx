"use client";

import React from "react";
import Link from "next/link";
import { Database, BarChart3, Globe, ChevronRight } from "lucide-react";

export default function QuickLinks() {
    return (
        <section className="border-b border-gray-200 bg-white sm:bg-slate-50 py-6 md:py-8 relative z-10 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid System: 1 Kolom Ringkas di Mobile, 3 Kolom Elegan di Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-0 md:divide-x divide-gray-200">

                    {/* Item 1: Data Sektoral */}
                    <div className="flex items-start gap-3.5 p-3 sm:p-0 md:px-6 bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-gray-100">
                        <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-100 shrink-0 mt-0.5">
                            <Database className="text-[#0071bc]" size={22} strokeWidth={1.75} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-0.5">Data Sektoral</h3>
                            <p className="text-gray-600 text-[12px] leading-snug mb-2">
                                Eksplorasi data mentah berdasarkan Organisasi Perangkat Daerah (OPD).
                            </p>
                            <a href="#fitur" className="text-[#0071bc] font-bold text-[11px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Lihat Sektor <ChevronRight size={13} />
                            </a>
                        </div>
                    </div>

                    {/* Item 2: Indikator Utama */}
                    <div className="flex items-start gap-3.5 p-3 sm:p-0 md:px-8 bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-gray-100">
                        <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-100 shrink-0 mt-0.5">
                            <BarChart3 className="text-[#0071bc]" size={22} strokeWidth={1.75} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-0.5">Indikator Utama</h3>
                            <p className="text-gray-600 text-[12px] leading-snug mb-2">
                                Runtun waktu indikator makro pembangunan daerah secara periodik.
                            </p>
                            <a href="#statistik" className="text-[#0071bc] font-bold text-[11px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Lihat Indikator <ChevronRight size={13} />
                            </a>
                        </div>
                    </div>

                    {/* Item 3: GIS Daerah */}
                    <div className="flex items-start gap-3.5 p-3 sm:p-0 md:px-8 bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-gray-100">
                        <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-100 shrink-0 mt-0.5">
                            <Globe className="text-[#0071bc]" size={22} strokeWidth={1.75} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[15px] font-bold text-[#002244] mb-0.5">GIS Daerah</h3>
                            <p className="text-gray-600 text-[12px] leading-snug mb-2">
                                Visualisasi geospasial kondisi pembangunan antar distrik secara interaktif.
                            </p>
                            <Link href="/explorer" className="text-[#0071bc] font-bold text-[11px] uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                                Buka Peta <ChevronRight size={13} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
