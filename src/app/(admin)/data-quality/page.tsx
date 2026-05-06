"use client";

import { useState, useEffect } from "react";
import { 
  Database, CheckCheck, CheckCircle, 
  Eye, Info, ArrowRight, X
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";

// Integrasi Store & Service
import { useDatasetStore } from "./../../store/useDatasetStore";
import { Dataset } from "../../types/dataset";

export default function DataQualityPage() {
  // --- States ---
  const { 
    pendingDatasets, 
    isLoading: isStoreLoading, 
    fetchPendingDatasets, 
    approveDataset 
  } = useDatasetStore();
  
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        // Hanya mengambil data pending sesuai ketersediaan service
        await fetchPendingDatasets();
      } catch (error) {
        console.error("Gagal memuat data pending:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [fetchPendingDatasets]);

  // --- Actions ---
  const handleApprove = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menyetujui dataset ini untuk dipublikasikan?")) {
      try {
        // Panggil action store untuk update status di DB ke 'approved' [cite: 78, 79]
        await approveDataset(id);
        alert("Dataset berhasil disetujui!");
      } catch (error: any) {
        alert(error.message || "Gagal menyetujui dataset");
      }
    }
  };

  if (isInitialLoading || isStoreLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Data Quality" subtitle="Menyiapkan data audit..." />
        <LoadingState message="Menghubungkan ke pusat validasi data Mimika..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      {/* 1. HEADER BANNER */}
      <PageHeader 
        title="Data Quality Management" 
        subtitle="Moderasi Dataset | Validasi Kualitas | Persetujuan Publikasi" 
      />

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          label="Menunggu Validasi" 
          value={pendingDatasets.length} 
          icon={<CheckCheck size={22} />} 
          iconBg="bg-amber-500" 
        />
        <StatCard 
          label="Sistem Status" 
          value="Aktif" 
          icon={<CheckCircle size={22} />} 
          iconBg="bg-emerald-500" 
          valueColor="text-emerald-500" 
        />
      </div>

      {/* 3. PIPELINE VISUALIZATION */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex justify-center items-center gap-12">
        <PipelineStep 
          icon={<CheckCheck size={20} />} 
          label="Validation (Pending)" 
          active={pendingDatasets.length > 0} 
        />
        <ArrowRight className="text-gray-300" />
        <PipelineStep 
          icon={<Database size={20} />} 
          label="Approved" 
          completed={false} 
        />
      </div>

      {/* 4. TABS NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#ef4444] text-white shadow-xl shadow-red-100 uppercase tracking-tighter">
          Validation ({pendingDatasets.length})
        </div>
      </div>

      {/* 5. TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <TableHeader columns={["ID", "Dataset", "Skor Kualitas", "Tahun/Periode", "Aksi"]} />
            <tbody className="divide-y divide-gray-50">
              {pendingDatasets.length > 0 ? pendingDatasets.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">#{d.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{d.title}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black">{d.dataset_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-black text-base ${d.quality_score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {d.quality_score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{d.year} / {d.period}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleApprove(d.id)} 
                      className="px-4 py-2 bg-[#ef4444] text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-tighter"
                    >
                      Setujui
                    </button>
                    <button 
                      onClick={() => setSelectedDataset(d)} 
                      className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : <EmptyState colSpan={5} />}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. DETAIL MODAL */}
      {selectedDataset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Info size={20} className="text-blue-500" /> Detail Dataset
              </h3>
              <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Judul Dataset</p>
                <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedDataset.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Quality Score</p>
                  <p className="text-3xl font-black text-emerald-700">{selectedDataset.quality_score}%</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Tahun Data</p>
                  <p className="text-lg font-bold text-blue-700 leading-tight">{selectedDataset.year}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedDataset(null)} className="w-full mt-8 py-4 bg-[#0a2647] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#144272] transition-all active:scale-95">Tutup Detail</button>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Sistem Pembersihan & Validasi Terintegrasi
      </footer>
    </div>
  );
}

// --- Local Sub-components ---

function PipelineStep({ icon, label, active = false, completed = false }: { icon: any, label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
        completed ? 'bg-emerald-500 text-white' : active ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-300 border border-gray-100'
      }`}>
        {completed ? <CheckCircle size={22} /> : icon}
      </div>
      <p className={`text-[10px] font-black uppercase mt-3 tracking-tighter ${active || completed ? 'text-gray-800' : 'text-gray-300'}`}>{label}</p>
    </div>
  );
}

function TableHeader({ columns }: { columns: string[] }) {
  return (
    <thead className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
      <tr>{columns.map((c, i) => <th key={i} className="px-6 py-4 font-black">{c}</th>)}</tr>
    </thead>
  );
}

function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs italic">
        <div className="flex flex-col items-center gap-2 opacity-50">
           <Database size={40} />
           Tidak ada data yang menunggu validasi
        </div>
      </td>
    </tr>
  );
}