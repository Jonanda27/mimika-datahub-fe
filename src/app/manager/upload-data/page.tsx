"use client";

import { useState, useRef, useEffect } from "react";
import { 
  CloudUpload, FileText, Info, Plus, Send, 
  History, Database, Tag, X, AlertCircle, FolderOpen 
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";
import LoadingState from "@/components/ui/LoadingState";

// --- Types ---
interface UploadLog {
  date: string;
  name: string;
  source: string;
  status: StatusType;
  quality: number | null;
}

interface Item {
  id: string | number;
  name: string;
}

export default function UploadDataPage() {
  // --- States --- 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "danger" | "info" } | null>(null);
  
  const [sources, setSources] = useState<Item[]>([
    { id: "bps", name: "BPS Mimika" },
    { id: "dinkes", name: "Dinas Kesehatan" },
  ]);
  
  const [categories, setCategories] = useState<Item[]>([
    { id: "ekonomi", name: "Ekonomi & PDRB" },
    { id: "kesehatan", name: "Kesehatan" },
  ]);
  
  const [logs, setLogs] = useState<UploadLog[]>([
    { date: "15/03/2025 10:23", name: "PDRB Mimika Q1-2025", source: "BPS Mimika", status: "approved", quality: 92 },
    { date: "14/03/2025 14:45", name: "Data Puskesmas 2025", source: "Dinas Kesehatan", status: "approved", quality: 78 },
    { date: "12/03/2025 09:15", name: "Realisasi Anggaran PU", source: "Dinas PU", status: "cleaning", quality: null },
  ]);

  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Initial Loading Simulation ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const showAlert = (message: string, type: "success" | "danger" | "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleFileChange = (file: File) => {
    const validTypes = [".xlsx", ".csv", ".json"];
    const fileExt = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
    
    if (!validTypes.includes(`.${fileExt.toLowerCase()}`)) {
      showAlert("Format file tidak didukung. Gunakan .xlsx, .csv, atau .json", "danger");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showAlert("Ukuran file maksimal 10MB", "danger");
      return;
    }
    
    setSelectedFile(file);
    showAlert(`File "${file.name}" berhasil dipilih`, "success");
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showAlert("Silakan pilih file terlebih dahulu", "danger");
      return;
    }

    showAlert("Mengupload file...", "info");

    setTimeout(() => {
      const now = new Date();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const newLog: UploadLog = {
        date: now.toLocaleString("id-ID").replace(/\//g, "-"),
        name: formData.get("datasetName") as string,
        source: sources.find(s => s.id === formData.get("dataSource"))?.name || "Kustom",
        status: "staging",
        quality: null
      };

      setLogs([newLog, ...logs]);
      showAlert("Dataset berhasil diupload! Data akan diproses di staging area.", "success");
      setSelectedFile(null);
      form.reset();
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Upload Data" subtitle="Menyiapkan modul pengiriman data..." />
        <LoadingState message="Menghubungkan ke server Mimika DataHub..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      {/* 1. HEADER BANNER - Menggunakan Komponen Global [cite: 56, 318] */}
      <PageHeader 
        title="Upload Data" 
        subtitle="Upload dataset baru ke Mimika DataHub (Excel/CSV/JSON)" 
      />

      {/* 2. ALERT MESSAGE [cite: 319, 321] */}
      {alert && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          alert.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
          alert.type === 'danger' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 
          'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
        }`}>
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. DRAG & DROP AREA [cite: 323, 325] */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length > 0) handleFileChange(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white rounded-3xl p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
            isDragging ? "border-[#ef4444] bg-red-50" : "border-gray-200 hover:border-[#ef4444]"
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            className="hidden" 
            accept=".xlsx,.csv,.json"
          />
          <CloudUpload size={64} className="text-[#ef4444] mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Drag & Drop File</h3>
          <p className="text-gray-500 text-sm mb-6 text-center">atau klik untuk memilih file dari komputer Anda</p>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-4">Support: .xlsx, .csv, .json (Max 10MB)</p>
          
          <button className="bg-[#ef4444] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-red-600 transition shadow-lg shadow-red-200">
            <FolderOpen size={18} /> Pilih File
          </button>

          {selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3 w-full border border-gray-100 animate-in zoom-in-95">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <FileText size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* 4. FORM SECTION [cite: 331, 343] */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Info size={20} className="text-[#1e61d0]" /> Informasi Dataset
          </h3>
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Dataset <span className="text-red-500">*</span></label>
              <input 
                name="datasetName" 
                type="text" 
                placeholder="Contoh: Jumlah Penduduk Mimika 2025" 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Data <span className="text-red-500">*</span></label>
                <select name="dataSource" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none">
                  <option value="">Pilih Sumber</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button 
                  type="button" 
                  onClick={() => setShowSourceModal(true)}
                  className="mt-2 text-[11px] font-bold text-[#10b981] flex items-center gap-1 hover:underline uppercase tracking-tighter"
                >
                  <Plus size={12} /> Tambah Sumber Baru
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori <span className="text-red-500">*</span></label>
                <select name="category" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none">
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button 
                  type="button" 
                  onClick={() => setShowCategoryModal(true)}
                  className="mt-2 text-[11px] font-bold text-[#10b981] flex items-center gap-1 hover:underline uppercase tracking-tighter"
                >
                  <Plus size={12} /> Tambah Kategori Baru
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun <span className="text-red-500">*</span></label>
                <input name="year" type="number" defaultValue="2025" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Periode Data</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] outline-none">
                  <option>Bulanan</option>
                  <option>Triwulan</option>
                  <option>Semester</option>
                  <option>Tahunan</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi</label>
              <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e61d0] resize-none" placeholder="Jelaskan isi dataset ini..."></textarea>
            </div>

            <button type="submit" className="w-full bg-[#0a2647] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#144272] transition-all shadow-lg active:scale-[0.98]">
              <Send size={18} /> Upload & Proses Dataset
            </button>
          </form>
        </div>
      </div>

      {/* 5. LOG SECTION [cite: 344, 349] */}
      <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <History size={18} className="text-gray-400" /> Log Pengiriman Data
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Real-time Staging</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Nama Dataset</th>
                <th className="px-6 py-4">Sumber</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Kualitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{log.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{log.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{log.source}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 font-black text-gray-300 text-right">{log.quality ? `${log.quality}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-400 text-xs">
        © 2025 Mimika DataHub - Pemerintah Kabupaten Mimika | Data melewati proses validasi otomatis [cite: 350]
      </footer>

      {/* 6. MODALS [cite: 351, 359] */}
      {(showSourceModal || showCategoryModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                {showSourceModal ? <Database size={18} className="text-green-500" /> : <Tag size={18} className="text-blue-500" />}
                Tambah {showSourceModal ? "Sumber" : "Kategori"} Baru
              </h3>
              <button 
                onClick={() => { setShowSourceModal(false); setShowCategoryModal(false); setNewItemName(""); }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Item</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`Contoh: ${showSourceModal ? 'Dinas Perikanan' : 'Infrastruktur'}`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => {
                  if (!newItemName) return;
                  const newItem = { id: Date.now(), name: newItemName };
                  if (showSourceModal) setSources([...sources, newItem]);
                  else setCategories([...categories, newItem]);
                  showAlert(`Berhasil menambahkan "${newItemName}"`, "success");
                  setShowSourceModal(false);
                  setShowCategoryModal(false);
                  setNewItemName("");
                }}
                className="w-full bg-[#10b981] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-emerald-600 transition-all active:scale-[0.98]"
              >
                Simpan Item Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}