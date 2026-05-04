"use client";

import { useState, useEffect } from "react";
import { 
  Filter, 
  RotateCcw, 
  FileSpreadsheet, 
  DownloadCloud, 
  Eye,
  Globe,
  Users,
  Search,
  Zap
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";

// ==========================================
// DATA DUMMY & INTERFACE
// ==========================================
interface NonGovData {
  nama: string;
  sumber: string;
  jenis: string;
  kategori: string;
  tahun: string;
  kualitas: string;
  status: string;
}

const nonGovData: NonGovData[] = [
  { nama: "Indonesia Economic Prospects - Papua", sumber: "World Bank", jenis: "Organisasi Internasional", kategori: "Ekonomi & PDRB", tahun: "2024", kualitas: "94%", status: "tinggi" },
  { nama: "Papua Sustainable Development Goals Report", sumber: "UNDP", jenis: "Organisasi Internasional", kategori: "Sosial & Kemiskinan", tahun: "2024", kualitas: "91%", status: "tinggi" },
  { nama: "Indigenous Communities in Mimika", sumber: "AMAN", jenis: "NGO / Non-Profit", kategori: "Sosial & Kemiskinan", tahun: "2024", kualitas: "86%", status: "tinggi" },
  { nama: "Environmental Impact of Mining in Mimika", sumber: "WALHI", jenis: "NGO / Non-Profit", kategori: "Infrastruktur", tahun: "2024", kualitas: "88%", status: "tinggi" },
];

export default function DataNonPemerintahPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi Loading Data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Data Non-Pemerintah" subtitle="Menghubungkan ke sumber data eksternal..." />
        <LoadingState message="Mengumpulkan data organisasi internasional & NGO..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER BANNER - Menggunakan Komponen Global */}
      <PageHeader 
        title="Data Non-Pemerintah" 
        subtitle="Data dari organisasi internasional, NGO, akademisi, dan sektor swasta" 
        withSearch 
      />

      {/* 2. STATS GRID - Konsisten dengan Halaman Lain */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Dataset" value={nonGovData.length} icon={<Globe size={22} />} iconBg="bg-blue-600" />
        <StatCard label="Mitra Global" value="2" icon={<Users size={22} />} iconBg="bg-[#ec407a]" />
        <StatCard label="Lembaga NGO" value="2" icon={<Zap size={22} />} iconBg="bg-[#f59e0b]" />
        <StatCard label="Skor Kualitas" value="90%" icon={<Zap size={22} />} iconBg="bg-emerald-500" valueColor="text-emerald-500" />
      </div>

      {/* 3. FILTER SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
          <Filter size={18} className="text-[#1e61d0]" />
          Filter Data Eksternal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sumber Data</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-[#1e61d0] outline-none transition-all">
              <option>Semua Sumber</option>
              <option>World Bank</option>
              <option>UNDP</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jenis Lembaga</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-[#1e61d0] outline-none transition-all">
              <option>Semua Jenis</option>
              <option>Organisasi Internasional</option>
              <option>NGO / Non-Profit</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-[#1e61d0] outline-none transition-all">
              <option>Semua Kategori</option>
              <option>Ekonomi</option>
              <option>Sosial</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tahun</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-[#1e61d0] outline-none transition-all">
              <option>Semua Tahun</option>
              <option>2024</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-50">
          <button className="flex items-center justify-center gap-2 bg-[#ef4444] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95">
            <Search size={14} /> Terapkan Filter
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-100 hover:bg-slate-600 transition-all active:scale-95">
            <RotateCcw size={14} /> Reset
          </button>
          <div className="flex gap-2 sm:ml-auto">
            <button className="flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">
              <DownloadCloud size={14} /> CSV
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">
              <FileSpreadsheet size={14} /> EXCEL
            </button>
          </div>
        </div>
      </div>

      {/* 4. DATA TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Nama Dataset</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Sumber</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Jenis Lembaga</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {nonGovData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors whitespace-normal max-w-xs">
                    {row.nama}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {row.sumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                      {row.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {row.kategori}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-white hover:text-[#1e61d0] hover:border-[#1e61d0] transition-all shadow-sm">
                      <Eye size={14} /> DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
      </footer>
    </div>
  );
}