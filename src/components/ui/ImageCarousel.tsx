// src/components/ui/ImageCarousel.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Layers, Maximize2 } from "lucide-react"; // [REFACTOR] Icon disesuaikan

import { useExplorerStore } from "@/src/app/store/useExplorerStore"; // [REFACTOR] Injeksi Controller

interface ImageCarouselProps {
    images: string[];
    altText?: string;
}

/**
 * ImageCarousel - Pure Fabrication Pattern
 * Komponen independen untuk merender slider media horizontal menggunakan 
 * CSS Scroll Snap murni. Kini difokuskan sebagai "Pemantik" (Trigger) Mode Teater.
 */
export default function ImageCarousel({ images, altText = "Media Aset" }: ImageCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // [REFACTOR] Menarik aksi Buka Teater dari Global Store
    const { openGallery } = useExplorerStore();

    // Fallback: 0 Gambar
    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-video bg-slate-100 flex flex-col items-center justify-center border-b border-slate-200 shrink-0">
                <Layers size={24} className="text-slate-300 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Tidak Ada Visualisasi
                </span>
            </div>
        );
    }

    // Fallback: 1 Gambar (Klik langsung buka Teater)
    if (images.length === 1) {
        return (
            <button
                onClick={() => openGallery(images, 0, altText)}
                className="relative w-full aspect-video border-b border-slate-200 bg-slate-100 shrink-0 group block cursor-pointer overflow-hidden"
            >
                <Image
                    src={images[0]}
                    alt={altText}
                    fill
                    sizes="280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors pointer-events-none" />

                {/* Overlay Trigger Perbesar */}
                <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 flex items-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                    <Maximize2 size={12} strokeWidth={2.5} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Perbesar</span>
                </div>
            </button>
        );
    }

    // Logika sinkronisasi indikator titik dengan posisi scroll aktual
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const width = scrollContainerRef.current.clientWidth;
        const newIndex = Math.round(scrollPosition / width);
        setActiveIndex(newIndex);
    };

    return (
        <div className="relative w-full aspect-video border-b border-slate-200 bg-slate-900 shrink-0 group">

            {/* CONTAINER SCROLL SNAP (Clean UI - Tanpa Panah) */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {images.map((src, idx) => (
                    <button
                        key={idx}
                        onClick={() => openGallery(images, idx, altText)} // Klik gambar manapun untuk buka Teater
                        className="w-full h-full shrink-0 snap-center relative block cursor-pointer"
                    >
                        <Image
                            src={src}
                            alt={`${altText} - ${idx + 1}`}
                            fill
                            sizes="280px"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                    </button>
                ))}
            </div>

            {/* [REFACTOR] TRIGGER TEATER MODE - Pojok Kanan Bawah */}
            <button
                onClick={() => openGallery(images, activeIndex, altText)}
                className="absolute bottom-2 right-2 z-10 bg-slate-900/80 hover:bg-teal-600 backdrop-blur-md px-2.5 py-1.5 flex items-center gap-1.5 text-white transition-all border border-white/20 shadow-md group-hover:scale-105"
            >
                <Maximize2 size={12} strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Lihat {images.length} Foto</span>
            </button>

            {/* INDIKATOR TITIK (PAGINATION) - Digeser ke Kiri Bawah agar seimbang */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`transition-all duration-300 rounded-none ${idx === activeIndex
                            ? "w-4 h-1.5 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                            : "w-1.5 h-1.5 bg-white/40"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}