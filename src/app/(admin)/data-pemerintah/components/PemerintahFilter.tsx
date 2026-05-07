"use client";

import { Filter, Search, RotateCcw, DownloadCloud, FileSpreadsheet } from "lucide-react";
import { Source } from "@/src/app/types/source";
import { Category } from "@/src/app/types/category";

interface PemerintahFilterProps {
  sources: Source[];
  categories: Category[];
  onSearch: (val: string) => void;
  onReset: () => void;
  onExport: (format: 'excel' | 'csv') => void;
}

export default function PemerintahFilter({ 
  sources, 
  categories, 
  onSearch, 
  onReset, 
  onExport 
}: PemerintahFilterProps) {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <h3 className="text-sm md:text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
        <Filter size={18} className="text-[#1e61d0]" />
        Filter Dataset
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sumber Data</label>
          <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all text-black">
            <option value="all">Semua Sumber</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori</label>
          <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all text-black">
            <option value="all">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tahun</label>
          <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all text-black">
            <option value="all">Semua Tahun</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kualitas Data</label>
          <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#1e61d0] outline-none bg-gray-50 transition-all text-black">
            <option value="all">Semua Kualitas</option>
            <option value="tinggi">Tinggi (≥ 80%)</option>
            <option value="sedang">Sedang ({"<"} 80%)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-50">
        <div className="flex gap-2 flex-1">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-100 active:scale-95">
            <Search size={14} /> Terapkan
          </button>
          <button onClick={onReset} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-100 active:scale-95">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button onClick={() => onExport('csv')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">
            <DownloadCloud size={14} /> CSV
          </button>
          <button onClick={() => onExport('excel')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">
            <FileSpreadsheet size={14} /> EXCEL
          </button>
        </div>
      </div>
    </div>
  );
}