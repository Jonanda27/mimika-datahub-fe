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
  Maximize,
  Loader2
} from "lucide-react";

// Integrasi Store
import { useDatasetStore } from "@/src/app/store/useDatasetStore";

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
              src={bgImage || "/mimika.jpg"} 
              alt={`Background ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
              className="object-cover z-0 rounded-lg"
              priority
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

      <div className="p-6 flex flex-col flex-grow text-black">
        {/* Title dipindah ke atas menggantikan Kategori */}
        <div className="mb-3">
           <h3 className="text-[#002244] font-black text-[15px] uppercase tracking-tight line-clamp-2 leading-snug">
             {title}
           </h3>
        </div>
        
        <div className="mb-4 flex-grow">
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil data dari store
  const { datasetsByCategory, fetchLatestByCategory, isCategoryLoading } = useDatasetStore();

  useEffect(() => {
    setIsMounted(true);
    fetchLatestByCategory();
  }, [fetchLatestByCategory]);

  // Menutup dropdown jika mengklik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#0071bc] selection:text-white overflow-x-hidden">
      
      {/* --- TOP BAR --- */}
      <div className="bg-[#002244] text-white py-1.5 px-4 text-[11px] font-semibold flex justify-end items-center md:px-10 gap-6 uppercase tracking-wider">
        <a href="#" className="hover:text-blue-300 transition-colors">Pemerintah Kabupaten Mimika</a>
        <a href="#" className="hover:text-blue-300 transition-colors">Bappeda</a>
        <a href="#" className="hover:text-blue-300 transition-colors">ID / EN</a>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="w-full bg-white border-b border-gray-200 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-4">
  <div className="relative w-12 h-12 overflow-hidden bg-white p-1">
    <Image 
      src="/logo-mimika.png" 
      alt="Logo Mimika" 
      fill 
      sizes="48px" 
      className="object-contain" 
    />
  </div>
  
  {/* Divider ditambahkan di sini */}
  <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
  
  <div className="flex flex-col">
    <span className="text-2xl font-bold text-[#004b87] leading-none tracking-tight">
      Mimika DataHub
    </span>
  </div>
</Link>

            <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-gray-700 uppercase tracking-wide">
              <a href="#tematik" className="hover:text-[#0071bc] transition-colors">Tema</a>
              <a href="#gis" className="hover:text-[#0071bc] transition-colors">GIS Peta</a>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-1.5 transition-colors uppercase ${isDropdownOpen ? 'text-[#0071bc]' : 'hover:text-[#0071bc]'}`}
                >
                  Data & Resources <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                    <div className="p-2">
                      <Link 
                        href="/public-data-pemerintah" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-[#0071bc] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Building2 size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-[#002244]">Data Pemerintah</span>
                          <span className="text-[10px] text-gray-500 font-medium lowercase">Statistik Sektoral OPD</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/public-data-non-pemerintah" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Users2 size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-[#002244]">Data Non-Pemerintah</span>
                          <span className="text-[10px] text-gray-500 font-medium lowercase">Publik & Mitra Pembangunan</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <a href="#fitur" className="hover:text-[#0071bc] transition-colors">Sektor</a>
              <a href="#statistik" className="hover:text-[#0071bc] transition-colors">Indikator</a>
              <Link href="/login" className="bg-[#0071bc] text-white px-6 py-2.5 rounded-sm hover:bg-[#005a96] transition-shadow shadow-md">
                MASUK SISTEM
              </Link>
            </div>

            <button className="md:hidden p-2 text-[#002244]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 space-y-4 absolute w-full shadow-2xl z-50 font-bold text-[#002244]">
            <a href="#tematik" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Tema</a>
            <a href="#gis" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">Geospatial</a>
            
            <div className="border-b border-gray-50">
              <div className="p-2 text-gray-400 text-[10px] uppercase tracking-widest">Data & Resources</div>
              <Link href="/public-data-pemerintah" onClick={() => setIsMenuOpen(false)} className="block p-3 pl-6 text-sm hover:text-[#0071bc]">Data Pemerintah</Link>
              <Link href="/public-data-non-pemerintah" onClick={() => setIsMenuOpen(false)} className="block p-3 pl-6 text-sm hover:text-[#0071bc]">Data Non-Pemerintah</Link>
            </div>

            <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">By Sector</a>
            <a href="#statistik" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 uppercase">By Indicator</a>
            <Link href="/login" className="block w-full bg-[#0071bc] text-white text-center py-3 rounded-sm uppercase">Portal Masuk</Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="bg-[#002244] py-16 md:py-28 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">Data Pembangunan Mimika</h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-3xl mx-auto text-center font-light leading-relaxed">
            Akses terbuka ke indikator statistik sektoral, demografi, dan profil ekonomi Kabupaten Mimika secara real-time dan transparan.
          </p>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl">
            <div className="relative flex-grow flex items-center bg-white">
              <Search className="absolute left-5 text-gray-400" size={24} />
              <input 
                type="text" 
                placeholder="Cari indikator (contoh: PDRB, Kemiskinan, Pendidikan)..." 
                className="w-full py-5 pl-14 pr-6 text-gray-800 text-lg focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="bg-[#0071bc] hover:bg-[#005a96] text-white py-5 px-12 text-lg font-bold transition-colors uppercase tracking-widest border-l border-blue-400/20">
              Cari Data
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 -skew-x-12 transform translate-x-20"></div>
      </header>

      {/* --- QUICK LINKS --- */}
      <section className="border-b border-gray-200 bg-[#f4f7f9] py-14">
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
              <a href="#gis" className="text-[#0071bc] font-bold text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-1">Buka Peta <ChevronRight size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* --- TEMATIK DATAHUB SECTION --- */}
      <section id="tematik" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">
          <div className="border-b-[4px] border-[#0071bc] pb-6 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
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

      {/* --- GIS PETA SECTION --- */}
      <section id="gis" className="py-20 bg-[#f4f7f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">
          <div className="border-b-[4px] border-[#0071bc] pb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">Sistem Informasi Geospasial</h2>
            <p className="mt-4 text-gray-600 text-lg max-w-4xl font-light">
              Visualisasi sebaran aset, infrastruktur, dan indikator sosial ekonomi Kabupaten Mimika melalui antarmuka peta interaktif profesional.
            </p>
          </div>

          <div className="relative w-full h-[600px] bg-slate-200 border border-gray-200 rounded-2xl overflow-hidden shadow-inner group">
            <Image 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
              alt="Geospatial Map View" 
              fill 
              sizes="100vw"
              className="object-cover opacity-80" 
            />
            
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>

            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="p-3 bg-white shadow-xl rounded-lg text-[#002244] hover:bg-gray-50 transition-all active:scale-95 border border-gray-100">
                <Maximize size={20} />
              </button>
              <div className="flex flex-col bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
                <button className="p-4 text-xl font-bold text-[#002244] border-b border-gray-100 hover:bg-gray-50 transition-colors">+</button>
                <button className="p-4 text-xl font-bold text-[#002244] hover:bg-gray-50 transition-colors">-</button>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 bg-[#002244]/90 backdrop-blur-md px-5 py-3 rounded-lg shadow-2xl border border-white/10 text-[10px] font-mono font-bold text-white flex flex-col gap-1.5 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span>Sistem Koordinat: GCS WGS 1984</span>
              </div>
              <div className="h-px bg-white/20 w-full"></div>
              <span>Lokasi Fokus: Distrik Mimika Baru, Papua Tengah</span>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-black">
               <div className="bg-white px-4 py-2.5 rounded-xl shadow-2xl border border-blue-100 mb-2 relative group-hover:scale-110 transition-transform">
                  <div className="text-[10px] font-black text-[#002244] uppercase leading-none">Distrik Tembagapura</div>
                  <div className="text-[9px] text-blue-600 mt-1.5 font-bold uppercase flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Sektor Pertambangan
                  </div>
               </div>
               <div className="w-5 h-5 bg-[#0071bc] rounded-full border-[5px] border-white shadow-2xl ring-8 ring-blue-500/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DATA SEKTORAL SECTION --- */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-black">
          <div className="border-b-[4px] border-[#0071bc] pb-6">
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

          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-gray-400 gap-6 uppercase tracking-[0.1em]">
            <p>© 2026 PEMERINTAH KABUPATEN MIMIKA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
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