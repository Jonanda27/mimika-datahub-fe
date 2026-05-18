"use client";

import React from "react";
import Link from "next/link";
import { Map, Layers, Navigation, ArrowRight } from "lucide-react";
import MapWrapper from "@/src/components/gis/MapWrapper";

export default function GisSection() {
    return (
        <section id="gis" className="py-24 bg-white border-b border-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* GRID LAYOUT: Teks di Kiri (5 Kolom), Peta di Kanan (7 Kolom) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* --- BLOCK KIRI: TEKS & TIPOGRAFI --- */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Label Kecil */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#0071bc] border border-blue-100 font-bold text-[10px] uppercase tracking-widest rounded-sm">
                            <Map size={14} />
                            <span>Fitur Geospasial</span>
                        </div>

                        {/* Judul & Deskripsi */}
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#002244] leading-[1.1] tracking-tight">
                                Pemetaan Data <br />
                                <span className="text-[#0071bc]">Berbasis Kewilayahan</span>
                            </h2>
                            <p className="text-gray-600 text-[15px] leading-relaxed">
                                Platform GIS (Geographic Information System) terintegrasi untuk menganalisis sebaran infrastruktur, kepadatan penduduk, dan indikator sosial ekonomi antar distrik di Kabupaten Mimika.
                            </p>
                        </div>

                        {/* List Fitur (Membangun kesan profesional) */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-[#f4f7f9] text-[#0071bc] border border-gray-200 mt-0.5">
                                    <Layers size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#002244] uppercase tracking-wider">Multi-Layer Peta</h4>
                                    <p className="text-gray-500 text-xs mt-1">Tumpang tindih data sektoral dalam satu tampilan peta.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-[#f4f7f9] text-[#0071bc] border border-gray-200 mt-0.5">
                                    <Navigation size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#002244] uppercase tracking-wider">Tingkat Distrik & Kampung</h4>
                                    <p className="text-gray-500 text-xs mt-1">Kedalaman data wilayah hingga ke batas administrasi terkecil.</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Link
                                href="/explorer"
                                className="inline-flex items-center gap-2 bg-[#002244] hover:bg-[#0071bc] text-white px-8 py-3.5 font-bold text-[12px] uppercase tracking-widest transition-colors shadow-md group"
                            >
                                Buka WebGIS Mimika
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                    </div>

                    {/* --- BLOCK KANAN: PREVIEW DASHBOARD PETA --- */}
                    <div className="lg:col-span-7 relative">

                        {/* Dekorasi Latar Belakang (Kotak Abu-abu bergeser) */}
                        <div className="absolute -inset-4 bg-slate-50 border border-gray-100 transform translate-x-4 translate-y-4 -z-10"></div>

                        {/* Kontainer Peta (Dibikin mirip jendela browser / aplikasi) */}
                        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col">

                            {/* Header Aplikasi Palsu (Mockup Header) */}
                            <div className="bg-[#f8fafc] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Preview Mode
                                </div>
                            </div>

                            {/* Area Peta */}
                            <div className="relative h-[450px] w-full group cursor-pointer">

                                {/* Pointer events none agar tidak nyangkut saat scroll halaman */}
                                <div className="w-full h-full pointer-events-none grayscale-[0.1] opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100">
                                    <MapWrapper isPreviewMode={true} />
                                </div>

                                {/* Overlay transparan di bawah agar tidak terlalu flat */}
                                <div className="absolute inset-0 bg-linear-to-t from-[#002244]/40 via-transparent to-transparent pointer-events-none"></div>

                                {/* Tombol Play/Buka overlay melayang tipis di tengah saat di hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Link
                                        href="/explorer"
                                        className="bg-white/90 backdrop-blur-sm text-[#002244] px-6 py-3 font-bold text-xs uppercase tracking-widest border border-gray-200 shadow-lg flex items-center gap-2"
                                    >
                                        Mulai Eksplorasi <ArrowRight size={14} />
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}