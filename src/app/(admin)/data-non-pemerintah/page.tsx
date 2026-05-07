"use client";

import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

// Modular Components
import NonPemerintahFilter from "./components/NonPemerintahFilter";
import NonPemerintahTable from "./components/NonPemerintahTable";
import NonPemerintahDetailModal from "./components/NonPemerintahDetailModal";

// Integrasi Store
import { useDatasetStore } from "./../../store/useDatasetStore";
import { useSourceStore } from "./../../store/useSourceStore"; // Impor Store Sumber
import { useSourceTypeStore } from "./../../store/useSourceTypeStore"; // Impor Store Tipe Sumber
import { useCategoryStore } from "./../../store/useCategoryStore"; // Impor Store Kategori
import { Dataset } from "../../types/dataset";

export default function DataNonPemerintahPage() {
  const { 
    publicDatasets, fetchPublicDatasets, isLoading: isStoreLoading,
    downloadDataset, downloadDatasetList, fetchDatasetContent,
    selectedDatasetContent, resetContent 
  } = useDatasetStore();

  // Integrasi Store untuk Master Data (Penyelesaian Error: Cannot find name)
  const { sources, fetchSources } = useSourceStore();
  const { sourceTypes, fetchSourceTypes } = useSourceTypeStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        // Fetch semua data yang dibutuhkan secara paralel
        await Promise.all([
          fetchPublicDatasets('non-pemerintah'),
          fetchSources(),
          fetchSourceTypes(),
          fetchCategories()
        ]);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [fetchPublicDatasets, fetchSources, fetchSourceTypes, fetchCategories]);

  // Handler untuk menutup modal (Penyelesaian Error: Cannot find name 'handleCloseDetail')
  const handleCloseDetail = () => {
    setSelectedDataset(null);
    resetContent();
  };

  const filteredData = useMemo(() => {
    return publicDatasets.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [publicDatasets, searchTerm]);

  if (isInitialLoading || isStoreLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-6 font-sans text-black">
        <PageHeader title="Data Non-Pemerintah" subtitle="Menghubungkan ke sumber data eksternal..." />
        <LoadingState message="Mengumpulkan data organisasi internasional & NGO..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-6 font-sans animate-in fade-in duration-500 text-black">
      <PageHeader 
        title="Data Non-Pemerintah" 
        subtitle="Data dari organisasi internasional, NGO, dan sektor swasta" 
        withSearch
        onSearch={setSearchTerm}
      />

      <NonPemerintahFilter 
        onSearch={setSearchTerm}
        onReset={() => setSearchTerm("")}
        onExport={(fmt) => downloadDatasetList('non-pemerintah', fmt)} 
      />

      <NonPemerintahTable 
        data={filteredData}
        onOpenDetail={(d) => {
          setSelectedDataset(d);
          fetchDatasetContent(d.id, 100); 
        }}
      />

      {selectedDataset && (
        <NonPemerintahDetailModal 
          dataset={selectedDataset}
          content={selectedDatasetContent}
          sources={sources}
          sourceTypes={sourceTypes}
          categories={categories}
          onClose={handleCloseDetail}
          onDownload={(d) => downloadDataset(d.id, `mimika_${d.title.replace(/\s+/g, '_')}`)}
        />
      )}

      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
      </footer>
    </div>
  );
}