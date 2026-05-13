"use client";

import { Eye, SearchX, ArrowRight } from "lucide-react";
import { Dataset } from "@/src/app/types/dataset";

interface PemerintahTableProps {
  data: Dataset[];
  onOpenDetail: (dataset: Dataset) => void;
}

export default function PemerintahTable({ data, onOpenDetail }: PemerintahTableProps) {
  return (
    <div className="w-full">
      {/* Table Container with scroll indicator on mobile */}
      <div className="relative">
        <div className="md:hidden flex items-center justify-end text-[10px] font-bold text-gray-400 mb-2 gap-1 animate-pulse">
          Geser Tabel <ArrowRight size={10} />
        </div>
        
        <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-150">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Nama Dataset</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Tahun</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Kualitas</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col whitespace-normal max-w-75">
                        <span 
                          className="font-bold text-gray-900 cursor-pointer group-hover:text-[#0071bc] transition-colors" 
                          onClick={() => onOpenDetail(row)}
                        >
                          {row.title}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">{row.period}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-gray-600">
                      {row.year}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.quality_score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${row.quality_score}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-black ${row.quality_score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {row.quality_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => onOpenDetail(row)} 
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-[#0071bc] hover:text-white hover:border-[#0071bc] transition-all shadow-sm active:scale-95"
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState colSpan={4} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-20 bg-white">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <SearchX size={40} className="text-gray-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Data Tidak Ditemukan</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Silakan coba atur ulang filter pencarian Anda.</p>
          </div>
        </div>
      </td>
    </tr>
  );
}