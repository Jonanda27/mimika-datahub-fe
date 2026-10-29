"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2, Play, Pause } from "lucide-react";
import { useSearchStore } from "@/src/app/store/useSearchStore";
import { useCategoryStore } from "@/src/app/store/useCategoryStore";

const HERO_SCENES = [
    {
        src: "/video/hero-civil-servants.mp4",
        title: "Pelayanan Publik & Kolaborasi OPD",
        tag: "Aparatur Daerah",
    },
    {
        src: "/video/hero-field-surveyor.mp4",
        title: "Survei Aset & Infrastruktur Daerah",
        tag: "Infrastruktur",
    },
    {
        src: "/video/hero-local-merchant.mp4",
        title: "Denyut Perekonomian & Kesejahteraan Warga",
        tag: "Ekonomi Rakyat",
    },
    {
        src: "/video/hero-researchers.mp4",
        title: "Riset Kebijakan & Analisis Terpadu",
        tag: "Riset & Sains",
    },
];

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<{ id: string | number, name: string } | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Video State
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Store Kategori & Search
    const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategoryStore();
    const {
        fetchSuggestions, clearSuggestions, searchResults,
        isSearching, fetchByCategory, clearResults, isLoadingSuggestions
    } = useSearchStore();

    // Trigger fetch kategori saat halaman pertama dimuat
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle Klik di luar untuk menutup dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSelectedCategory(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim() !== "") {
                fetchSuggestions(searchQuery);
            } else {
                clearSuggestions();
                setSelectedCategory(null);
                clearResults();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchSuggestions, clearSuggestions, clearResults]);

    // Video switch & play effect
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            if (isPlaying) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Browser autoplay policy handling
                    });
                }
            }
        }
    }, [activeVideoIndex]);

    const handleVideoEnded = () => {
        setActiveVideoIndex((prev) => (prev + 1) % HERO_SCENES.length);
    };

    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleCategoryClick = (categoryId: string | number, categoryName: string) => {
        setSelectedCategory({ id: categoryId, name: categoryName });
        fetchByCategory(Number(categoryId), searchQuery);
    };

    return (
        <header className="relative min-h-[500px] sm:min-h-[540px] md:min-h-[600px] flex flex-col justify-end overflow-hidden bg-slate-950 pb-8 sm:pb-10 md:pb-14 pt-20">
            {/* LAYER 0: Background Video 100% Jernih (Tanpa Blur) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    ref={videoRef}
                    key={HERO_SCENES[activeVideoIndex].src}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="/bg-mimika.jpg"
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-cover object-center"
                >
                    <source src={HERO_SCENES[activeVideoIndex].src} type="video/mp4" />
                </video>
            </div>

            {/* LAYER 1: Gradient Anggun dari Bawah ke Atas (Bagian atas video tetap jernih & terang, teks di bawah kontras 100%) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent hidden md:block"></div>

            {/* LAYER 2: Foreground Content (Ditaruh di Bawah Hero Section) */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">

                <div className="w-full md:w-8/12 space-y-4 md:space-y-5 relative" ref={searchContainerRef}>
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
                            GovDataHub Open Data
                        </h1>
                        <p className="text-xs sm:text-sm md:text-lg text-gray-200 mt-1 md:mt-2 font-normal drop-shadow">
                            Akses gratis dan terbuka untuk data pembangunan Pemerintah Daerah
                        </p>
                    </div>

                    {/* INPUT SEARCH */}
                    <div className="relative flex items-center bg-white border border-white/20 rounded-md shadow-2xl focus-within:border-[#0071bc] focus-within:ring-2 focus-within:ring-[#0071bc] transition-all">
                        <div className="pl-3.5 md:pl-4"><Search className="text-gray-400" size={20} /></div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari data mis. PDRB, populasi, stunting..."
                            className="w-full py-3 md:py-4 px-3 md:px-4 bg-transparent text-gray-900 focus:outline-none text-sm md:text-lg placeholder:text-gray-400"
                        />
                        {isLoadingSuggestions && <Loader2 className="animate-spin mr-3 md:mr-4 text-[#0071bc]" size={18} />}
                    </div>

                    {/* CHIPS CATEGORY (Muncul saat mengetik) */}
                    {searchQuery.trim() !== "" && !isCategoryLoading && categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                            {categories.map((category: any) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id, category.name)}
                                    className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold border transition-all shadow-md ${selectedCategory?.name === category.name
                                        ? "bg-[#0071bc] text-white border-[#0071bc]"
                                        : "bg-white/90 text-gray-800 border-white/40 hover:bg-white hover:text-[#0071bc]"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* DROPDOWN HASIL PENCARIAN */}
                    {selectedCategory && (
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden z-50">
                            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                                {isSearching ? (
                                    <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#0071bc]" /></div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((dataset: any) => (
                                        <Link key={dataset.id} href={`/dataset/${dataset.id}`} className="block px-6 py-4 hover:bg-gray-50">
                                            <span className="text-sm font-bold text-[#002244]">{dataset.title}</span>
                                            <div className="text-[10px] text-gray-500 uppercase mt-1">Klik untuk detail data</div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-gray-500 text-sm">Data tidak ditemukan</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MINI SCENE CONTROLLER BAR & MOBILE INLINE EXPLORE */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 bg-slate-900/80 border border-white/20 px-3 py-1 rounded-full shadow-lg">
                            <button
                                onClick={togglePlayPause}
                                className="p-0.5 text-white/80 hover:text-white transition-colors focus:outline-none"
                                title={isPlaying ? "Jeda Tayangan" : "Putar Tayangan"}
                                aria-label="Toggle play pause"
                            >
                                {isPlaying ? <Pause size={12} className="text-white" /> : <Play size={12} className="text-white" />}
                            </button>
                            <span className="font-semibold text-white text-[10px] md:text-[11px] uppercase tracking-wide">
                                {HERO_SCENES[activeVideoIndex].tag}
                            </span>
                            <span className="text-white/30 hidden sm:inline">|</span>
                            <span className="hidden sm:inline text-gray-200 text-[11px]">
                                {HERO_SCENES[activeVideoIndex].title}
                            </span>
                            <div className="flex items-center gap-1.5 ml-1">
                                {HERO_SCENES.map((scene, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveVideoIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all focus:outline-none ${activeVideoIndex === idx
                                            ? "w-3.5 bg-sky-400"
                                            : "w-1.5 bg-white/40 hover:bg-white/70"
                                            }`}
                                        title={scene.title}
                                        aria-label={`Pindah ke ${scene.title}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Link Cepat Indikator (Mobile Inline) */}
                        <div className="md:hidden flex items-center gap-1.5 text-xs text-white/90">
                            <span className="text-gray-300 text-[11px]">Jelajahi:</span>
                            <a href="#fitur" className="text-sky-300 font-bold hover:underline">Sektor OPD</a>
                            <span className="text-white/40">•</span>
                            <a href="#tematik" className="text-sky-300 font-bold hover:underline">Tematik</a>
                        </div>
                    </div>
                </div>

                {/* DESKTOP RIGHT EXPLORE PROMPT */}
                <div className="hidden md:block md:w-4/12 pb-2">
                    <p className="text-white text-sm mb-2 font-medium drop-shadow">Jelajahi Indikator berdasarkan</p>
                    <div className="flex gap-2 text-sm font-bold">
                        <a href="#fitur" className="text-sky-300 hover:text-white hover:underline drop-shadow">Sektor OPD</a>
                        <span className="text-white/80 font-normal">atau</span>
                        <a href="#tematik" className="text-sky-300 hover:text-white hover:underline drop-shadow">Tematik</a>
                    </div>
                </div>
            </div>
        </header>
    );
}
