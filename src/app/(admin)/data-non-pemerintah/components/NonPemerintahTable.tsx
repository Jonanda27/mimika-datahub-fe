"use client";

import { Eye, Database } from "lucide-react";
import { Dataset } from "@/src/app/types/dataset";

interface NonPemerintahTableProps {
  data: Dataset[];
  onOpenDetail: (dataset: Dataset) => void;
}

export default function NonPemerintahTable({ data, onOpenDetail }: NonPemerintahTableProps) {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-black">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-400 text-[10px] md:text-[11px] uppercase tracking-widest">Nama Dataset</th>
              <th className="hidden lg:table-cell px-6 py-4 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Periode</th>
              <th className="hidden md:table-cell px-6 py-4 font-bold text-gray-400 text-[10px] md:text-[11px] uppercase tracking-widest text-center">Tahun</th>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-400 text-[10px] md:text-[11px] uppercase tracking-widest text-right">Kualitas</th>
              <th className="px-4 md:px-6 py-4 font-bold text-gray-400 text-[10px] md:text-[11px] uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex flex-col max-w-[200px] md:max-w-xs lg:max-w-md">
                    <span className="font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors whitespace-normal">{row.title}</span>
                    <span className="lg:hidden text-[10px] text-gray-400 uppercase font-medium mt-1">{row.period} • {row.year}</span>
                  </div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">{row.period}</span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-gray-500 font-medium text-center">{row.year}</td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${row.quality_score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {row.quality_score}%
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-center">
                  <button onClick={() => onOpenDetail(row)} className="inline-flex items-center gap-1.5 p-2 md:px-4 md:py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-white hover:text-[#1e61d0] hover:border-[#1e61d0] transition-all shadow-sm">
                    <Eye size={14} /> <span className="hidden md:inline">DETAIL</span>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 md:py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs italic">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Database size={40} />
                    <span>Tidak ada dataset tersedia</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}