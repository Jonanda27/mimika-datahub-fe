"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Map as MapIcon, 
  BarChart3, 
  ChevronRight, 
  Download,
  Info,
  Maximize2,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap
} from "lucide-react";

// ==========================================
// 1. DUMMY DATA STRUCTURE (RELASIONAL)
// ==========================================

const DISTRIK = [
  { id: "mb", name: "Mimika Baru" },
  { id: "tp", name: "Tembagapura" },
  { id: "ag", name: "Agimuga" },
  { id: "kk", name: "Kuala Kencana" },
];

const INDIKATOR = [
  { id: "ipm", name: "Indeks Pembangunan Manusia", category: "Sosial", unit: "Poin", desc: "Mengukur capaian pembangunan manusia berbasis komponen kesehatan, pendidikan, dan pengeluaran." },
  { id: "pdrb", name: "PDRB Per Kapita", category: "Ekonomi", unit: "Juta Rp", desc: "Rata-rata pendapatan penduduk yang mencerminkan tingkat produktivitas ekonomi suatu wilayah." },
  { id: "miskin", name: "Tingkat Kemiskinan", category: "Sosial", unit: "%", desc: "Persentase penduduk yang berada di bawah garis kemiskinan." },
  { id: "stunting", name: "Prevalensi Stunting", category: "Kesehatan", unit: "%", desc: "Persentase balita yang mengalami masalah gizi kronis sehingga tinggi badannya di bawah standar." },
];

const DATA_VALUES: Record<string, Record<string, { value: number; trend: string; history: number[] }>> = {
  ipm: {
    mb: { value: 74.2, trend: "+1.2%", history: [70.1, 71.5, 72.8, 73.0, 74.2] },
    tp: { value: 81.5, trend: "+0.5%", history: [79.0, 80.1, 80.5, 81.1, 81.5] },
    ag: { value: 62.1, trend: "-0.2%", history: [61.0, 62.5, 62.8, 62.3, 62.1] },
    kk: { value: 78.9, trend: "+1.0%", history: [75.0, 76.2, 77.5, 78.0, 78.9] },
  },
  pdrb: {
    mb: { value: 85.4, trend: "+5.4%", history: [70.2, 75.1, 78.4, 81.0, 85.4] },
    tp: { value: 450.2, trend: "+2.1%", history: [420.1, 430.5, 435.0, 440.8, 450.2] },
    ag: { value: 25.1, trend: "+1.1%", history: [21.0, 22.5, 23.1, 24.0, 25.1] },
    kk: { value: 120.5, trend: "+4.2%", history: [100.0, 105.4, 110.2, 115.5, 120.5] },
  },
  miskin: {
    mb: { value: 12.4, trend: "-1.5%", history: [15.1, 14.8, 14.0, 13.9, 12.4] },
    tp: { value: 4.2, trend: "-0.5%", history: [5.5, 5.2, 5.0, 4.7, 4.2] },
    ag: { value: 28.5, trend: "+0.2%", history: [26.0, 27.1, 28.0, 28.3, 28.5] },
    kk: { value: 8.1, trend: "-2.1%", history: [12.0, 11.5, 10.2, 10.2, 8.1] },
  },
  stunting: {
    mb: { value: 15.2, trend: "-3.2%", history: [22.0, 20.5, 19.1, 18.4, 15.2] },
    tp: { value: 8.5, trend: "-1.1%", history: [12.0, 11.2, 10.5, 9.6, 8.5] },
    ag: { value: 32.1, trend: "-0.5%", history: [34.0, 33.5, 33.0, 32.6, 32.1] },
    kk: { value: 11.4, trend: "-2.5%", history: [18.0, 16.5, 15.0, 13.9, 11.4] },
  }
};

