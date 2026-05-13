"use client";

import { Eye, SearchX, ArrowRight } from "lucide-react";
import { Dataset } from "@/src/app/types/dataset";

interface NonPemerintahTableProps {
  data: Dataset[];
  onOpenDetail: (dataset: Dataset) => void;
}

export default function NonPemerintahTable({ data, onOpenDetail }: NonPemerintahTableProps) {
  return (
    <div className="w-full text-black">
      {/* Scroll indicator for mobile */}
      <div className="md:hidden flex items-center justify-end text-[10px] text-gray-400 mb-2 gap-1 animate-pulse">
        Scroll horizontal <ArrowRight size={10} />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead className="bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Dataset Name</th>
              <th className="hidden md:table-cell px-6 py-4">Period</th>
              <th className="px-6 py-4 text-center">Year</th>
              <th className="px-6 py-4 text-right">Quality</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50 bg-white">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col whitespace-normal max-w-62.5 md:max-w-sm">
                      <span 
                        className="font-bold text-gray-900 group-hover:text-[#0071bc] cursor-pointer transition-colors"
                        onClick={() => onOpenDetail(row)}
                      >
                        {row.title}
                      </span>
                      <span className="md:hidden text-[10px] text-gray-400 font-bold uppercase mt-1">
                        {row.period}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-5">
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[11px] font-bold">
                      {row.period}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-600 font-medium text-center">
                    {row.year}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      row.quality_score >= 80 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {row.quality_score}%
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => onOpenDetail(row)} 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black text-gray-600 hover:bg-[#0071bc] hover:text-white hover:border-[#0071bc] transition-all shadow-sm active:scale-95"
                    >
                      <Eye size={14} /> <span className="hidden sm:inline">DETAIL</span>
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

function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <SearchX size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900">No Data Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Please adjust your filters or search keywords.
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}