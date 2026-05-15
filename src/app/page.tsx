// src/app/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShieldCheck,
  Menu,
  X,
  Database,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  ChevronDown,
  FileText,
  Building2,
  Users2,
  Loader2,
  ArrowRight,
  Filter
} from "lucide-react";

// Integrasi Store
import { useDatasetStore } from "@/src/app/store/useDatasetStore";
import { useSearchStore } from "@/src/app/store/useSearchStore";

// --- IMPORT KOMPONEN PETA ---
import MapWrapper from "@/src/components/gis/MapWrapper";

// --- DATA: NEWS & STORIES ---
const NEWS_DATA = {
  featured: {
    id: 1,
    title: "Freeport Setor Tambahan Rp2,88 Triliun untuk Pemda di Papua Tengah dari Bagian Keuntungan Bersih 2025",
    date: "08 Mei 2026",
    category: "Ekonomi dan Pembangunan",
    excerpt: "PT Freeport Indonesia (PTFI) pada tanggal 8 April 2026 menyetorkan Rp2,88 triliun bagian keuntungan bersih tahun 2025 kepada Pemerintah Provinsi Papua Tengah termasuk delapan kabupaten di wilayahnya sebagai tambahan dari setoran sebesar Rp10,6 trilliun yang sudah dibayarkan sepanjang tahun 2025.",
    image: "/berita.jpeg",
    url: "https://beritamimika.com"
  },
  list: [
    {
      id: 2,
      title: "8 Pemuda Suku Kamoro Lulus IPN, Siap Kerja di Industri Perhotelan",
      date: "12 Mei 2026",
      category: "Ekonomi dan Pembangunan",
      image: "/berita2.jpeg",
      url: "https://beritamimika.com"
    },
    {
      id: 3,
      title: "Kadisperindag : Harga LPG 12 Kg di Outlet Harus Rp390 Ribu",
      date: "08 Mei 2026",
      category: "Ekonomi dan Pembangunan",
      image: "/berita3.jpeg",
      url: "https://beritamimika.com"
    },
    {
      id: 4,
      title: "Warga Mimika Masih Bandel, Mickey Mouse Akhirnya Turun ke Jalan",
      date: "02 Februari 2021",
      category: "Kesehatan",
      image: "/berita4.jpeg",
      url: "https://beritamimika.com"
    }
  ]
};

// --- TYPE DEFINITIONS ---
interface ThemeCardProps {
  title: string;
  description: string;
  year: number | string;
  sourceName: string;
  sourceType: number | string;
  profileLink: string;
  imagePath: string;
  bgImage?: string;
}

