// src/app/(public)/atlas/page.tsx
"use client";

import React, { useEffect } from "react";
import { Share2, Download, Info, LayoutDashboard } from "lucide-react";
import MapWrapper from "@/src/components/gis/MapWrapper";
import AtlasBarChart from "@/src/components/atlas/AtlasBarChart";
import AtlasHeroStat from "@/src/components/atlas/AtlasHeroStat";
import AtlasLineChart from "@/src/components/atlas/AtlasLineChart";
import AtlasControls from "@/src/components/atlas/AtlasControls";
import { useAtlasStore } from "@/src/app/store/useAtlasStore";

export default function AtlasPage() {
  const { activeIndicator, currentData, fetchAtlasData } = useAtlasStore();

  // Inisialisasi data saat pertama kali buka
  useEffect(() => {
    fetchAtlasData(activeIndicator);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* --- HEADER BLOCK --- */}
      <header className="bg-white border-b border-gray-200 pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-[#0071bc] rounded-lg">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#0071bc]">
                Interactive Atlas
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#002244] tracking-tighter mb-4 uppercase">
              Mimika <span className="text-[#0071bc]">Data360</span> Explore
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Platform eksplorasi indikator pembangunan Kabupaten Mimika secara spasial dan analitikal.
              Gunakan kontrol di bawah untuk mengganti dimensi data.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-slate-50 transition-all">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#002244] text-white rounded-xl font-bold text-sm hover:bg-[#0071bc] transition-all shadow-lg shadow-blue-900/20">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-10">

        {/* 1. KONTROL UTAMA */}
        <section className="mb-10 max-w-md">
          <AtlasControls />
        </section>

        {/* 2. BLOCK ATAS: PETA & AGREGAT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 h-[500px] md:h-[600px]">
            <MapWrapper isAtlasMode={true} />
          </div>
          <div className="lg:col-span-4">
            <AtlasHeroStat />
          </div>
        </section>

        {/* 3. INFO BAR */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <Info className="text-[#0071bc] mt-1 shrink-0" />
          <div>
            <h4 className="text-[#002244] font-black text-sm uppercase tracking-widest mb-1">Konteks Indikator</h4>
            <p className="text-blue-900/70 text-sm font-medium leading-relaxed">
              {currentData?.metadata.description}
            </p>
          </div>
        </div>

        {/* 4. BLOCK BAWAH: RANKING & TREN */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="min-h-[500px]">
            <AtlasBarChart />
          </div>
          <div className="min-h-[500px]">
            <AtlasLineChart />
          </div>
        </section>

        {/* 5. FOOTER BRIDGE */}
        <section className="mt-16 p-10 bg-[#002244] rounded-[2.5rem] text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Ingin Menelusuri Data Mentah?</h2>
            <p className="text-blue-200 font-medium mb-8 max-w-xl mx-auto opacity-80">
              Akses tabel dataset lengkap, metadata teknis, dan unduh file sumber melalui portal data pemerintah kami.
            </p>
            <a
              href="/public-data-pemerintah"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#002244] rounded-2xl font-black hover:bg-blue-50 transition-all"
            >
              Buka Katalog Data Mimika
            </a>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
          </div>
        </section>

      </main>
    </div>
  );
}