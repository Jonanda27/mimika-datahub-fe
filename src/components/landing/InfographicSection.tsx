"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Maximize2,
    ChevronRight,
    X,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from "lucide-react";

const INFOGRAFIK_DATA = [
    {
        id: 1,
        title: "Capaian Makro Ekonomi Kabupaten Mimika Kuartal I 2026",
        date: "08 Mei 2026",
        category: "Ekonomi",
        image: "/infografik/ekonomi/ekonomi-01.jpg",
    },
    {
        id: 2,
        title: "Peta Penurunan Angka Stunting per Distrik Tahun 2025",
        date: "22 April 2026",
        category: "Kesehatan",
        image: "/infografik/kesehatan/kesehatan-01.jpg",
    },
    {
        id: 3,
        title: "Piramida Penduduk & Ketenagakerjaan Mimika 2026",
        date: "15 Maret 2026",
        category: "Demografi",
        image: "/infografik/sosial/sosial-04.jpg",
    }
];

export default function InfographicSection() {
    const [selectedImg, setSelectedImg] = useState<typeof INFOGRAFIK_DATA[0] | null>(null);
    // State baru untuk mengatur level zoom (1 = 100%, 2 = 200%, dst)
    const [zoomLevel, setZoomLevel] = useState(1);

    // Mencegah scroll pada body saat pop-up terbuka
    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [selectedImg]);

    // Fungsi tutup modal dan reset zoom kembali ke 100%
    const handleCloseModal = () => {
        setSelectedImg(null);
        setTimeout(() => setZoomLevel(1), 300); // Reset zoom setelah animasi modal tertutup
    };

    // Fungsi Zoom (Batas min 50%, max 300%)
    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    const handleResetZoom = () => setZoomLevel(1);

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
                            onClick={() => setSelectedImg(item)}
                        >
                            <div className="relative aspect-3/4 w-full bg-gray-100 border border-gray-200 overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl">
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

            {/* --- MODAL / POP-UP LIGHTBOX DENGAN ZOOM --- */}
            {selectedImg && (
                <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">

                    {/* Backdrop Gelap (Klik di sini untuk tutup) */}
                    <div
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>

                    {/* Container Modal */}
                    <div className="relative w-full max-w-5xl max-h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 rounded-lg">

                        {/* TOOLBAR MODAL */}
                        <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shrink-0 gap-4">

                            {/* Info Teks */}
                            <div className="flex flex-col pr-4">
                                <h4 className="text-sm font-bold text-[#002244] line-clamp-1">{selectedImg.title}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">{selectedImg.date} • {selectedImg.category}</p>
                            </div>

                            {/* Action Buttons (Zoom & Actions) */}
                            <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">

                                {/* Controller Zoom */}
                                <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 p-1">
                                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all" title="Zoom Out">
                                        <ZoomOut size={16} />
                                    </button>
                                    <span className="text-[11px] font-bold text-[#002244] w-12 text-center tracking-wider">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>
                                    <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all" title="Zoom In">
                                        <ZoomIn size={16} />
                                    </button>
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    <button onClick={handleResetZoom} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all" title="Reset Zoom">
                                        <RotateCcw size={14} />
                                    </button>
                                </div>

                                {/* Divider & Global Actions */}
                                <div className="flex items-center gap-1 pl-2 border-l border-gray-200">
                                    <a
                                        href={selectedImg.image}
                                        download
                                        className="p-2 hover:bg-gray-100 rounded-full text-[#0071bc] transition-colors"
                                        title="Download Infografik"
                                    >
                                        <Download size={20} />
                                    </a>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* AREA GAMBAR BISA DI-ZOOM & SCROLL */}
                        <div className="overflow-auto bg-slate-100 p-4 md:p-8 flex justify-center items-start custom-scrollbar h-[70vh] md:h-[80vh]">
                            {/* Wrapper gambar dengan transisi lebar (width) yang mulus */}
                            <div
                                className="relative transition-all duration-300 ease-out shrink-0 origin-top"
                                style={{
                                    width: `${zoomLevel * 100}%`,
                                    // Membatasi lebar default di 42rem (max-w-2xl), tapi dilepas jika user nge-zoom (>100%)
                                    maxWidth: zoomLevel <= 1 ? '42rem' : 'none'
                                }}
                            >
                                <img
                                    src={selectedImg.image}
                                    alt={selectedImg.title}
                                    className="w-full h-auto shadow-2xl border border-gray-300"
                                    draggable={false} // Supaya kursor tidak jadi 'grab' bawaan browser yang mengganggu
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}