export default function AtlasPage() {
  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================
  const [isMounted, setIsMounted] = useState(false); // State untuk Hydration Fix
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState(INDIKATOR[0].id);
  const [activeDistrictId, setActiveDistrictId] = useState(DISTRIK[0].id);
  const [selectedYear, setSelectedYear] = useState("2024");

  // Hydration Error Fix: Tunggu komponen dipasang di client sebelum me-render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredIndicators = useMemo(() => {
    return INDIKATOR.filter(ind => ind.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const selectedIndicator = INDIKATOR.find(i => i.id === selectedIndicatorId)!;
  const activeDistrict = DISTRIK.find(d => d.id === activeDistrictId)!;
  
  const currentData = DATA_VALUES[selectedIndicatorId][activeDistrictId];

  const getMapColors = useMemo(() => {
    const allValues = DISTRIK.map(d => DATA_VALUES[selectedIndicatorId][d.id].value);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    return DISTRIK.map(d => {
      const val = DATA_VALUES[selectedIndicatorId][d.id].value;
      let ratio = max === min ? 0.5 : (val - min) / (max - min);

      let colorClass = "";
      if (ratio <= 0.33) colorClass = "bg-blue-300 text-blue-900"; 
      else if (ratio <= 0.66) colorClass = "bg-blue-500 text-white"; 
      else colorClass = "bg-[#002244] text-white"; 

      return { id: d.id, colorClass };
    });
  }, [selectedIndicatorId]);

  const maxHistoryValue = Math.max(...currentData.history) * 1.1;

  // Render null saat SSR untuk mencegah Hydration Mismatch dari ekstensi browser
  if (!isMounted) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-gray-800 font-sans selection:bg-[#0071bc] selection:text-white">
      
      {/* --- SIDEBAR KIRI: KONTROL --- */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-black text-[#002244] uppercase tracking-tighter mb-1">Atlas Data</h1>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Kabupaten Mimika</p>
        </div>

        <div className="p-4 flex flex-col h-full overflow-hidden">
          {/* Search */}
          <div className="relative mb-6 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari indikator..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:outline-none focus:ring-[#0071bc] rounded-lg text-sm transition-all"
            />
          </div>

          {/* Categories List */}
          <div className="grow overflow-y-auto pr-2 custom-scrollbar">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Pilih Indikator</label>
            <div className="space-y-1.5">
              {filteredIndicators.length > 0 ? filteredIndicators.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndicatorId(ind.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group border
                    ${selectedIndicatorId === ind.id 
                      ? "bg-[#0071bc] text-white border-[#0071bc] shadow-md shadow-blue-200" 
                      : "bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50"}`}
                >
                  <span className="line-clamp-2 pr-2">{ind.name}</span>
                  <ChevronRight size={16} className={`shrink-0 transition-all ${selectedIndicatorId === ind.id ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              )) : (
                <p className="text-xs text-center text-gray-400 py-4 font-medium">Indikator tidak ditemukan.</p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="pt-6 border-t border-gray-100 shrink-0 mt-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tahun Analisis</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-gray-200 hover:border-gray-300 rounded-lg text-sm font-bold text-[#002244] outline-none transition-colors cursor-pointer"
            >
              <option value="2024">2024 (Terbaru)</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </aside>

      {/* --- AREA PETA UTAMA --- */}
      <main className="grow relative flex flex-col overflow-hidden">
        
        {/* Top Floating Info */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/40 pointer-events-auto max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-[#0071bc] text-[10px] font-black rounded uppercase">
                {selectedIndicator.category}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Satuan: {selectedIndicator.unit}
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#002244] leading-tight mb-2">{selectedIndicator.name}</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {selectedIndicator.desc}
            </p>
          </div>

          <div className="flex flex-col gap-3 pointer-events-auto">
            <button className="p-3 bg-white shadow-lg rounded-xl text-gray-600 hover:text-[#0071bc] hover:scale-105 active:scale-95 transition-all"><Layers size={20}/></button>
            <button className="p-3 bg-white shadow-lg rounded-xl text-gray-600 hover:text-[#0071bc] hover:scale-105 active:scale-95 transition-all"><Maximize2 size={20}/></button>
          </div>
        </div>

        {/* Mockup Peta (WebGIS Placeholder) */}
        <div className="absolute inset-0 bg-[#eef2f6] flex items-center justify-center p-20">
          <div className="w-full h-full relative border-2 border-dashed border-blue-200/50 rounded-3xl flex items-center justify-center bg-white/40 shadow-inner">
             
             {/* Simulasi Distrik (Peta) */}
             <div className="relative w-full max-w-2xl h-auto flex flex-wrap gap-4 justify-center items-center">
                {DISTRIK.map((distrik) => {
                  const distrikValue = DATA_VALUES[selectedIndicatorId][distrik.id].value;
                  const colorSetting = getMapColors.find(c => c.id === distrik.id)?.colorClass;
                  const isActive = activeDistrictId === distrik.id;

                  return (
                    <div 
                      key={distrik.id}
                      onClick={() => setActiveDistrictId(distrik.id)}
                      className={`${colorSetting} ${isActive ? 'ring-4 ring-offset-4 ring-[#0071bc] scale-110 z-10' : 'opacity-80 hover:opacity-100 hover:scale-105 z-0'} 
                      w-40 h-32 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center shadow-xl relative group`}
                    >
                      <span className="text-[10px] font-black uppercase opacity-80 mb-1 tracking-wider text-center px-2 leading-tight">{distrik.name}</span>
                      <span className="text-3xl font-black drop-shadow-md">{distrikValue}</span>
                      <span className="text-[9px] font-bold mt-1 opacity-70">{selectedIndicator.unit}</span>
                      
                      {/* Indicator Arrow for Active District */}
                      {isActive && <div className="absolute -bottom-2 w-4 h-4 bg-[#0071bc] rotate-45 rounded-sm"></div>}
                    </div>
                  )
                })}
             </div>

             {/* Legend */}
             <div className="absolute bottom-10 flex items-center gap-6 bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-full border border-gray-100 shadow-xl">
                <span className="text-[10px] font-black text-[#002244] uppercase tracking-widest">Legenda:</span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-md bg-blue-300 shadow-sm border border-blue-400"></div> <span className="text-xs font-bold text-gray-600">Rendah</span></div>
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-md bg-blue-500 shadow-sm"></div> <span className="text-xs font-bold text-gray-600">Sedang</span></div>
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-md bg-[#002244] shadow-sm"></div> <span className="text-xs font-bold text-gray-600">Tinggi</span></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* --- SIDEBAR KANAN: PANEL INSIGHT DETAIL --- */}
      <aside className="w-96 bg-white border-l border-gray-200 shrink-0 z-20 flex flex-col overflow-hidden shadow-[-4px_0_15px_rgba(0,0,0,0.03)]">
        <div className="p-8 space-y-10 overflow-y-auto grow custom-scrollbar">
          
          {/* District Profile */}
          <section className="animate-in fade-in slide-in-from-right-4 duration-300" key={activeDistrict.id}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[10px] font-black text-[#0071bc] uppercase tracking-[0.2em] mb-1">Area Analisis</h3>
                <h2 className="text-3xl font-black text-[#002244] tracking-tighter leading-none">{activeDistrict.name}</h2>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-2xl text-[#0071bc] shadow-inner">
                <MapIcon size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Nilai Tahun {selectedYear}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-[#0071bc]">{currentData.value}</p>
                </div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Trend (YoY)</p>
                <div className={`flex items-center gap-1.5 ${currentData.trend.includes("-") ? "text-red-500" : "text-emerald-500"}`}>
                  {currentData.trend.includes("-") ? <TrendingDown size={20} strokeWidth={3} /> : <TrendingUp size={20} strokeWidth={3} />}
                  <p className="text-2xl font-black tracking-tight">{currentData.trend}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Grafik Dinamis Mockup */}
          <section className="space-y-5 animate-in fade-in duration-500" key={`${activeDistrict.id}-${selectedIndicator.id}`}>
            <div className="flex justify-between items-end">
              <h3 className="text-[11px] font-black text-[#002244] uppercase tracking-widest">Tren 5 Tahun Terakhir</h3>
              <BarChart3 size={16} className="text-gray-400" />
            </div>
            
            <div className="h-44 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-end justify-between p-6 gap-3 group/chart">
              {currentData.history.map((val, i) => {
                const heightPercentage = Math.max(10, (val / maxHistoryValue) * 100);
                return (
                  <div key={i} className="grow flex flex-col items-center justify-end h-full relative group">
                    {/* Tooltip Hover */}
                    <div className="absolute -top-10 bg-[#002244] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg pointer-events-none whitespace-nowrap">
                      {val} {selectedIndicator.unit}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-t-4 border-t-[#002244] border-x-4 border-x-transparent"></div>
                    </div>
                    {/* Bar Line */}
                    <div 
                      className="w-full bg-[#0071bc]/20 group-hover:bg-[#0071bc] transition-all duration-500 rounded-t-md cursor-pointer" 
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-gray-400 px-3">
              <span>2020</span>
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span className="text-[#0071bc]">2024</span>
            </div>
          </section>

          {/* Insight Card Otomatis */}
          <section className="p-6 bg-linear-to-br from-[#002244] to-[#004b87] rounded-3xl text-white relative overflow-hidden group shadow-xl">
            <Info className="absolute -right-4 -top-4 w-28 h-28 text-white/5 rotate-12 transition-transform duration-700 group-hover:scale-110" />
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-blue-400/20 rounded-md"><Zap size={14} className="text-blue-300" /></div> 
              Analisis Cepat (Auto)
            </h4>
            <p className="text-[13px] text-blue-100 leading-relaxed font-medium">
              Data <strong>{selectedIndicator.name}</strong> di distrik <strong>{activeDistrict.name}</strong> saat ini berada di angka <strong>{currentData.value} {selectedIndicator.unit}</strong>, mengalami perubahan sebesar <span className="font-bold underline decoration-blue-400 underline-offset-2">{currentData.trend}</span> dibanding tahun sebelumnya.
            </p>
          </section>
        </div>

        {/* Action Button Footer */}
        <div className="p-6 border-t border-gray-100 shrink-0 bg-slate-50">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0071bc] text-white rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(0,113,188,0.25)] hover:bg-[#002244] hover:shadow-lg transition-all active:scale-[0.98]">
            <Download size={16} /> Unduh Raw Data (CSV)
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}