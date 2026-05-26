// src/components/ui/ImageCarousel.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

interface ImageCarouselProps {
    images: string[];
    altText?: string;
}

/**
 * ImageCarousel - Pure Fabrication Pattern
 * Komponen independen untuk merender slider media horizontal menggunakan 
 * CSS Scroll Snap murni (0 dependency). Aman untuk SSR dan sangat ringan.
 */
export default function ImageCarousel({ images, altText = "Media Aset" }: ImageCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Jika tidak ada gambar, tampilkan fallback "No Image" (Solid UI)
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

    // Jika hanya 1 gambar, render gambar statis biasa tanpa kontrol navigasi
    if (images.length === 1) {
        return (
            <div className="relative w-full aspect-video border-b border-slate-200 bg-slate-100 shrink-0">
                <Image src={images[0]} alt={altText} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent pointer-events-none" />
            </div>
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

    // Navigasi manual via tombol (Smooth Scroll Native)
    const scrollToIndex = (index: number) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
            left: width * index,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full aspect-video border-b border-slate-200 bg-slate-900 shrink-0 group">

            {/* CONTAINER SCROLL SNAP */}
            {/* Menggunakan class penembus webkit untuk menghilangkan scrollbar bawaan browser */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {images.map((src, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                        <Image src={src} alt={`${altText} - ${idx + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* KONTROL NAVIGASI KIRI/KANAN (Muncul saat Hover) */}
            <button
                onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all rounded-none border border-white/20"
            >
                <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            <button
                onClick={() => scrollToIndex(Math.min(activeIndex + 1, images.length - 1))}
                disabled={activeIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all rounded-none border border-white/20"
            >
                <ChevronRight size={16} strokeWidth={2.5} />
            </button>

            {/* INDIKATOR TITIK (PAGINATION) - Posisi absolut di bawah */}
            <div className="absolute bottom-3 left-0 w-full flex justify-center items-center gap-1.5 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollToIndex(idx)}
                        className={`transition-all duration-300 rounded-none ${idx === activeIndex
                                ? "w-4 h-1.5 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                        title={`Lihat gambar ${idx + 1}`}
                    />
                ))}
            </div>

            {/* COUNTER BADGE */}
            <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md px-2 py-1 text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 rounded-none">
                {activeIndex + 1} / {images.length}
            </div>
        </div>
    );
}