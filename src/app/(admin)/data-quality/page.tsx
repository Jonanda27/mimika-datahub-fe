"use client";

import { useState, useEffect } from "react";
import {
  Database, CheckCheck, CheckCircle,
  Eye, Info, X, Clock, Activity, Search,
  AlertTriangle, ShieldCheck
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
    approvedDatasets,
    isLoading: isStoreLoading,
    fetchPendingDatasets,
    fetchApprovedDatasets,
    approveDataset
  } = useDatasetStore();

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasetToApprove, setDatasetToApprove] = useState<Dataset | null>(null); // State untuk modal approve
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchPendingDatasets(),
          fetchApprovedDatasets()
        ]);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [fetchPendingDatasets, fetchApprovedDatasets]);

  // --- Actions ---
  const handleConfirmApprove = async () => {
    if (!datasetToApprove) return;

    setIsApproving(true);
    try {
      await approveDataset(datasetToApprove.id);
      alert("Dataset berhasil disetujui dan dipublikasikan!");
      await fetchApprovedDatasets();
      await fetchPendingDatasets();
      setDatasetToApprove(null); // Tutup modal
    } catch (error: any) {
      alert(error.message || "Gagal menyetujui dataset");
    } finally {
      setIsApproving(false);
    }
  };

  // Menentukan data yang ditampilkan & Filter Search
  const displayData = (activeTab === "pending" ? pendingDatasets : approvedDatasets).filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isInitialLoading || isStoreLoading && !isApproving) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        <div className="max-w-350 mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader title="Data Quality" subtitle="Menyiapkan data audit..." />
          <LoadingState message="Menghubungkan ke pusat validasi data Mimika..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      <div className="max-w-350 mx-auto p-4 md:p-6 lg:p-8 overflow-x-hidden">

        {/* 1. HEADER BANNER */}
        <PageHeader
          title="Data Quality Management"
          subtitle="Moderasi Dataset | Validasi Kualitas | Persetujuan Publikasi"
        />

        {/* 2. STATS GRID (Responsive Layout) */}
        {/* Di Mobile: Grid 2 kolom. Kartu ke-3 span 2 kolom lalu di-center dengan lebar 1 kolom. */}
        {/* Di Desktop: Grid 3 kolom sejajar. */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="col-span-1">
            <StatCard
              label="Menunggu Validasi"
              value={pendingDatasets.length}
              icon={<CheckCheck className="w-4 h-4 md:w-5 md:h-5" />}
              iconBg="bg-amber-500"
            />
          </div>
          <div className="col-span-1">
            <StatCard
              label="Telah Disetujui"
              value={approvedDatasets.length}
              icon={<CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
              iconBg="bg-blue-500"
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex justify-center md:block">
            {/* Lebar disesuaikan agar sama persis dengan kartu di atasnya pada tampilan mobile */}
            <div className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-full">
              <StatCard
                label="Kualitas Sistem"
                value="Stable"
                icon={<Activity className="w-4 h-4 md:w-5 md:h-5" />}
                iconBg="bg-emerald-500"
                valueColor="text-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 3. TABS & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Tombol Tabs membentang penuh di Mobile, fit-content di Desktop */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === "pending"
                  ? "bg-[#ef4444] text-white shadow-xl shadow-red-100"
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                }`}
            >
              Pending ({pendingDatasets.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === "approved"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                }`}
            >
              Approved ({approvedDatasets.length})
            </button>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari dataset..."
              className="w-full bg-white border border-gray-100 py-3 pl-10 pr-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 4. TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-175">
              <thead className="bg-gray-50/50 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5">ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5">Dataset</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5">Kualitas</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayData.length > 0 ? displayData.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-[10px] sm:text-xs text-gray-400">#{d.id}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-normal min-w-50">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{d.title}</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-black mt-0.5">{d.dataset_type} • Tahun {d.year}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 sm:w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full ${d.quality_score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${d.quality_score}%` }}
                          />
                        </div>
                        <span className={`font-black text-[10px] sm:text-xs ${d.quality_score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {d.quality_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      {d.status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                          <CheckCircle size={12} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-end items-center gap-2">
                        {d.status === "pending" && (
                          <button
                            onClick={() => setDatasetToApprove(d)}
                            className="px-3 sm:px-4 py-2 bg-[#ef4444] text-white rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-md shadow-red-100 active:scale-95"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDataset(d)}
                          className="p-2 sm:p-2.5 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 sm:py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Database size={40} className="sm:w-12 sm:h-12" />
                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                          {activeTab === "approved" ? "Belum ada data disetujui" : "Semua data telah divalidasi"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. MODAL DETAIL */}
        {selectedDataset && (
          // flex items-center justify-center diterapkan di sini agar selalu di tengah pada semua device
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-[90%] sm:max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                  <Info size={18} className="text-blue-500 sm:w-5 sm:h-5" /> Detail Dataset
                </h3>
                <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Judul Dataset</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">{selectedDataset.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Kualitas</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-700">{selectedDataset.quality_score}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 sm:p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                    <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Tahun</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-700">{selectedDataset.year}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Validasi</p>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed italic">
                    Dataset ini telah melalui sistem pembersihan otomatis dan pengecekan redundansi data.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDataset(null)}
                className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 bg-[#0a2647] text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#144272] transition-all active:scale-95"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}

        {/* 6. MODAL APPROVE */}
        {datasetToApprove && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[30px] sm:rounded-[40px] w-full max-w-[90%] sm:max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 border border-white/20">
              <div className="bg-emerald-500 p-8 sm:p-10 text-center relative">
                <div className="bg-white/20 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <ShieldCheck className="text-white w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-white font-black text-lg sm:text-xl uppercase tracking-tighter">Konfirmasi Publikasi</h3>
                <p className="text-emerald-50 text-[10px] sm:text-xs mt-1 font-medium">Dataset akan tersedia untuk publik</p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6 sm:mb-8 space-y-4">
                  <div className="text-center">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Nama Dataset</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">{datasetToApprove.title}</p>
                  </div>
                  <div className="flex justify-center items-center gap-6 py-3 sm:py-4 border-y border-gray-50">
                    <div className="text-center">
                      <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase">Skor Kualitas</p>
                      <p className="text-base sm:text-lg font-black text-emerald-600">{datasetToApprove.quality_score}%</p>
                    </div>
                    <div className="h-6 sm:h-8 w-px bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase">Tahun</p>
                      <p className="text-base sm:text-lg font-black text-gray-800">{datasetToApprove.year}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <button
                    onClick={handleConfirmApprove}
                    disabled={isApproving}
                    className="w-full py-3.5 sm:py-4 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isApproving ? "Memproses..." : "Setujui & Publikasikan"}
                  </button>
                  <button
                    onClick={() => setDatasetToApprove(null)}
                    disabled={isApproving}
                    className="w-full py-3 sm:py-4 text-gray-400 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 md:mt-10 text-center text-gray-400 text-[9px] sm:text-[10px] font-medium tracking-widest uppercase pb-6">
          © 2026 Mimika DataHub - Pusat Validasi Data Terpadu
        </footer>
      </div>
    </div>
  );
}