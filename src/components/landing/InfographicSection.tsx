"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Maximize2, ChevronRight, X, Download } from "lucide-react";

const INFOGRAFIK_DATA = [
    {
        id: 1,
        title: "Capaian Makro Ekonomi Kabupaten Mimika Kuartal I 2026",
        date: "08 Mei 2026",
        category: "Ekonomi",
        image: "/infografik/ekonomi-01.jpg",
    },
    {
        id: 2,
        title: "Peta Penurunan Angka Stunting per Distrik Tahun 2025",
        date: "22 April 2026",
        category: "Kesehatan",
        image: "/infografik/stunting-2025.jpg",
    },
    {
        id: 3,
        title: "Piramida Penduduk & Ketenagakerjaan Mimika 2026",
        date: "15 Maret 2026",
        category: "Demografi",
        image: "/infografik/penduduk-2026.jpg",
    }
];

export default function InfographicSection() {
    // State untuk menyimpan data gambar yang sedang dibuka di pop-up
    const [selectedImg, setSelectedImg] = useState<typeof INFOGRAFIK_DATA[0] | null>(null);

    // Mencegah scroll pada body saat pop-up terbuka
    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [selectedImg]);

    return (
        <section className="py-16 md:py-20 bg-white relative z-10 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">

                {/* HEADER */}
                <div className="border-b-4 border-[#0071bc] pb-4 flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
                    <div className="text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#002244] uppercase tracking-tight">Kilas Visual Data</h2>
                        <p className="mt-2 text-gray-500 text-sm md:text-base font-light">
                            Rangkuman statistik strategis Mimika dalam format infografis.
                        </p>
                    </div>
                    <Link href="/infografis" className="text-[#0071bc] font-bold text-xs md:text-sm flex items-center gap-1 hover:text-[#002244] uppercase tracking-widest shrink-0 mb-1">
                        Galeri Infografis <ChevronRight size={16} />
                    </Link>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {INFOGRAFIK_DATA.map((item) => (
                        <div
                            key={item.id}
                            className="group cursor-pointer flex flex-col"
                            onClick={() => setSelectedImg(item)} // KLIK UNTUK BUKA POP-UP
                        >
                            <div className="relative aspect-[3/4] w-full bg-gray-100 border border-gray-200 overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#002244]/0 group-hover:bg-[#002244]/70 transition-all duration-300 flex items-center justify-center">
                                    <div className="bg-[#0071bc] text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                                        <Maximize2 size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 text-left">
                                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">{item.date}</p>
                                <h3 className="text-[#002244] font-bold text-base md:text-lg leading-tight group-hover:text-[#0071bc] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL / POP-UP LIGHTBOX --- */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                >
                    {/* Backdrop Gelap (Klik di sini untuk tutup) */}
                    <div
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
                        onClick={() => setSelectedImg(null)}
                    ></div>

                    {/* Container Modal */}
                    <div className="relative w-full max-w-4xl max-h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

                        {/* Toolbar Modal */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-[#002244] line-clamp-1">{selectedImg.title}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">{selectedImg.date} • {selectedImg.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={selectedImg.image}
                                    download
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                                    title="Download Infografik"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={() => setSelectedImg(null)}
                                    className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Area Gambar (Bisa Scroll jika Portrait panjang) */}
                        <div className="overflow-y-auto bg-gray-50 p-4 md:p-8 flex justify-center custom-scrollbar">
                            <div className="relative w-full max-w-2xl h-auto">
                                <img
                                    src={selectedImg.image}
                                    alt={selectedImg.title}
                                    className="w-full h-auto shadow-xl border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}