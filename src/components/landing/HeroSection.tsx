"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Diperlukan untuk render background yang teroptimasi
import Link from "next/link";
import { Search, ChevronDown, Loader2, Filter, X, Database } from "lucide-react";
import { useSearchStore } from "@/src/app/store/useSearchStore";
import { useCategoryStore } from "@/src/app/store/useCategoryStore"; // [FIX] Import diperbaiki ke store yang benar

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<{ id: string | number, name: string } | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // [FIX] Menggunakan state dari CategoryStore
    const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategoryStore();

    const {
        fetchSuggestions, clearSuggestions, searchResults,
        isSearching, fetchByCategory, clearResults, isLoadingSuggestions
    } = useSearchStore();

    // [FIX] Trigger fetch data kategori saat halaman pertama kali dimuat
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

    const handleCategoryClick = (categoryId: string | number, categoryName: string) => {
        setSelectedCategory({ id: categoryId, name: categoryName });
        fetchByCategory(Number(categoryId), searchQuery);
    };

    return (
        <header className="relative py-16 md:py-24 border-b border-gray-200 overflow-hidden">
            {/* LAYER 0: Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg-mimika.jpg" // Pastikan asset ini ada di direktori public/
                    alt="Mimika Datahub Background"
                    fill
                    className="object-cover object-center"
                    priority // Flag priority agar gambar hero dimuat lebih awal (LCP optimization)
                />
            </div>

            {/* LAYER 1: Overlay / Masking untuk Readability (Transparansi diturunkan) */}
            <div className="absolute inset-0 z-0 bg-white/25 sm:bg-gradient-to-r sm:from-white/35 sm:via-white/20 sm:to-transparent backdrop-blur-[2px]"></div>

            {/* LAYER 2: Foreground Content (Elevasi Z-Index 10) */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end gap-10">

                <div className="md:w-8/12 space-y-6 relative" ref={searchContainerRef}>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight drop-shadow-sm">Mimika Open Data</h1>
                        <p className="text-xl text-gray-700 mt-2 font-light drop-shadow-sm">Akses gratis dan terbuka untuk data pembangunan Mimika</p>
                    </div>

                    {/* INPUT SEARCH */}
                    {/* Shadow ditingkatkan sedikit untuk membedakan kedalaman form dari background */}
                    <div className="relative flex items-center bg-white border border-gray-300 rounded-md shadow-md focus-within:border-[#0071bc] focus-within:ring-1 focus-within:ring-[#0071bc] transition-all">
                        <div className="pl-4"><Search className="text-gray-400" size={20} /></div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari data mis. PDRB, populasi, stunting..."
                            className="w-full py-4 px-4 bg-transparent text-gray-900 focus:outline-none text-lg"
                        />
                        {isLoadingSuggestions && <Loader2 className="animate-spin mr-4 text-[#0071bc]" size={20} />}
                    </div>

                    {/* CHIPS CATEGORY (Muncul saat ngetik) */}
                    {/* [FIX] Looping disesuaikan menggunakan array categories murni dari API */}
                    {searchQuery.trim() !== "" && !isCategoryLoading && categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {categories.map((category: any) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id, category.name)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all shadow-sm ${selectedCategory?.name === category.name
                                        ? "bg-[#0071bc] text-white border-[#0071bc]"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-[#0071bc] hover:text-[#0071bc]"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* DROPDOWN HASIL PENCARIAN */}
                    {/* Z-index ditingkatkan agar tidak tertimpa elemen lain di bawah hero section */}
                    {selectedCategory && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden z-50">
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
                </div>

                <div className="md:w-4/12 pb-2">
                    <p className="text-black text-sm mb-2 font-medium drop-shadow-sm">Jelajahi Indikator berdasarkan</p>
                    <div className="flex gap-2 text-sm font-bold text-[#0071bc]">
                        <a href="#fitur" className="hover:underline drop-shadow-sm">Sektor OPD</a>
                        <span className="text-black font-normal">atau</span>
                        <a href="#tematik" className="hover:underline drop-shadow-sm">Tematik</a>
                    </div>
                </div>
            </div>
        </header>
    );
}