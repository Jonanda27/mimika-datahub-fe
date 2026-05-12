"use client";

import { X, Info, Layers, Calendar, Building2, Boxes, Tag, Table as TableIcon, FileDown } from "lucide-react";
import { Dataset, DatasetContent } from "@/src/app/types/dataset";
import { Source } from "@/src/app/types/source";
import { SourceType } from "@/src/app/types/source-type";
import { Category } from "@/src/app/types/category";

interface DetailModalProps {
  dataset: Dataset;
  content: DatasetContent | null;
  sources: Source[];
  sourceTypes: SourceType[];
  categories: Category[];
  onClose: () => void;
  onDownload: (dataset: Dataset) => void;
}

export default function PemerintahDetailModal({ 
  dataset, content, sources, sourceTypes, categories, onClose, onDownload 
}: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-black">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Info size={20} className="text-[#1e61d0]" /> 
            Detail & Preview Dataset
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Nama Dataset</p>
                <h4 className="text-xl font-bold text-gray-900 leading-tight">{dataset.title}</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailInfoBox label="Sumber (OPD)" value={sources.find(s => s.id === dataset.source_id)?.name || "N/A"} icon={<Building2 size={12}/>} />
                <DetailInfoBox label="Tipe Sumber" value={sourceTypes.find(st => st.id === dataset.source_type_id)?.name || "N/A"} icon={<Boxes size={12}/>} />
                <DetailInfoBox label="Kategori" value={categories.find(c => c.id === dataset.category_id)?.name || "N/A"} icon={<Tag size={12}/>} />
                <DetailInfoBox label="Tahun Data" value={dataset.year} icon={<Calendar size={12}/>} />
                <DetailInfoBox label="Periode" value={dataset.period} />
                <DetailInfoBox label="Status" value={dataset.status} color="text-emerald-600" />
              </div>
            </div>
            <div className={`${dataset.quality_score >= 80 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} p-6 rounded-2xl border flex flex-col justify-center items-center text-center h-full`}>
              <p className={`${dataset.quality_score >= 80 ? 'text-emerald-600' : 'text-amber-600'} text-[10px] font-black uppercase tracking-widest mb-1`}>Quality Score</p>
              <p className={`${dataset.quality_score >= 80 ? 'text-emerald-700' : 'text-amber-700'} text-4xl font-black`}>{dataset.quality_score}%</p>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{dataset.total_rows.toLocaleString()} Baris Terverifikasi</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <TableIcon size={16} className="text-gray-400" /> Data Preview (100 Baris)
            </h4>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-inner min-h-[300px]">
              {!content ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2 font-bold uppercase animate-pulse">Memuat Baris Data...</div>
              ) : (
                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                      <tr>
                        {content.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 font-black text-gray-500 uppercase border-r border-gray-100 last:border-0">{h.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {content.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                          {content.headers.map((h, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 text-gray-600 border-r border-gray-50 last:border-0 font-medium">{row[h]?.toString() || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 shrink-0">
          <button onClick={() => onDownload(dataset)} className="flex-1 bg-[#10b981] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95">
            <FileDown size={18} /> Export Clean Data (Excel)
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Tutup Preview</button>
        </div>
      </div>
    </div>
  );
}

function DetailInfoBox({ label, value, icon, color = "text-gray-800" }: { label: string, value: any, icon?: any, color?: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">{icon} {label}</p>
      <p className={`text-xs font-bold truncate ${color}`}>{value}</p>
    </div>
  );
}