"use client";

import { useState, useEffect } from "react";
import { 
  Filter, 
  RotateCcw, 
  FileSpreadsheet, 
  DownloadCloud, 
  Eye,
  Search
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

// ==========================================
// DATA DUMMY UNTUK TABEL
// ==========================================
interface GovernmentData {
  nama: string;
  sumber: string;
  kategori: string;
  tahun: string;
  update: string;
  kualitasScore: string;
  kualitasLabel: string;
  kualitasStatus: "tinggi" | "sedang" | "rendah";
}

const tableData: GovernmentData[] = [
  { nama: "Jumlah Penduduk per Distrik 2025", sumber: "BPS Mimika", kategori: "Kependudukan", tahun: "2025", update: "15/3/2025", kualitasScore: "92%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
  { nama: "PDRB Mimika 2024", sumber: "BPS Mimika", kategori: "Ekonomi & PDRB", tahun: "2024", update: "20/2/2025", kualitasScore: "95%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
  { nama: "Angka Kemiskinan Kabupaten Mimika", sumber: "BPS Mimika", kategori: "Sosial & Kemiskinan", tahun: "2024", update: "15/1/2025", kualitasScore: "88%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
  { nama: "Data Fasilitas Kesehatan per Distrik", sumber: "Dinas Kesehatan", kategori: "Kesehatan", tahun: "2025", update: "10/3/2025", kualitasScore: "78%", kualitasLabel: "Sedang", kualitasStatus: "sedang" },
  { nama: "Data Sekolah & Siswa per Distrik", sumber: "Dinas Pendidikan", kategori: "Pendidikan", tahun: "2025", update: "1/3/2025", kualitasScore: "85%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
  { nama: "Data Jalan Kabupaten Mimika", sumber: "Dinas PU", kategori: "Infrastruktur", tahun: "2024", update: "15/12/2024", kualitasScore: "75%", kualitasLabel: "Sedang", kualitasStatus: "sedang" },
  { nama: "Realisasi APBD Mimika 2025", sumber: "Bappeda Mimika", kategori: "Anggaran & Keuangan", tahun: "2025", update: "5/3/2025", kualitasScore: "88%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
  { nama: "Indeks Pembangunan Manusia (IPM)", sumber: "BPS Mimika", kategori: "Sosial & Kemiskinan", tahun: "2024", update: "20/11/2024", kualitasScore: "91%", kualitasLabel: "Tinggi", kualitasStatus: "tinggi" },
];

export default function DataPemerintahPage() {
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
        <PageHeader title="Data Pemerintah" subtitle="Menghubungkan ke basis data nasional..." />
        <LoadingState message="Menyiapkan data resmi Kabupaten Mimika..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER BANNER - Menggunakan Komponen Global */}
      <PageHeader 
        title="Data Pemerintah" 
        subtitle="Data resmi dari BPS, OPD, Kementerian, Lembaga Negara, dan Pemda Mimika" 
        withSearch 
      />

      {/* 2. FILTER SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
          <Filter size={18} className="text-[#1e61d0]" />
          Filter Dataset
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sumber Data</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all">
              <option>Semua Sumber</option>
              <option>BPS Mimika</option>
              <option>Dinas Kesehatan</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all">
              <option>Semua Kategori</option>
              <option>Kependudukan</option>
              <option>Kesehatan</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tahun</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all">
              <option>Semua Tahun</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kualitas Data</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all">
              <option>Semua Kualitas</option>
              <option>Tinggi</option>
              <option>Sedang</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Update Dari</label>
            <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Update Sampai</label>
            <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50">
          <button className="flex items-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-100 active:scale-95">
            <Search size={14} /> Terapkan Filter
          </button>
          <button className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-100 active:scale-95">
            <RotateCcw size={14} /> Reset
          </button>
          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95">
              <DownloadCloud size={14} /> CSV
            </button>
            <button className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95">
              <FileSpreadsheet size={14} /> EXCEL
            </button>
          </div>
        </div>
      </div>

      {/* 3. DATA TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Nama Dataset</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Sumber</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest text-center">Tahun</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest text-right">Kualitas</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors whitespace-normal max-w-xs">{row.nama}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      {row.sumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{row.kategori}</td>
                  <td className="px-6 py-4 text-gray-400 font-black text-center">{row.tahun}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      row.kualitasStatus === 'tinggi' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {row.kualitasScore}
                    </span>
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