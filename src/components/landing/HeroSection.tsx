"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ChevronDown, Loader2, Filter, X, Database } from "lucide-react";
import { useSearchStore } from "@/src/app/store/useSearchStore";
import { useDatasetStore } from "@/src/app/store/useDatasetStore";

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<{ id: string | number, name: string } | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const { datasetsByCategory, isCategoryLoading } = useDatasetStore();
    const {
        fetchSuggestions, clearSuggestions, searchResults,
        isSearching, fetchByCategory, clearResults, isLoadingSuggestions
    } = useSearchStore();

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
        <header className="bg-[#f4f7f9] py-16 md:py-24 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end gap-10">

                <div className="md:w-8/12 space-y-6 relative" ref={searchContainerRef}>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Mimika Open Data</h1>
                        <p className="text-xl text-gray-500 mt-2 font-light">Akses gratis dan terbuka untuk data pembangunan Mimika</p>
                    </div>

                    {/* INPUT SEARCH */}
                    <div className="relative flex items-center bg-white border border-gray-300 rounded-md shadow-sm focus-within:border-[#0071bc] focus-within:ring-1 focus-within:ring-[#0071bc]">
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
                    {searchQuery.trim() !== "" && !isCategoryLoading && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {Object.entries(datasetsByCategory).map(([name, group]: any) => (
                                <button
                                    key={name}
                                    onClick={() => handleCategoryClick(group.category_info.id, name)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory?.name === name
                                        ? "bg-[#0071bc] text-white border-[#0071bc]"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0071bc]"
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* DROPDOWN HASIL PENCARIAN */}
                    {selectedCategory && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden z-[100]">
                            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                                {isSearching ? (
                                    <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#0071bc]" /></div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((dataset: any) => (
                                        <Link key={dataset.id} href={`/dataset/${dataset.id}`} className="block px-6 py-4 hover:bg-gray-50">
                                            <span className="text-sm font-bold text-[#002244]">{dataset.title}</span>
                                            <div className="text-[10px] text-gray-400 uppercase mt-1">Klik untuk detail data</div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-gray-400 text-sm">Data tidak ditemukan</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:w-4/12 pb-2">
                    <p className="text-gray-600 text-sm mb-2 font-medium">Jelajahi Indikator berdasarkan</p>
                    <div className="flex gap-2 text-sm font-bold text-[#0071bc]">
                        <a href="#fitur" className="hover:underline">Sektor OPD</a>
                        <span className="text-gray-300 font-normal">atau</span>
                        <a href="#tematik" className="hover:underline">Tematik</a>
                    </div>
                </div>
            </div>
        </header>
    );
}