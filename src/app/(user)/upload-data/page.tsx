"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import { StatusType } from "@/components/ui/StatusBadge";

// Import Komponen Lokal
import FileUploadArea from "./components/FileUploadArea";
import DatasetForm from "./components/DatasetForm";
import UploadLogTable from "./components/UploadLogTable";
import AddItemModal from "./components/AddItemModal";

// Integrasi Service & Store
import { useIngestStore } from "./../../store/useIngestStore";
import { useSourceStore } from "./../../store/useSourceStore";
import { useCategoryStore } from "./../../store/useCategoryStore";
import { useSourceTypeStore } from "./../../store/useSourceTypeStore";
import { useDatasetStore } from "./../../store/useDatasetStore";
import { useDistrictStore } from "./../../store/useDistrictStore"; // [NEW] Untuk dropdown distrik

// --- Types ---
export interface UploadLog {
  date: string;
  name: string;
  source: string;
  status: StatusType;
  quality: number | null;
}

export default function UploadDataPage() {
  // --- States ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null); // [NEW] State Distrik
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "danger" | "info" } | null>(null);

  // Store Integration
  const { isProcessing, executeUpload, setError } = useIngestStore();
  const { sources, fetchSources, addSource } = useSourceStore();
  const { categories, fetchCategories, addCategory } = useCategoryStore();
  const { sourceTypes, fetchSourceTypes, addSourceType } = useSourceTypeStore();
  const { myDatasets, fetchMyDatasets } = useDatasetStore();
  const { districts, fetchDistricts } = useDistrictStore(); // [NEW] Ambil daftar distrik

  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSourceTypeModal, setShowSourceTypeModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // --- Initial Data Fetching ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSources(), 
          fetchCategories(), 
          fetchSourceTypes(),
          fetchMyDatasets(),
          fetchDistricts() // [NEW]
        ]);
      } catch (error) {
        console.error("Gagal memuat data awal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [fetchSources, fetchCategories, fetchSourceTypes, fetchMyDatasets, fetchDistricts]);

  const logs: UploadLog[] = myDatasets.map((ds) => ({
    date: new Date(ds.created_at).toLocaleString("id-ID").replace(/\//g, "-"),
    name: ds.title,
    source: sources.find(s => s.id === ds.source_id)?.name || "Sumber External",
    status: ds.status as StatusType,
    quality: ds.quality_score
  }));

  // --- Handlers ---
  const showAlert = (message: string, type: "success" | "danger" | "info") => {
    setAlert({ message, type });
    if (type !== "info") {
      setTimeout(() => setAlert(null), 6000);
    }
  };

  const handleFileChange = (file: File) => {
    // [UPDATE] Mendukung Tabular & Dokumen sesuai Backend
    const validTypes = [".xlsx", ".xls", ".csv", ".pdf", ".doc", ".docx"];
    const fileExt = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
    
    if (!validTypes.includes(`.${fileExt.toLowerCase()}`)) {
      showAlert("Format file tidak didukung. Gunakan Excel, CSV, PDF, atau Word.", "danger");
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) { // Up to 20MB
      showAlert("Ukuran file maksimal 20MB", "danger");
      return;
    }
    
    setSelectedFile(file);
    showAlert(`File "${file.name}" berhasil dipilih`, "success");
  };

  const handleSaveNewItem = async () => {
    if (!newItemName) return;
    setIsLoading(true);
    try {
      if (showSourceModal) {
        await addSource({ name: newItemName, type: "opd", icon: "fa-database" }); 
        showAlert(`Sumber "${newItemName}" berhasil ditambahkan`, "success");
      } else if (showCategoryModal) {
        await addCategory({ name: newItemName }); 
        showAlert(`Kategori "${newItemName}" berhasil ditambahkan`, "success");
      } else if (showSourceTypeModal) {
        await addSourceType({ name: newItemName });
        showAlert(`Tipe Sumber "${newItemName}" berhasil ditambahkan`, "success");
      }
      setShowSourceModal(false);
      setShowCategoryModal(false);
      setShowSourceTypeModal(false);
      setNewItemName("");
    } catch (err: any) {
      showAlert(err.message || "Gagal menambahkan item baru", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      showAlert("Silakan pilih file dataset/dokumen terlebih dahulu", "danger");
      return;
    }
    if (!selectedImage) {
      showAlert("Silakan pilih gambar cover dataset", "danger");
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const requestData = {
      title: formData.get("datasetName") as string,
      dataset_type: formData.get("dataset_type") as string,
      source_id: Number(formData.get("dataSource")),
      category_id: Number(formData.get("category")),
      source_type_id: Number(formData.get("source_type_id")),
      year: Number(formData.get("year")),
      period: formData.get("period") as string,
      description: formData.get("description") as string,
      district_id: selectedDistrictId, // [NEW] Mengirim District ID manual
      file: selectedFile,
      image: selectedImage
    };

    // Validasi Dasar
    if (!requestData.title || !requestData.source_id || !requestData.category_id) {
      showAlert("Mohon lengkapi semua field wajib (*)", "danger");
      return;
    }

    showAlert("Sedang memproses algoritma pembersihan data dan upload GIS...", "info");

    try {
      // Menggunakan action executeUpload dari Store
      await executeUpload(requestData);
      
      showAlert("Data berhasil diolah dan dipetakan ke wilayah Mimika!", "success");
      
      // Refresh list
      await fetchMyDatasets();
      
      // Reset Form
      setSelectedFile(null);
      setSelectedImage(null);
      setSelectedDistrictId(null);
      formElement.reset();
      setAlert(null); // Tutup alert info

    } catch (err: any) {
      showAlert(err.message || "Gagal mengupload data", "danger");
    }
  };

  if (isLoading && sources.length === 0) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader title="Upload Data" subtitle="Menyiapkan modul Ingest v2.0..." />
          <LoadingState message="Menghubungkan ke Cleaning Engine Mimika DataHub..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <PageHeader 
          title="Upload Data" 
          subtitle="Gunakan modul ini untuk mengunggah Dataset (Excel/CSV) atau Dokumen (PDF) ke sistem." 
        />

        {alert && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between border-l-4 shadow-sm animate-in slide-in-from-top-4 duration-300 ${
            alert.type === 'success' ? 'bg-green-50 text-green-800 border-green-500' : 
            alert.type === 'danger' ? 'bg-red-50 text-red-800 border-red-500' : 
            'bg-blue-50 text-blue-800 border-blue-500'
          }`}>
            <div className="flex items-center gap-3">
              {alert.type === 'success' ? <CheckCircle2 size={20} /> : alert.type === 'info' ? <Info size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-semibold">{alert.message}</span>
            </div>
            {isProcessing && <Loader2 size={18} className="animate-spin text-blue-600" />}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <FileUploadArea 
            selectedFile={selectedFile} 
            isProcessing={isProcessing} 
            onFileChange={handleFileChange} 
            onRemoveFile={() => setSelectedFile(null)} 
          />
          
          <DatasetForm 
            sources={sources} 
            categories={categories} 
            sourceTypes={sourceTypes}
            districts={districts} // [NEW] Pass daftar distrik ke form
            isProcessing={isProcessing} 
            selectedImage={selectedImage}
            selectedDistrictId={selectedDistrictId} // [NEW]
            onImageChange={setSelectedImage} 
            onDistrictChange={setSelectedDistrictId} // [NEW]
            onSubmit={handleUpload} 
            onAddSource={() => setShowSourceModal(true)} 
            onAddCategory={() => setShowCategoryModal(true)} 
            onAddSourceType={() => setShowSourceTypeModal(true)}
          />
        </div>

        <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-[#0f3460] rounded-full"></div>
                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Riwayat Pengiriman Terbaru</h3>
            </div>
            <UploadLogTable logs={logs} />
        </div>

        <footer className="mt-12 text-center text-gray-400 text-[10px] uppercase tracking-[0.3em] pb-10">
          Infrastruktur Data Statistik Sektoral - BRIDA Mimika 2026
        </footer>

        <AddItemModal 
          isOpen={showSourceModal || showCategoryModal || showSourceTypeModal}
          onClose={() => { 
              setShowSourceModal(false); 
              setShowCategoryModal(false); 
              setShowSourceTypeModal(false);
              setNewItemName(""); 
          }}
          onSave={handleSaveNewItem}
          title={showSourceModal ? "Tambah Sumber Baru" : showCategoryModal ? "Tambah Kategori Baru" : "Tambah Tipe Sumber"}
          placeholder={showSourceModal ? "Misal: Dinas Kesehatan" : showCategoryModal ? "Misal: Kesehatan & Kesejahteraan" : "Misal: Publikasi Dokumen"}
          value={newItemName}
          onChange={setNewItemName}
          type={showSourceModal ? "source" : "category"}
        />
      </div>
    </div>
  );
}

// Komponen Loader internal sederhana
function Loader2({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
            className={`animate-spin ${className}`}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}