"use client";
import React, { useState } from "react";
import { Info, Plus, Send } from "lucide-react";
import { Item } from "../page";
import { SourceType } from "@/src/app/types/source-type";

// Data Master Hardcode (MVP) - 18 Distrik Kabupaten Mimika
// Sesuai urutan ID di Backend (Alembic Seeder)
const MIMIKA_DISTRICTS = [
  { id: 1, name: "Mimika Baru" },
  { id: 2, name: "Kuala Kencana" },
  { id: 3, name: "Tembagapura" },
  { id: 4, name: "Wania" },
  { id: 5, name: "Iwaka" },
  { id: 6, name: "Kwamki Narama" },
  { id: 7, name: "Mimika Timur" },
  { id: 8, name: "Mimika Tengah" },
  { id: 9, name: "Mimika Barat" },
  { id: 10, name: "Agimuga" },
  { id: 11, name: "Jila" },
  { id: 12, name: "Jita" },
  { id: 13, name: "Mimika Timur Jauh" },
  { id: 14, name: "Mimika Barat Jauh" },
  { id: 15, name: "Mimika Barat Tengah" },
  { id: 16, name: "Amar" },
  { id: 17, name: "Hoya" },
  { id: 18, name: "Alama" },
];

interface DatasetFormProps {
  sources: Item[];
  categories: Item[];
  sourceTypes: SourceType[];
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onAddSource: () => void;
  onAddCategory: () => void;
  onAddSourceType: () => void;
}

export default function DatasetForm({
  sources, categories, sourceTypes, isProcessing,
  onSubmit, onAddSource, onAddCategory, onAddSourceType
}: DatasetFormProps) {

  // Local state untuk implementasi Controlled Component & Nullable Logic
  const [districtId, setDistrictId] = useState<number | null>(null);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Logika Nullable: Konversi string kosong ke null, selain itu ke Number
    setDistrictId(value === "" ? null : Number(value));
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Info size={20} className="text-[#1e61d0]" /> Informasi Dataset
      </h3>
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Nama Dataset */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Dataset <span className="text-red-500">*</span></label>
          <input
            name="title" type="text" placeholder="Contoh: Jumlah Penduduk Mimika 2025" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] transition-all text-black placeholder:text-gray-400"
            disabled={isProcessing}
          />
        </div>

        {/* Dataset Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jenis Dataset <span className="text-red-500">*</span></label>
          <div className="flex gap-4 p-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="dataset_type" value="pemerintah" defaultChecked className="w-4 h-4 text-[#1e61d0]" />
              <span className="text-sm text-gray-700 group-hover:text-black">Data Pemerintah</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="dataset_type" value="non-pemerintah" className="w-4 h-4 text-[#1e61d0]" />
              <span className="text-sm text-gray-700 group-hover:text-black">Data Non Pemerintah</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sumber Data */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Data (OPD) <span className="text-red-500">*</span></label>
            <select name="source_id" required disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none text-black">
              <option value="" className="text-black">Pilih Sumber</option>
              {sources.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
            </select>
            <button type="button" onClick={onAddSource} disabled={isProcessing} className="mt-2 text-[11px] font-bold text-[#10b981] flex items-center gap-1 hover:underline uppercase tracking-tighter">
              <Plus size={12} /> Tambah Sumber Baru
            </button>
          </div>

          {/* Source Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jenis Sumber <span className="text-red-500">*</span></label>
            <select name="source_type_id" required disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none text-black">
              <option value="" className="text-black">Pilih Tipe</option>
              {sourceTypes.map(st => <option key={st.id} value={st.id} className="text-black">{st.name}</option>)}
            </select>
            <button type="button" onClick={onAddSourceType} disabled={isProcessing} className="mt-2 text-[11px] font-bold text-[#10b981] flex items-center gap-1 hover:underline uppercase tracking-tighter">
              <Plus size={12} /> Tambah Tipe Baru
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kategori */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori <span className="text-red-500">*</span></label>
            <select name="category_id" required disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none text-black">
              <option value="" className="text-black">Pilih Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
            </select>
            <button type="button" onClick={onAddCategory} disabled={isProcessing} className="mt-2 text-[11px] font-bold text-[#10b981] flex items-center gap-1 hover:underline uppercase tracking-tighter">
              <Plus size={12} /> Tambah Kategori Baru
            </button>
          </div>

          {/* Tahun */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun <span className="text-red-500">*</span></label>
            <input name="year" type="number" defaultValue="2025" required disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] text-black placeholder:text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Periode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Periode Data</label>
            <select name="period" disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none text-black">
              <option value="Bulanan">Bulanan</option>
              <option value="Triwulan">Triwulan</option>
              <option value="Semester">Semester</option>
              <option value="Tahunan">Tahunan</option>
            </select>
            <p className="pt-1 italic text-[10px] text-gray-400">* Pastikan format file sesuai standar template</p>
          </div>

          {/* INTERVENSI GIS: Distrik / Wilayah (Controlled Component) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
              Distrik / Wilayah
              <span className="text-[9px] text-[#ef4444] normal-case tracking-normal italic">*Opsional (Level Kabupaten)</span>
            </label>
            <select
              name="district_id"
              value={districtId === null ? "" : districtId}
              onChange={handleDistrictChange}
              disabled={isProcessing}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none text-black"
            >
              <option value="" className="text-gray-500">-- Seluruh Kabupaten Mimika --</option>
              {MIMIKA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id} className="text-black">{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi</label>
          <textarea name="description" rows={2} disabled={isProcessing} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] resize-none text-black placeholder:text-gray-400" placeholder="Jelaskan isi dataset ini..."></textarea>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-[#0a2647] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#144272] transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-400 disabled:shadow-none"
        >
          {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
          {isProcessing ? "Sedang Memproses..." : "Upload & Proses Dataset"}
        </button>
      </form>
    </div>
  );
}