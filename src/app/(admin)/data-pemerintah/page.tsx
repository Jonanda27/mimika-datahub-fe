"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

// Import Komponen Modular
import PemerintahFilter from "./components/PemerintahFilter";
import PemerintahTable from "./components/PemerintahTable";
import PemerintahDetailModal from "./components/PemerintahDetailModal";

// Integrasi Store
import { useDatasetStore } from "./../../store/useDatasetStore";
import { useSourceStore } from "./../../store/useSourceStore";
import { useCategoryStore } from "./../../store/useCategoryStore";
import { useSourceTypeStore } from "./../../store/useSourceTypeStore";
import { Dataset } from "../../types/dataset";

export default function DataPemerintahPage() {
  const { 
    publicDatasets, fetchPublicDatasets, isLoading: isStoreLoading,
    downloadDataset, downloadDatasetList, fetchDatasetContent,
    selectedDatasetContent, resetContent 
  } = useDatasetStore();

  const { sources, fetchSources } = useSourceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { sourceTypes, fetchSourceTypes } = useSourceTypeStore();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      await Promise.all([
        fetchPublicDatasets('pemerintah'),
        fetchSources(),
        fetchCategories(),
        fetchSourceTypes()
      ]);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchPublicDatasets, fetchSources, fetchCategories, fetchSourceTypes]);

  const filteredData = publicDatasets.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isInitialLoading || isStoreLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-6 font-sans">
        <PageHeader title="Data Pemerintah" subtitle="Menghubungkan ke basis data..." />
        <LoadingState message="Menyiapkan data resmi Kabupaten Mimika..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-6 font-sans animate-in fade-in duration-500">
      <PageHeader 
        title="Data Pemerintah" 
        subtitle="Data resmi dari BPS, OPD, dan Pemda Mimika" 
        withSearch 
        onSearch={setSearchTerm}
      />

      <PemerintahFilter 
        sources={sources} 
        categories={categories}
        onSearch={setSearchTerm}
        onReset={() => setSearchTerm("")}
        onExport={(fmt) => downloadDatasetList('pemerintah', fmt)}
      />

      <PemerintahTable 
        data={filteredData} 
        onOpenDetail={(d) => {
          setSelectedDataset(d);
          fetchDatasetContent(d.id, 100);
        }} 
      />

      {selectedDataset && (
        <PemerintahDetailModal 
          dataset={selectedDataset}
          content={selectedDatasetContent}
          sources={sources}
          sourceTypes={sourceTypes}
          categories={categories}
          onClose={() => {
            setSelectedDataset(null);
            resetContent();
          }}
          onDownload={(d) => downloadDataset(d.id, `mimika_${d.title}`)}
        />
      )}
      
      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
      </footer>
    </div>
  );
}