"use client";

import { useState, useEffect } from "react";
import { 
  Database, Inbox, Brush, CheckCheck, CheckCircle, 
  Eye, Play, Info, ArrowRight, X
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";
import LoadingState from "@/components/ui/LoadingState";

// --- Types ---
interface Dataset {
  id: string;
  name: string;
  source_name: string;
  upload_date?: string;
  approved_date?: string;
  quality_score?: number;
  issues?: string[] | null;
  validation_result?: string;
}

export default function DataQualityPage() {
  // --- States ---
  const [stagingDatasets, setStagingDatasets] = useState<Dataset[]>([]);
  const [cleaningDatasets, setCleaningDatasets] = useState<Dataset[]>([]);
  const [validationDatasets, setValidationDatasets] = useState<Dataset[]>([]);
  const [approvedDatasets, setApprovedDatasets] = useState<Dataset[]>([]);
  const [activeTab, setActiveTab] = useState("staging");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Initial Data Simulation ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setStagingDatasets([
        { id: "STG-001", name: "Data Kependudukan Distrik Agimuga", source_name: "Dinas Dukcapil", upload_date: "01/05/2025" },
        { id: "STG-002", name: "Laporan Perikanan Tangkap 2025", source_name: "Dinas Perikanan", upload_date: "03/05/2025" }
      ]);
      setApprovedDatasets([
        { id: "APP-001", name: "PDRB Kabupaten Mimika 2024", source_name: "BPS Mimika", quality_score: 95, approved_date: "20/04/2025" }
      ]);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Pipeline Actions ---
  const moveToCleaning = (id: string) => {
    const ds = stagingDatasets.find(d => d.id === id);
    if (ds) {
      const updatedDs = { ...ds, issues: ["Format perlu distandarisasi", "Cek konsistensi unit"] };
      setCleaningDatasets([...cleaningDatasets, updatedDs]);
      setStagingDatasets(stagingDatasets.filter(d => d.id !== id));
    }
  };

  const runCleaning = (id: string) => {
    alert(`🧹 Cleaning dataset ID ${id}: Format distandarisasi & duplikasi dihapus.`);
    setCleaningDatasets(prev => prev.map(d => d.id === id ? { ...d, issues: null } : d));
  };

  const moveToValidation = (id: string) => {
    const ds = cleaningDatasets.find(d => d.id === id);
    if (ds) {
      const score = Math.floor(Math.random() * (95 - 70 + 1) + 70);
      const updatedDs = { 
        ...ds, 
        quality_score: score,
        validation_result: score >= 85 ? "Lolos validasi" : "Validasi dengan catatan"
      };
      setValidationDatasets([...validationDatasets, updatedDs]);
      setCleaningDatasets(cleaningDatasets.filter(d => d.id !== id));
    }
  };

  const approveDataset = (id: string) => {
    const ds = validationDatasets.find(d => d.id === id);
    if (ds) {
      const updatedDs = { ...ds, approved_date: new Date().toLocaleDateString("id-ID") };
      setApprovedDatasets([...approvedDatasets, updatedDs]);
      setValidationDatasets(validationDatasets.filter(d => d.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Data Quality" subtitle="Menyiapkan data audit..." />
        <LoadingState message="Menghubungkan ke pusat validasi data Mimika..." />
      </div>
    );
  }

  const avgQuality = approvedDatasets.length > 0 
    ? Math.round(approvedDatasets.reduce((a, b) => a + (b.quality_score || 0), 0) / approvedDatasets.length) 
    : 0;

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      {/* 1. HEADER BANNER - Global Component */}
      <PageHeader 
        title="Data Quality Management" 
        subtitle="Staging Area | Cleaning Engine | Validasi Data" 
      />

      {/* 2. STATS GRID - Global Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Staging Data" value={stagingDatasets.length} icon={<Inbox size={22} />} iconBg="bg-blue-600" />
        <StatCard label="Perlu Cleaning" value={cleaningDatasets.length} icon={<Brush size={22} />} iconBg="bg-red-500" />
        <StatCard label="Perlu Validasi" value={validationDatasets.length} icon={<CheckCheck size={22} />} iconBg="bg-amber-500" />
        <StatCard label="Rata-rata Kualitas" value={`${avgQuality}%`} icon={<CheckCircle size={22} />} iconBg="bg-emerald-500" valueColor="text-emerald-500" />
      </div>

      {/* 3. PIPELINE VISUALIZATION */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-wrap justify-between items-center gap-4">
        <PipelineStep icon={<Inbox size={20} />} label="Staging" active={stagingDatasets.length > 0} />
        <ArrowRight className="text-gray-300 hidden md:block" />
        <PipelineStep icon={<Brush size={20} />} label="Cleaning" active={cleaningDatasets.length > 0} />
        <ArrowRight className="text-gray-300 hidden md:block" />
        <PipelineStep icon={<CheckCheck size={20} />} label="Validation" active={validationDatasets.length > 0} />
        <ArrowRight className="text-gray-300 hidden md:block" />
        <PipelineStep icon={<Database size={20} />} label="Approved" completed={approvedDatasets.length > 0} />
      </div>

      {/* 4. TABS NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton label={`Staging (${stagingDatasets.length})`} active={activeTab === "staging"} onClick={() => setActiveTab("staging")} />
        <TabButton label={`Cleaning (${cleaningDatasets.length})`} active={activeTab === "cleaning"} onClick={() => setActiveTab("cleaning")} />
        <TabButton label={`Validation (${validationDatasets.length})`} active={activeTab === "validation"} onClick={() => setActiveTab("validation")} />
        <TabButton label={`Approved (${approvedDatasets.length})`} active={activeTab === "approved"} onClick={() => setActiveTab("approved")} />
      </div>

      {/* 5. TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {activeTab === "staging" && (
              <>
                <TableHeader columns={["ID", "Dataset", "Sumber", "Upload Date", "Status", "Aksi"]} />
                <tbody className="divide-y divide-gray-50">
                  {stagingDatasets.length > 0 ? stagingDatasets.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{d.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{d.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{d.source_name}</td>
                      <td className="px-6 py-4 text-gray-400">{d.upload_date}</td>
                      <td className="px-6 py-4"><StatusBadge status="staging" /></td>
                      <td className="px-6 py-4">
                        <button onClick={() => moveToCleaning(d.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#0a2647] text-white rounded-xl text-xs font-bold hover:bg-[#144272] transition-all active:scale-95 shadow-lg shadow-blue-100">
                          <Brush size={14} /> PROSES CLEANING
                        </button>
                      </td>
                    </tr>
                  )) : <EmptyState colSpan={6} />}
                </tbody>
              </>
            )}
            
            {activeTab === "cleaning" && (
              <>
                <TableHeader columns={["ID", "Dataset", "Isu Terdeteksi", "Status", "Aksi"]} />
                <tbody className="divide-y divide-gray-50">
                  {cleaningDatasets.length > 0 ? cleaningDatasets.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{d.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{d.name}</td>
                      <td className="px-6 py-4 text-red-500 text-xs font-black uppercase tracking-tighter">{d.issues?.join(', ') || 'SIAP DIVALIDASI'}</td>
                      <td className="px-6 py-4"><StatusBadge status="cleaning" /></td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => runCleaning(d.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-black text-blue-600 hover:bg-blue-50 transition-all">
                          <Play size={12} /> RUN
                        </button>
                        <button onClick={() => moveToValidation(d.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-[10px] font-black hover:bg-emerald-600 transition-all shadow-md">
                          <CheckCheck size={12} /> VALIDASI
                        </button>
                      </td>
                    </tr>
                  )) : <EmptyState colSpan={5} />}
                </tbody>
              </>
            )}

            {activeTab === "validation" && (
              <>
                <TableHeader columns={["ID", "Dataset", "Skor", "Hasil Validasi", "Aksi"]} />
                <tbody className="divide-y divide-gray-100">
                  {validationDatasets.length > 0 ? validationDatasets.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{d.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{d.name}</td>
                      <td className="px-6 py-4 font-black text-emerald-600 text-base">{d.quality_score}%</td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-medium italic">"{d.validation_result}"</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => approveDataset(d.id)} className="px-4 py-2 bg-[#ef4444] text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">APPROVE</button>
                        <button onClick={() => setSelectedDataset(d)} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-all"><Eye size={16} /></button>
                      </td>
                    </tr>
                  )) : <EmptyState colSpan={5} />}
                </tbody>
              </>
            )}

            {activeTab === "approved" && (
              <>
                <TableHeader columns={["ID", "Dataset", "Sumber", "Skor Final", "Tgl Setuju", "Status"]} />
                <tbody className="divide-y divide-gray-100">
                  {approvedDatasets.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{d.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800 whitespace-normal max-w-xs">{d.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{d.source_name}</td>
                      <td className="px-6 py-4 font-black text-emerald-600">{d.quality_score}%</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{d.approved_date}</td>
                      <td className="px-6 py-4"><StatusBadge status="approved" /></td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

      {/* 6. DETAIL MODAL */}
      {selectedDataset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Info size={20} className="text-blue-500" /> Detail Validasi
              </h3>
              <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Dataset</p>
                <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedDataset.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Quality Score</p>
                  <p className="text-3xl font-black text-emerald-700">{selectedDataset.quality_score}%</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-bold text-blue-700 leading-tight">{selectedDataset.validation_result}</p>
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
        completed ? 'bg-emerald-500 text-white' : active ? 'bg-[#ef4444] text-white' : 'bg-gray-50 text-gray-300 border border-gray-100'
      }`}>
        {completed ? <CheckCircle size={22} /> : icon}
      </div>
      <p className={`text-[10px] font-black uppercase mt-3 tracking-tighter ${active || completed ? 'text-gray-800' : 'text-gray-300'}`}>{label}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
        active 
          ? 'bg-[#ef4444] text-white shadow-xl shadow-red-100' 
          : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600 shadow-sm'
      }`}
    >
      <span className="uppercase tracking-tighter">{label}</span>
    </button>
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
           Tidak ada data di tahapan ini
        </div>
      </td>
    </tr>
  );
}