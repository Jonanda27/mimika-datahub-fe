"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ShieldCheck, 
  LayoutGrid, 
  ArrowRight,
  Menu, 
  X, 
  Database, 
  BarChart3,
  Globe, 
  Zap,
  ChevronRight,
  Layers,
  FileText,
  UserCheck
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-2 shadow-lg" : "bg-transparent py-4 lg:py-6"
      }`}>
        <div className="w-full px-5 lg:px-10">
          <div className="flex justify-between items-center">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 relative z-[120]">
              <div className="relative w-10 h-10 lg:w-11 lg:h-11 overflow-hidden rounded-lg bg-white p-1 shadow-lg">
                <Image 
                  src="/logo-mimika.png" 
                  alt="Logo Mimika" 
                  width={38} 
                  height={38} 
                  className="object-contain w-full h-full" 
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl lg:text-2xl font-[1000] tracking-tighter leading-none uppercase transition-colors duration-300 ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  Mimika
                </span>
                <span className={`text-[9px] lg:text-[11px] font-bold tracking-[0.3em] leading-none mt-1 uppercase ${
                  scrolled ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  DataHub
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className={`hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] ${
              scrolled ? 'text-slate-600' : 'text-white/90'
            }`}>
              <a href="#fitur" className="hover:text-blue-500 transition-all">Fitur</a>
              <a href="#statistik" className="hover:text-blue-500 transition-all">Statistik</a>
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 active:scale-95">
                Portal Masuk <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className={`md:hidden p-2 rounded-lg relative z-[120] transition-all ${
                scrolled || isMenuOpen ? 'text-slate-900' : 'text-white'
              }`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE SIDEBAR --- */}
        <div 
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMenu}
        />
        
        <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[115] shadow-2xl transition-transform duration-500 ease-in-out md:hidden flex flex-col p-8 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="mt-20 flex flex-col gap-6 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 text-left">Navigation</p>
            <a href="#fitur" onClick={closeMenu} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between">
              Fitur <ChevronRight size={16} />
            </a>
            <a href="#statistik" onClick={closeMenu} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between">
              Statistik <ChevronRight size={16} />
            </a>
            <div className="mt-8">
              <Link href="/login" onClick={closeMenu} className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold shadow-lg shadow-blue-200">
                MASUK SISTEM
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {/* Optimasi: Mengurangi pt-20 menjadi pt-12 pada mobile untuk menaikkan teks */}
      <header className="relative min-h-screen flex items-center pt-12 md:pt-20 lg:pt-0 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/mimika.jpg" 
            alt="Mimika Background"
            fill
            priority
            className="object-cover object-center scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-slate-950/50 z-10"></div> 
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white via-white/20 to-transparent z-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-30">
          <div className="text-center space-y-6 md:space-y-8 lg:space-y-12 max-w-5xl mx-auto">
            
            {/* Optimasi Font: Mobile text-5xl, iPad text-7xl, Desktop text-[100px] */}
            <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-[1000] text-white leading-[1] lg:leading-[0.85] tracking-[-0.05em] drop-shadow-2xl animate-fade-in-up">
              Satu Pintu Untuk <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Data Mimika.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md animate-fade-in-up px-2" style={{ animationDelay: '200ms' }}>
              Integrasi data sektoral real-time untuk perencanaan pembangunan Kabupaten Mimika yang lebih cerdas dan transparan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link href="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                Buka Dashboard <Layers size={18} />
              </Link>
              <a href="#fitur" className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                Pelajari Sistem <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* --- STATS SECTION --- */}
      <section id="statistik" className="py-16 lg:py-24 bg-white relative z-30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StatCard icon={<Database size={24} />} val="2,450+" label="Dataset Sektoral" />
            <StatCard icon={<Globe size={24} />} val="54" label="Instansi (OPD)" />
            <StatCard icon={<UserCheck size={24} />} val="100%" label="Verifikasi Data" />
            <StatCard icon={<Zap size={24} />} val="Realtime" label="Update Sistem" />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="fitur" className="py-20 lg:py-32 bg-slate-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-8 text-left">
            <div className="space-y-3">
              <h2 className="text-blue-600 font-black text-sm uppercase tracking-[0.5em]">Platform</h2>
              <p className="text-4xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none">Terstruktur.</p>
            </div>
            <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-base">
              Standarisasi tata kelola data untuk efisiensi birokrasi di Kabupaten Mimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
            <div className="md:col-span-4 bg-white rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-14 border border-slate-200 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative min-h-[350px] lg:min-h-[500px] flex flex-col justify-between">
              <div className="relative z-10 max-w-md text-left">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight">Visualisasi Data Dinamis</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Dashboard interaktif yang memudahkan pimpinan daerah memantau indikator makro ekonomi secara cepat.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 opacity-20 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                 <Image src="/chart.jpg" alt="Chart" fill className="object-contain grayscale" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 flex flex-col">
              <div className="flex-1 bg-indigo-600 rounded-[2rem] lg:rounded-[3rem] p-8 text-white group overflow-hidden relative min-h-[220px] flex flex-col justify-center text-left">
                 <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                       <FileText size={26} />
                    </div>
                    <h3 className="text-2xl font-black">Standar SDI</h3>
                    <p className="text-indigo-100 text-sm font-medium">Sesuai teknis Satu Data Indonesia untuk integrasi data.</p>
                 </div>
                 <Layers className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10" />
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] lg:rounded-[3rem] p-8 flex flex-col justify-center group hover:border-blue-400 transition-all min-h-[220px] text-left">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <ShieldCheck size={26} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Keamanan</h3>
                  <p className="text-slate-500 text-sm font-medium">Enkripsi end-to-end menjamin keamanan data daerah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-white pt-20 pb-12 overflow-hidden relative">
        <div className="w-full px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-32 mb-16">
            <div className="space-y-8 max-w-md text-left">
              <div className="flex items-center gap-5">
                <Image src="/logo-mimika.png" alt="Logo" width={50} height={50} className="brightness-0 invert" />
                <div className="text-left">
                  <p className="text-3xl font-black tracking-tighter uppercase leading-none">Mimika</p>
                  <p className="text-[11px] font-bold tracking-[0.4em] text-blue-500 uppercase mt-2">DataHub</p>
                </div>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed italic text-base">
                "Transparansi informasi untuk pembangunan Mimika yang berkelanjutan."
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-left">
              <FooterColumn title="Sistem" links={["Katalog", "API", "Peta"]} />
              <FooterColumn title="Lembaga" links={["Bappeda", "Diskominfo", "BPS"]} />
              <FooterColumn title="Dukungan" links={["Panduan", "Kontak", "FAQ"]} />
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-[10px] lg:text-[11px] font-bold tracking-[0.3em] uppercase text-center md:text-left">
              © 2026 PEMERINTAH KABUPATEN MIMIKA
            </p>
            <div className="flex gap-10 text-[11px] font-bold uppercase tracking-widest text-slate-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1.03); }
          100% { transform: scale(1.08); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s infinite alternate ease-in-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

function StatCard({ icon, val, label }: { icon: any, val: string, label: string }) {
  return (
    <div className="p-8 lg:p-10 rounded-[2rem] bg-[#f8fafc] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-500">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-3xl lg:text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">{val}</p>
      <p className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">{label}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-6 text-left">
      <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">{title}</p>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-all">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}