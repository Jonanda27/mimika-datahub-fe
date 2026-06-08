// src/app/(user)/upload-data/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

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
import { ingestService } from "./../../services/ingest.service";
import { useIngestStore } from "./../../store/useIngestStore";
import { useSourceStore } from "./../../store/useSourceStore";
import { useCategoryStore } from "./../../store/useCategoryStore";
import { useSourceTypeStore } from "./../../store/useSourceTypeStore";
import { useDatasetStore } from "./../../store/useDatasetStore";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State Gambar (Gabungan dari branch teman)
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "danger" | "info" } | null>(null);

  // Store Integration
  const { isProcessing, setProcessing, setResult, setError } = useIngestStore();
  const { sources, fetchSources, addSource } = useSourceStore();
  const { categories, fetchCategories, addCategory } = useCategoryStore();
  const { sourceTypes, fetchSourceTypes, addSourceType } = useSourceTypeStore();

  // Integrasi Dataset Store untuk mengambil data 'My Datasets'
  const { myDatasets, fetchMyDatasets } = useDatasetStore();

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
          fetchMyDatasets()
        ]);
      } catch (error) {
        console.error("Gagal memuat data awal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [fetchSources, fetchCategories, fetchSourceTypes, fetchMyDatasets]);

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
    setTimeout(() => setAlert(null), 4000);
  };

  const handleFileChange = (file: File) => {
    // [UPDATE] Mengadopsi format file yang lebih lengkap dari branch rekan Anda
    const validTypes = [".xlsx", ".xls", ".csv", ".json", ".pdf", ".doc", ".docx"];
    const fileExt = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);

    if (!validTypes.includes(`.${fileExt.toLowerCase()}`)) {
      showAlert("Format file tidak didukung. Gunakan Excel, CSV, JSON, atau Dokumen (PDF/Word)", "danger");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showAlert("Ukuran file maksimal 10MB", "danger");
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
      showAlert("Silakan pilih file dataset terlebih dahulu", "danger");
      return;
    }
    if (!selectedImage) {
      showAlert("Silakan pilih gambar cover untuk dataset ini", "danger");
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const title = formData.get("title") as string;
    const datasetType = formData.get("dataset_type") as string;
    const sourceId = formData.get("source_id");
    const categoryId = formData.get("category_id");
    const sourceTypeId = formData.get("source_type_id");
    const year = formData.get("year");
    const period = formData.get("period") as string;
    const districtId = formData.get("district_id"); // Data spasial baru dari branch Anda
    const description = formData.get("description") as string;

    // Validasi: pastikan field utama tidak kosong
    if (!title || !sourceId || !categoryId || !year || !sourceTypeId || !datasetType) {
      showAlert("Mohon lengkapi semua field bertanda bintang (*)", "danger");
      return;
    }

    setProcessing(true);
    setError(null);
    showAlert("Sedang memproses, membersihkan data, dan upload gambar...", "info");

    try {
      const result = await ingestService.uploadProcess({
        title,
        dataset_type: datasetType,
        source_id: Number(sourceId),
        category_id: Number(categoryId),
        source_type_id: Number(sourceTypeId),
        year: Number(year),
        period,
        description,
        file: selectedFile,
        // Menggabungkan logika Image (nau) dan district_id (yessir)
        image: selectedImage,
        district_id: districtId === "" ? null : Number(districtId)
      });

      setResult(result);
      showAlert(result.message, "success");
      await fetchMyDatasets();

      setSelectedFile(null);
      setSelectedImage(null);
      formElement.reset();
    } catch (err: any) {
      showAlert(err.message || "Gagal mengupload dataset", "danger");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading && sources.length === 0) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        <div className="max-w-350 mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader title="Upload Data" subtitle="Menyiapkan modul pengiriman data..." />
          <LoadingState message="Menghubungkan ke server Mimika DataHub..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      <div className="max-w-350 mx-auto p-4 md:p-6 lg:p-8">

        <PageHeader
          title="Upload Data"
          subtitle="Upload dataset baru ke Mimika DataHub (Excel/CSV/JSON/PDF)"
        />

        {alert && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${alert.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
            alert.type === 'danger' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
              'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}>
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{alert.message}</span>
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
            isProcessing={isProcessing}
            selectedImage={selectedImage}
            onImageChange={setSelectedImage}
            onSubmit={handleUpload}
            onAddSource={() => setShowSourceModal(true)}
            onAddCategory={() => setShowCategoryModal(true)}
            onAddSourceType={() => setShowSourceTypeModal(true)}
          />
        </div>

        <UploadLogTable logs={logs} />

        <footer className="mt-10 text-center text-gray-400 text-xs pb-4">
          © 2026 Mimika DataHub - Pemerintah Kabupaten Mimika
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
          title={showSourceModal ? "Sumber" : showCategoryModal ? "Kategori" : "Tipe Sumber"}
          placeholder={showSourceModal ? "Contoh: Dinas Perikanan" : showCategoryModal ? "Contoh: Infrastruktur" : "Contoh: Statistik Sektoral"}
          value={newItemName}
          onChange={setNewItemName}
          type={showSourceModal ? "source" : "category"}
        />
      </div>
    </div>
  );
}