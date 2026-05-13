// src/app/(public)/atlas/page.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Info,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Share2,
  ArrowRight,
  Zap
} from "lucide-react";

import MapWrapper from "@/src/components/gis/MapWrapper";
import AtlasBarChart from "@/src/components/atlas/AtlasBarChart";
import AtlasStatCard from "@/src/components/atlas/AtlasStatCard";

import { useAtlasStore } from "@/src/app/store/useAtlasStore";
import { AtlasVisualMode } from "@/src/app/types/atlas";

/**
 * Komponen Internal: AtlasSection
 * Berfungsi sebagai "Trigger" narasi menggunakan IntersectionObserver
 * dan menampung tombol navigasi Call-to-Action.
 */
interface AtlasSectionProps {
  id: string;
  indicatorKey?: string;
  visualType: AtlasVisualMode;
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  exploreCategory?: string; // Query parameter untuk menjembatani ke katalog data
}

const AtlasSection = ({ id, indicatorKey, visualType, title, children, icon, exploreCategory }: AtlasSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setActiveTheme, fetchAtlasData } = useAtlasStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger perubahan state global (mode visual dan data)
          setActiveTheme(id, visualType);
          if (indicatorKey) {
            fetchAtlasData(indicatorKey);
          }
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px", // Memicu tepat saat paragraf di tengah layar
        threshold: 0.1,
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [id, indicatorKey, visualType, setActiveTheme, fetchAtlasData]);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-8 md:px-16 transition-opacity duration-700"
    >
      <div className="max-w-xl">
        <div className="inline-flex p-3 bg-blue-100 text-[#0071bc] rounded-2xl mb-6 shadow-sm">
          {icon}
        </div>
        <h2 className="text-4xl font-black text-[#002244] tracking-tighter mb-6 leading-tight uppercase">
          {title}
        </h2>
        <div className="text-lg text-gray-600 leading-relaxed space-y-6 font-medium text-justify">
          {children}
        </div>

        {/* Jembatan menuju Gudang Data / Katalog */}
        {exploreCategory && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <button
              onClick={() => router.push(`/public-data-pemerintah?kategori=${exploreCategory}`)}
              className="group flex items-center gap-3 px-6 py-3.5 bg-slate-50 border border-gray-200 hover:border-[#0071bc] hover:bg-blue-50 text-[#002244] rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              Eksplorasi Dataset {exploreCategory}
              <ArrowRight size={18} className="text-[#0071bc] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AtlasPage() {
  const { activeTheme, visualType, metadata, isLoading } = useAtlasStore();

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row relative">

      {/* --- KOLOM KIRI: NARASI (SCROLLABLE) --- */}
      <div className="w-full md:w-[40%] relative z-10 bg-white/80 backdrop-blur-xs shadow-[10px_0_30px_rgba(0,0,0,0.02)]">

        {/* Intro Hero Section */}
        <div className="min-h-screen flex flex-col justify-center px-8 md:px-16 border-b border-gray-100 bg-slate-50">
          <h1 className="text-[12px] font-black text-[#0071bc] uppercase tracking-[0.3em] mb-4">
            Kabupaten Mimika
          </h1>
          <h2 className="text-6xl font-black text-[#002244] tracking-tighter mb-8 leading-[0.9]">
            ATLAS <br /> <span className="text-[#0071bc]">PEMBANGUNAN</span> <br /> 2026.
          </h2>
          <p className="text-xl text-gray-500 font-medium max-w-sm leading-relaxed mb-10">
            Menelusuri jejak data spasial untuk masa depan pembangunan yang lebih inklusif dan berkelanjutan.
          </p>
          <div className="flex items-center gap-4 animate-bounce text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <ArrowDown size={18} /> Gulir untuk Memulai
          </div>
        </div>

        {/* Bab 1: Mode Peta (Distribusi Kependudukan) */}
        <AtlasSection
          id="demografi"
          indicatorKey="jumlah_penduduk"
          visualType="map"
          title="Distribusi Manusia"
          icon={<Users size={28} />}
          exploreCategory="Kependudukan"
        >
          <p>
            Mimika bukan sekadar angka, melainkan sebaran kehidupan di 18 distrik yang unik. Melalui peta di samping, kita dapat melihat konsentrasi penduduk yang masih terfokus pada pusat ekonomi urban.
          </p>
          <p>
            Kepadatan di <strong>Distrik Mimika Baru</strong> dan <strong>Kuala Kencana</strong> menjadi tantangan tersendiri dalam pemerataan layanan publik dibandingkan wilayah pegunungan dan pesisir.
          </p>
        </AtlasSection>

        {/* Bab 2: Mode Peta (Stunting / Kesehatan) */}
        <AtlasSection
          id="kesehatan"
          indicatorKey="stunting"
          visualType="map"
          title="Kualitas Generasi"
          icon={<Activity size={28} />}
          exploreCategory="Kesehatan"
        >
          <p>
            Stunting adalah musuh senyap masa depan. Warna merah pada peta menunjukkan distrik dengan tingkat prevalensi yang membutuhkan intervensi mendesak dari otoritas terkait.
          </p>
          <p>
            Data spasial ini menjadi navigasi utama bagi tenaga medis lapangan untuk memastikan program pemenuhan gizi tepat sasaran hingga ke pelosok kampung.
          </p>
        </AtlasSection>

        {/* Bab 3: Mode Grafik (Perbandingan PDRB) */}
        <AtlasSection
          id="ekonomi-chart"
          indicatorKey="pdrb"
          visualType="chart"
          title="Ketimpangan Ekonomi"
          icon={<TrendingUp size={28} />}
          exploreCategory="Ekonomi"
        >
          <p>
            Memetakan angka ke dalam poligon tidak selalu cukup. Mari kita lihat perbandingan langsung produktivitas antar distrik melalui grafik di samping.
          </p>
          <p>
            Terdapat jurang (*gap*) yang cukup tajam antara wilayah lingkar tambang dan wilayah pesisir. Ini mendesak lahirnya kebijakan ekonomi sirkular yang bisa menjembatani disparitas tersebut.
          </p>
        </AtlasSection>

        {/* Bab 4: Mode Angka Raksasa (Punchline Kesejahteraan) */}
        <AtlasSection
          id="ekonomi-stat"
          indicatorKey="pdrb" // Menggunakan data PDRB lagi, tapi visualnya diekstrak menjadi rata-rata
          visualType="stat"
          title="Menuju Mimika Emas"
          icon={<Zap size={28} />}
        >
          <p>
            Angka di sebelah kanan adalah rata-rata agregat dari kekuatan ekonomi kita saat ini. Sebuah pencapaian sekaligus pengingat bahwa perjalanan pembangunan tidak boleh berhenti.
          </p>
          <p>
            Inovasi, transparansi data, dan kolaborasi multi-sektor adalah kunci untuk menaikkan indikator ini di tahun-tahun mendatang.
          </p>
        </AtlasSection>

        {/* Penutup */}
        <AtlasSection
          id="kesimpulan"
          visualType="map" // Kembali ke peta pasif
          title="Data untuk Aksi"
          icon={<FileText size={28} />}
        >
          <p>
            Atlas ini adalah etalase dan alat bantu audit kebijakan. Setiap warna, grafik, dan angka yang baru saja Anda telusuri adalah representasi nyata yang menuntut tindakan konkret (*Evidence-Based Policy*).
          </p>
          <div className="pt-8 flex gap-4">
            <button className="px-6 py-3 bg-[#002244] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#0071bc] transition-all shadow-lg">
              <Share2 size={16} /> Bagikan Laporan Ini
            </button>
          </div>
        </AtlasSection>

        <footer className="py-20 px-16 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-t border-gray-100 bg-slate-50">
          © 2026 Bappeda Kabupaten Mimika • Mimika DataHub
        </footer>
      </div>

      {/* --- KOLOM KANAN: THE MULTI-VISUAL ORCHESTRATOR --- */}
      <div className="hidden md:block w-[60%] h-screen sticky top-0 bg-slate-50 overflow-hidden relative border-l border-gray-200">

        {/* 1. LAYER MODE PETA */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${visualType === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>

          {/* Panel Info Mengambang (Eksklusif untuk Peta) */}
          <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 pointer-events-auto max-w-xs transition-all duration-500">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#0071bc] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Memproses Lapisan...</span>
                </div>
              ) : metadata ? (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="text-[10px] font-black text-[#0071bc] uppercase tracking-[0.2em] mb-1">Indikator Pemetaan</h3>
                  <h4 className="text-xl font-black text-[#002244] leading-tight mb-2">{metadata.title}</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{metadata.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase mr-2">Satuan:</span>
                    <span className="text-xs font-black text-[#002244]">{metadata.unit}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Info size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pilih Indikator</span>
                </div>
              )}
            </div>
          </div>

          <MapWrapper isAtlasMode={true} />

          {/* Legenda Intensitas (Eksklusif untuk Peta) */}
          <div className="absolute bottom-8 right-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">Konsentrasi Data</span>
              <div className="h-2 w-48 bg-gradient-to-r from-slate-200 to-[#002244] rounded-full"></div>
              <div className="flex justify-between text-[9px] font-black text-[#002244] uppercase px-1">
                <span>Rendah</span>
                <span>Tinggi</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LAYER MODE GRAFIK RAKSASA */}
        <div className={`absolute inset-0 bg-white transition-opacity duration-1000 ${visualType === 'chart' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
          {visualType === 'chart' && <AtlasBarChart />}
        </div>

        {/* 3. LAYER MODE ANGKA STAT */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${visualType === 'stat' ? 'opacity-100 z-30' : 'opacity-0 z-0 pointer-events-none'}`}>
          {visualType === 'stat' && <AtlasStatCard />}
        </div>

      </div>

      <style jsx global>{`
        body {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}