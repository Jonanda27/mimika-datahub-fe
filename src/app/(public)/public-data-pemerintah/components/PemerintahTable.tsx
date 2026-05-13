"use client";

import { Eye, SearchX } from "lucide-react";
import { Dataset } from "@/src/app/types/dataset";

interface PemerintahTableProps {
  data: Dataset[];
  onOpenDetail: (dataset: Dataset) => void;
}

export default function PemerintahTable({ data, onOpenDetail }: PemerintahTableProps) {
  return (
    <div className="w-full min-w-0 text-black">
      {/* Container ini yang akan discroll secara horizontal jika tabel kepanjangan */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          {/* Header Tabel */}
          <thead className="bg-gray-50/80 border-y border-gray-200">
            <tr>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider">Nama Dataset</th>
              <th className="hidden md:table-cell px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider">Periode</th>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider text-center">Tahun</th>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider text-right">Kualitas</th>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          
          {/* Isi Tabel */}
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex flex-col max-w-50 md:max-w-sm whitespace-normal wrap-break-word">
                      <span className="font-bold text-[#0071bc] cursor-pointer hover:underline" onClick={() => onOpenDetail(row)}>
                        {row.title}
                      </span>
                      <span className="md:hidden text-[10px] text-gray-400 uppercase font-medium mt-1">{row.period}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {row.period}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-500 font-medium text-center">
                    {row.year}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border ${row.quality_score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {row.quality_score}%
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <button 
                      onClick={() => onOpenDetail(row)} 
                      className="inline-flex items-center gap-1.5 p-2 md:px-4 md:py-2 border border-gray-300 rounded text-[11px] font-bold text-gray-700 hover:bg-[#0071bc] hover:text-white hover:border-[#0071bc] transition-all shadow-sm"
                    >
                      <Eye size={14} /> <span className="hidden md:inline">DETAIL</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState colSpan={5} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Komponen Empty State
function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      {/* Menghapus whitespace-normal dari <td> agar tidak bertabrakan dengan property table, diletakkan di dalam <div> */}
      <td colSpan={colSpan} className="px-4 py-24 bg-white">
        {/* PERBAIKAN: Penambahan whitespace-normal dan break-words di level div pembungkus konten */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 whitespace-normal wrap-break-word w-full max-w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
            <SearchX size={36} className="text-gray-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Dataset Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Kami tidak menemukan data yang sesuai dengan kata kunci atau filter pencarian Anda saat ini. Silakan coba atur ulang filter pencarian Anda.
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}