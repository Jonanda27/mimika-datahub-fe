// src/components/gis/GalleryOverlay.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * GalleryOverlay - The Cinematic Theater Component
 * Menampilkan gambar dalam mode layar penuh.
 * [REFACTOR] Menggunakan elevasi z-[35] untuk melakukan Visual Masking terhadap Panel Analisis (z-30).
 */
export default function GalleryOverlay() {
    // Menyadap State dari Zustand
    const { galleryState, closeGallery, setGalleryIndex } = useExplorerStore();

    // Menangani navigasi via Keyboard
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!galleryState?.isOpen) return;

        if (e.key === "Escape") closeGallery();
        if (e.key === "ArrowLeft") {
            setGalleryIndex(Math.max(galleryState.currentIndex - 1, 0));
        }
        if (e.key === "ArrowRight") {
            setGalleryIndex(Math.min(galleryState.currentIndex + 1, galleryState.images.length - 1));
        }
    }, [galleryState, closeGallery, setGalleryIndex]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Jika state null atau isOpen false, hilangkan dari DOM (Render Nothing)
    if (!galleryState || !galleryState.isOpen || !galleryState.images?.length) return null;

    const { images, currentIndex, title } = galleryState;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === images.length - 1;

    return (
        // [REFACTOR] LAYER UTAMA: Z-[35] 
        // Berada persis di atas Panel Analisis & MapHUD (z-30), tapi di bawah Sidebar (z-40) & Navbar (z-50)
        <div className="absolute inset-0 z-35 flex flex-col pt-16 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">

            {/* 
                [REFACTOR] STATIC OFFSET PADDING
                Tidak peduli panel analisis terbuka atau tidak, foto akan tetap berada tepat di tengah sisa layar.
                md:pl-16 (64px) murni digunakan agar foto tidak bertabrakan dengan Sidebar Kiri.
            */}
            <div className="flex flex-col h-full w-full transition-all duration-500 ease-out md:pl-16">

                {/* HEADER INFO & CLOSE BUTTON */}
                <div className="flex justify-between items-center px-6 py-5 shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                            {title || "Galeri Visual"}
                        </h2>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                            Menampilkan {currentIndex + 1} dari {images.length} Media
                        </span>
                    </div>

                    <button
                        onClick={closeGallery}
                        className="p-2 bg-white/10 hover:bg-rose-500 text-slate-300 hover:text-white transition-colors rounded-none border border-white/20 active:scale-95"
                        title="Tutup Mode Teater (Esc)"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* MAIN IMAGE AREA */}
                <div className="flex-1 relative flex items-center justify-center px-4 md:px-12 overflow-hidden group">

                    {/* Tombol Kiri */}
                    <button
                        onClick={() => setGalleryIndex(currentIndex - 1)}
                        disabled={isFirst}
                        className="absolute left-4 md:left-8 z-10 p-3 bg-slate-800/50 hover:bg-teal-600 text-white disabled:opacity-0 transition-all rounded-none border border-white/20 backdrop-blur-sm"
                        title="Sebelumnya (Arrow Left)"
                    >
                        <ChevronLeft size={24} strokeWidth={2} />
                    </button>

                    {/* Gambar Utama (Bypass aspect ratio, prioritaskan contain) */}
                    <div className="relative w-full h-full max-h-[75vh]">
                        <Image
                            src={images[currentIndex]}
                            alt={`Visualisasi ${currentIndex + 1}`}
                            fill
                            className="object-contain drop-shadow-2xl animate-in zoom-in-95 duration-300"
                            sizes="(max-width: 768px) 100vw, 80vw"
                            priority
                        />
                    </div>

                    {/* Tombol Kanan */}
                    <button
                        onClick={() => setGalleryIndex(currentIndex + 1)}
                        disabled={isLast}
                        className="absolute right-4 md:right-8 z-10 p-3 bg-slate-800/50 hover:bg-teal-600 text-white disabled:opacity-0 transition-all rounded-none border border-white/20 backdrop-blur-sm"
                        title="Selanjutnya (Arrow Right)"
                    >
                        <ChevronRight size={24} strokeWidth={2} />
                    </button>
                </div>

                {/* BOTTOM FILMSTRIP (THUMBNAILS) */}
                <div className="h-28 shrink-0 flex items-center justify-center gap-3 px-6 pb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {images.map((img: string, idx: number) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setGalleryIndex(idx)}
                                className={`relative h-16 w-24 shrink-0 transition-all duration-300 rounded-none border-2 overflow-hidden ${isActive
                                    ? "border-teal-400 scale-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] z-10 opacity-100"
                                    : "border-transparent opacity-40 hover:opacity-80"
                                    }`}
                                title={`Ke gambar ${idx + 1}`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                                {isActive && <div className="absolute inset-0 bg-teal-400/10 pointer-events-none" />}
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}