// --- KOMPONEN KARTU TEMATIK ---
function ThemeCard({
  title,
  description,
  year,
  sourceName,
  sourceType,
  profileLink,
  imagePath,
  bgImage
}: ThemeCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden">
      <div className="h-64 w-full relative shrink-0">
        <div className="absolute inset-0 p-4">
          <div className="relative w-full h-full">
            <Image
              src={bgImage || "/bg-mimika.jpg"}
              alt={`Background ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
              className="object-cover z-0 rounded-lg"
            />
          </div>
        </div>
        <Image
          src={imagePath || "/placeholder-icon.png"}
          alt={`Ikon ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          className="object-contain z-10 p-4"
        />
      </div>

      <div className="p-6 flex flex-col grow text-black">
        <div className="mb-3">
          <h3 className="text-[#002244] font-black text-[15px] uppercase tracking-tight line-clamp-2 leading-snug">
            {title}
          </h3>
        </div>

        <div className="mb-4 grow">
          <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-3">
            {description || "Tidak ada deskripsi spesifik."}
          </p>
        </div>

        <div className="text-right mb-6">
          <p className="text-[#002244] text-5xl font-black leading-none tracking-tighter">{year || "-"}</p>
          <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase tracking-wider line-clamp-1">
            {sourceName} • {sourceType}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          <a href="#" className="text-[#0071bc] text-sm font-bold hover:text-[#002244] transition-colors flex items-center gap-1 group">
            {profileLink}
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // State untuk Integrasi Pencarian Sesuai UI Baru
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{ id: string | number, name: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { datasetsByCategory, fetchLatestByCategory, isCategoryLoading } = useDatasetStore();

  // Destructure Search Store
  const {
    suggestions,
    isLoadingSuggestions,
    fetchSuggestions,
    clearSuggestions,
    searchResults,
    isSearching,
    fetchByCategory,
    clearResults
  } = useSearchStore();

  // Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Initial Fetch
  useEffect(() => {
    setIsMounted(true);
    fetchLatestByCategory();
  }, [fetchLatestByCategory]);

  // Handle Dropdown Nav & Search Clicks Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Tutup dropdown dataset jika klik di luar container pencarian
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSelectedCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Debounce API Call
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchSuggestions(searchQuery);
        // Reset pilihan kategori jika user mengetik ulang
        setSelectedCategory(null);
        clearResults();
      } else {
        clearSuggestions();
        setSelectedCategory(null);
        clearResults();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchSuggestions, clearSuggestions, clearResults]);

  // Action ketika kategori chip ditekan
  const handleCategoryClick = (categoryId: string | number, categoryName: string) => {
    if (!categoryId || isNaN(Number(categoryId))) return;

    setSelectedCategory({ id: categoryId, name: categoryName });
    fetchByCategory(Number(categoryId), searchQuery);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#0071bc] selection:text-white overflow-x-hidden">

      {/* --- DYNAMIC NAVIGATION --- */}
      <nav
        className={`fixed top-0 w-full z-100 transition-all duration-500 ${scrolled
          ? "bg-white border-b border-gray-200 py-2 shadow-md"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <div className={`relative w-12 h-12 overflow-hidden p-1 transition-all ${scrolled ? "bg-transparent" : "bg-white/10 backdrop-blur rounded-lg"}`}>
                <Image
                  src="/logo-mimika.png"
                  alt="Logo Mimika"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className={`h-8 w-px hidden sm:block ${scrolled ? "bg-gray-300" : "bg-white/30"}`}></div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold leading-none tracking-tight transition-colors ${scrolled ? "text-[#004b87]" : "text-white"}`}>
                  Mimika DataHub
                </span>
              </div>
            </Link>

            <div className={`hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-wide transition-colors ${scrolled ? "text-gray-700" : "text-white/90"}`}>
              <a href="#tematik" className="hover:text-[#0071bc] transition-colors">Tema</a>

              <Link
                href="/explorer"
                className="hover:text-[#0071bc] transition-colors font-bold flex items-center gap-2"
              >
                <span className="relative">
                  GIS Peta
                  {/* Opsional: Badge kecil untuk menandai ini fitur baru/canggih */}
                  <span className="absolute -top-3 -right-6 text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                    PRO
                  </span>
                </span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 transition-colors uppercase hover:text-[#0071bc]"
                >
                  Data & Resources <ChevronDown size={14} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-60">
                    <div className="p-2">
                      <Link
                        href="/public-data-pemerintah"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-[#0071bc]">
                          <Building2 size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black text-[#002244]">Data Pemerintah</span>
                          <span className="text-[10px] text-gray-500 font-medium">Statistik Sektoral OPD</span>
                        </div>
                      </Link>
                      <Link
                        href="/public-data-non-pemerintah"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600">
                          <Users2 size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black text-[#002244]">Data Non-Pemerintah</span>
                          <span className="text-[10px] text-gray-500 font-medium">Publik & Mitra Pembangunan</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <a href="#fitur" className="hover:text-[#0071bc] transition-colors">Sektor</a>
              <Link href="/login" className={`px-6 py-2.5 rounded-sm transition-all shadow-md font-black ${scrolled
                ? "bg-[#0071bc] text-white hover:bg-[#005a96]"
                : "bg-white text-[#002244] hover:bg-gray-100"
                }`}>
                MASUK SISTEM
              </Link>
            </div>

            <button className={`md:hidden p-2 transition-colors ${scrolled ? "text-[#002244]" : "text-white"}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 space-y-4 absolute w-full shadow-2xl z-50 font-bold text-[#002244]">
            <a href="#tematik" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Tema</a>
            <a href="#gis" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Geospatial</a>
            <Link href="/public-data-pemerintah" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Data Pemerintah</Link>
            <Link href="/public-data-non-pemerintah" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Data Non-Pemerintah</Link>
            <Link href="/login" className="block w-full bg-[#0071bc] text-white text-center py-3 rounded-sm uppercase">Portal Masuk</Link>
          </div>
        )}
      </nav>

      {/* --- MINIMALIST HERO SECTION WITH BG-MIMIKA.JPG --- */}
      <header className="relative min-h-[90vh] flex items-center justify-center z-60">

        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/bg-mimika.jpg"
            alt="Background Mimika"
            fill
            className="object-cover scale-100"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#f4f7f9] via-transparent to-slate-950/50"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full mt-10">
          <div className="space-y-8">

            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
              Akses Data Terpadu <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-emerald-400">Kabupaten Mimika</span>
            </h1>

            <div className="max-w-4xl mx-auto mt-8 relative z-70 text-left" ref={searchContainerRef}>

              <div className="relative w-full flex flex-col items-center">

                {/* 1. Box Search Input */}
                <div className="w-full relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative flex items-center bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-2 transition-all border border-white/50">
                    <div className="grow flex items-center px-4">
                      <Search className={`mr-3 transition-colors text-[#0071bc]`} size={24} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ketik kata kunci pencarian (contoh: stunting, pdrb)..."
                        className="w-full py-4 bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400 font-bold text-base md:text-lg"
                      />
                      {isLoadingSuggestions && (
                        <Loader2 className="animate-spin text-[#0071bc] ml-3 shrink-0" size={20} />
                      )}
                    </div>
                    <Link
                      href={`/public-data-pemerintah?q=${encodeURIComponent(searchQuery)}`}
                      className="bg-[#0071bc] hover:bg-[#005a96] text-white py-4 px-8 md:px-10 text-sm font-black transition-all uppercase tracking-widest rounded-xl shadow-lg active:scale-95 shrink-0 text-center"
                    >
                      Cari Data
                    </Link>
                  </div>
                </div>

                {/* 2. Category Chips Panel */}
                {searchQuery.trim() !== "" && !isCategoryLoading && (
                  <div className="w-full mt-3 p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-3 px-1 text-white/80">
                      <Filter size={16} />
                      <span className="text-xs font-semibold uppercase tracking-widest">Filter Berdasarkan Kategori</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {Object.entries(datasetsByCategory).map(([categoryName, group], index) => {
                        const cat = (group.category_info || {}) as any;
                        const ds = (group.datasets?.[0] || {}) as any;

                        const rawId = cat.id || ds.category_id || (index + 1);
                        const catId = Number(rawId);
                        const catName = cat.name || categoryName;

                        const isSelected = selectedCategory?.id === catId;

                        return (
                          <button
                            key={`chip-${categoryName}-${index}`}
                            onClick={() => handleCategoryClick(catId, catName)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 backdrop-blur-md flex items-center gap-2 ${isSelected
                              ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105"
                              : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:border-white/40"
                              }`}
                          >
                            {catName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Dropdown Dataset */}
                {selectedCategory && (
                  <div className="absolute top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden text-left border border-white/50 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="p-4 bg-linear-to-r from-blue-50 to-emerald-50 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Hasil untuk <span className="font-bold text-[#002244]">"{searchQuery}"</span> di <span className="font-bold text-emerald-600">{selectedCategory.name}</span>
                      </span>
                      <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="max-h-[40vh] overflow-y-auto py-2 divide-y divide-gray-50 custom-scrollbar">
                      {isSearching ? (
                        <div className="p-10 flex flex-col items-center justify-center gap-3 text-gray-500">
                          <Loader2 className="animate-spin text-[#0071bc]" size={32} />
                          <span className="text-sm font-medium animate-pulse">Menyaring dataset...</span>
                        </div>
                      ) : searchResults && searchResults.length > 0 ? (
                        searchResults.map(dataset => (
                          <Link
                            key={`res-${dataset.id}`}
                            href={`/public-data-${dataset.dataset_type}?q=${encodeURIComponent(dataset.title)}`}
                            className="flex flex-col px-6 py-4 hover:bg-blue-50/50 transition-colors group"
                          >
                            <span className="text-sm font-bold text-[#002244] group-hover:text-[#0071bc] leading-tight line-clamp-2">
                              {dataset.title}
                            </span>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-[#0071bc] font-black uppercase tracking-widest bg-blue-100/50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                                {dataset.dataset_type === "pemerintah" ? "Pemerintah" : "Non-Pemerintah"}
                              </span>
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Database size={12} /> Klik untuk melihat data
                              </span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="text-gray-300" size={28} />
                          </div>
                          <p className="text-gray-900 text-sm font-bold">Tidak Ditemukan</p>
                          <p className="text-gray-500 text-xs font-medium mt-1">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- QUICK LINKS --- */}
      <section className="border-b border-gray-200 bg-[#f4f7f9] py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-12 md:gap-4 md:divide-x divide-gray-300">
            <div className="px-6">
              <Database className="mx-auto text-[#0071bc] mb-4" size={40} />
              <h3 className="text-xl font-bold text-[#002244] mb-3 uppercase tracking-tight">Data Sektoral</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Eksplorasi data mentah berdasarkan Organisasi Perangkat Daerah (OPD).</p>
              <a href="#fitur" className="text-[#0071bc] font-bold text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-1">Lihat Sektor <ChevronRight size={14} /></a>
            </div>
            <div className="px-6">
              <BarChart3 className="mx-auto text-[#0071bc] mb-4" size={40} />
              <h3 className="text-xl font-bold text-[#002244] mb-3 uppercase tracking-tight">Indikator Utama</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Runtun waktu indikator makro pembangunan daerah Mimika.</p>
              <a href="#statistik" className="text-[#0071bc] font-bold text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-1">Lihat Indikator <ChevronRight size={14} /></a>
            </div>
            <div className="px-6">
              <Globe className="mx-auto text-[#0071bc] mb-4" size={40} />
              <h3 className="text-xl font-bold text-[#002244] mb-3 uppercase tracking-tight">GIS Mimika</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Pemetaan visual kondisi pembangunan antar distrik secara geospasial.</p>
              <Link href="/explorer" className="text-[#0071bc] font-bold text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-1">Buka Peta <ChevronRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- TEMATIK DATAHUB SECTION --- */}
      <section id="tematik" className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">
          <div className="border-b-4 border-[#0071bc] pb-6 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">Fokus Tematik</h2>
              <p className="mt-4 text-gray-700 text-lg max-w-4xl font-light">
                Koleksi data terkurasi untuk mendukung perencanaan pembangunan Kabupaten Mimika melalui fokus tematik Satu Data Indonesia.
              </p>
            </div>
            {isCategoryLoading && <Loader2 className="animate-spin text-[#0071bc] mb-4" size={24} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {!isCategoryLoading && Object.entries(datasetsByCategory).map(([categoryName, group]) => {
              const ds = group.datasets[0];
              if (!ds) return null;

              return (
                <ThemeCard
                  key={categoryName}
                  title={ds.title || "Tanpa Judul"}
                  description={ds.description || ""}
                  year={ds.year || "N/A"}
                  sourceName={ds.source_name || "-"}
                  sourceType={ds.source_type_id || "-"}
                  profileLink={`Profil ${group.category_info.name}`}
                  imagePath={group.category_info.template_url || ""}
                  bgImage={ds.image_url || ""}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FASE PREVIEW: GIS PETA SECTION --- */}
      <section id="gis" className="py-20 bg-[#f4f7f9]">
        {/* 1. Kontainer Header Teks */}
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 text-black mb-10">
          <div className="border-b-4 border-[#0071bc] pb-6 flex flex-col md:flex-row justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">Sistem Informasi Geospasial</h2>
              <p className="mt-4 text-gray-600 text-lg max-w-4xl font-light">
                Visualisasi sebaran aset, infrastruktur, dan indikator sosial ekonomi Kabupaten Mimika melalui antarmuka peta interaktif profesional.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Kontainer Peta Preview dengan CTA Overlay */}
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[75vh] min-h-150 max-h-225 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-gray-100 group">

            {/* Shield/Lock Layer: Mengunci interaksi peta dari scroll/drag (Best Practice UX) */}
            <div className="w-full h-full pointer-events-none">
              {/* Injeksi isPreviewMode ke MapWrapper */}
              <MapWrapper isPreviewMode={true} />
            </div>

            {/* Overlay Call to Action (Glassmorphism Modal) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-[2px] transition-all duration-500">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-3xl flex flex-col items-center text-center max-w-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transform transition-transform duration-500 group-hover:scale-105">

                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 text-blue-400 border border-blue-500/30 relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <Globe size={32} className="relative z-10" />
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Mimika Immersive Explorer</h3>
                <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed px-4">
                  Masuk ke ruang kerja khusus untuk menganalisa metrik kewilayahan, distribusi sektoral, dan indikator pembangunan antar distrik secara interaktif.
                </p>

                <Link
                  href="/explorer"
                  className="flex items-center gap-3 bg-[#0071bc] hover:bg-[#005a96] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,113,188,0.4)] hover:shadow-[0_0_30px_rgba(0,113,188,0.6)] transition-all duration-300 active:scale-95"
                >
                  Buka Mode Eksplorasi <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- NEWS & STORIES SECTION --- */}
      <section className="py-20 bg-[#f8fafc] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 border-b-4 border-[#0071bc] pb-6">
            <h2 className="text-3xl font-bold text-[#002244] uppercase tracking-tight">Berita & Publikasi</h2>
            <a
              href="https://beritamimika.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-[#0071bc] font-bold text-sm items-center gap-1 hover:text-[#002244] transition-colors uppercase tracking-widest"
            >
              Lihat Semua <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <a
              href={NEWS_DATA.featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:col-span-2 group flex flex-col"
            >
              <div className="relative w-full h-72 md:h-112.5 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={NEWS_DATA.featured.image}
                  alt={NEWS_DATA.featured.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0071bc] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                  {NEWS_DATA.featured.category}
                </div>
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-3">{NEWS_DATA.featured.date}</p>
              <h3 className="text-2xl md:text-3xl font-black text-[#002244] mb-4 hover:text-[#0071bc] transition-colors leading-tight">
                {NEWS_DATA.featured.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6 grow">
                {NEWS_DATA.featured.excerpt}
              </p>
              <span className="text-[#0071bc] font-bold text-sm uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                Baca Selengkapnya <ArrowRight size={16} />
              </span>
            </a>

            <div className="flex flex-col gap-8 lg:border-l border-gray-200 lg:pl-10">
              {NEWS_DATA.list.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-5 group items-start"
                >
                  <div className="relative w-28 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-1.5">
                      {item.date} • {item.category}
                    </p>
                    <h4 className="text-sm font-bold text-[#002244] leading-snug group-hover:text-[#0071bc] transition-colors line-clamp-3">
                      {item.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- DATA SEKTORAL SECTION --- */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">
          <div className="border-b-4 border-[#0071bc] pb-6">
            <h2 className="text-3xl font-bold text-[#002244] uppercase tracking-tight">Transparansi Data Sektoral</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
            <div className="md:col-span-4 bg-[#f8fafc] border border-gray-200 p-10 flex flex-col justify-between shadow-sm rounded-sm">
              <div>
                <h3 className="text-2xl font-bold text-[#002244] mb-6">Analisis Indikator Makro Ekonomi</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  Mimika DataHub menyediakan dasbor interaktif yang dirancang untuk membantu pengambil kebijakan dan publik memantau pertumbuhan ekonomi serta tata kelola data secara efisien sesuai standar nasional.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-3">
                    <FileText size={24} className="text-[#0071bc] shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">Kepatuhan Standar Satu Data Indonesia</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={24} className="text-[#0071bc] shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">Integritas & Keamanan Data Terjamin</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap size={24} className="text-[#0071bc] shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">Update Berkala dari 54 Instansi</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 size={24} className="text-[#0071bc] shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">Visualisasi Grafik Dinamis</span>
                  </div>
                </div>
              </div>
              <a href="#" className="inline-block bg-[#0071bc] text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-[#005a96] transition-colors w-max shadow-lg rounded-sm">
                Buka Dashboard Sektoral
              </a>
            </div>

            <div className="md:col-span-2 space-y-8" id="statistik">
              <div className="bg-[#002244] text-white p-8 shadow-xl rounded-sm">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-[0.2em] mb-6">Status Portal</h4>
                <div className="space-y-6">
                  <StatItem label="Total Dataset" val="2,450" />
                  <StatItem label="Instansi OPD" val="54" />
                  <StatItem label="Verifikasi" val="100%" />
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-blue-100 text-xs font-bold uppercase">Sinkronisasi</span>
                    <span className="text-green-400 font-bold text-lg uppercase">Aktif</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
                <h4 className="text-[#002244] font-bold mb-4 uppercase text-xs tracking-wider">Akses Data API</h4>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Kami menyediakan akses sistem bagi pengembang dan pengelola data OPD melalui portal terenkripsi.
                </p>
                <Link href="/login" className="block text-center border-2 border-[#0071bc] text-[#0071bc] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#0071bc] hover:text-white transition-colors">
                  Portal Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#333333] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-600 pb-12 mb-10 text-white">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 bg-white p-1 rounded-sm">
                  <Image src="/logo-mimika.png" alt="Logo" fill sizes="40px" className="object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight">Mimika DataHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pusat data terintegrasi Kabupaten Mimika, Papua Tengah. Mewujudkan transparansi informasi pembangunan daerah.
              </p>
            </div>
            <FooterColumn title="LEMBAGA" links={["Informasi Umum", "Struktur Organisasi", "Dasar Hukum", "Kontak Kami"]} />
            <FooterColumn title="NAVIGASI" links={["Katalog Data", "Metadata", "Microdata", "Publikasi Statistik"]} />
            <FooterColumn title="BANTUAN" links={["Panduan Pengguna", "Dokumentasi API", "FAQ", "Lapor Bug"]} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-gray-400 gap-6 uppercase tracking-widest">
            <p>© 2026 PEMERINTAH KABUPATEN MIMIKA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar Styling (Khusus untuk dropdown) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatItem({ label, val }: { label: string, val: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/10 pb-2">
      <span className="text-blue-100 text-xs font-bold uppercase">{label}</span>
      <span className="text-white text-2xl font-bold leading-none tracking-tighter">{val}</span>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div>
      <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">{title}</h4>
      <ul className="space-y-3">
        {links.map((l, i) => (
          <li key={i}>
            <a href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors font-medium">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}