"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import MapWrapper from "@/src/components/gis/MapWrapper";

export default function GisSection() {
    return (
        <section id="gis" className="py-20 bg-[#f4f7f9]">
            {/* 1. KONTEN HEADER (Blocking Konsisten dengan Section Lain) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black mb-10">
                <div className="border-b-4 border-[#0071bc] pb-6 flex flex-col md:flex-row justify-between items-end">
                    <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">
                            Sistem Informasi Geospasial
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg max-w-4xl font-light leading-relaxed">
                            Visualisasi sebaran aset, infrastruktur, dan indikator sosial ekonomi Kabupaten Mimika melalui antarmuka peta interaktif profesional.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. KONTAINER PETA PREVIEW (Lebar maksimal yang elegan) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white group">

                    {/* Layer Peta: Mengunci interaksi agar tidak mengganggu scroll halaman (UX Best Practice) */}
                    <div className="w-full h-full pointer-events-none grayscale-[0.3] contrast-[1.1]">
                        <MapWrapper isPreviewMode={true} />
                    </div>

                    {/* OVERLAY CALL TO ACTION (Gaya Glassmorphism untuk kontras di atas peta) */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-slate-950/30">

                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl flex flex-col items-center text-center max-w-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transform transition-all duration-500 group-hover:scale-105">

                            {/* Animated Icon */}
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 text-blue-400 border border-blue-500/30 relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                <Globe size={32} className="relative z-10" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                                Mimika Eksplorasi Spasial
                            </h3>

                            <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">
                                Buka platform peta interaktif untuk melihat analisis data berbasis lokasi di seluruh wilayah Kabupaten Mimika.
                            </p>

                            <Link
                                href="/explorer"
                                className="flex items-center gap-3 bg-[#0071bc] hover:bg-[#005a96] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,113,188,0.4)] hover:shadow-[0_0_30px_rgba(0,113,188,0.6)] transition-all duration-300 active:scale-95"
                            >
                                Buka Mode Eksplorasi <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}