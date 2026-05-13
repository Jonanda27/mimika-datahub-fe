"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import LoadingState from "@/components/ui/LoadingState";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Modular Components
import NonPemerintahFilter from "./components/NonPemerintahFilter";
import NonPemerintahTable from "./components/NonPemerintahTable";
import NonPemerintahDetailModal from "./components/NonPemerintahDetailModal";

// Integrasi Store
import { useDatasetStore } from "./../../store/useDatasetStore";
import { useSourceStore } from "./../../store/useSourceStore"; 
import { useSourceTypeStore } from "./../../store/useSourceTypeStore"; 
import { useCategoryStore } from "./../../store/useCategoryStore"; 
import { Dataset, DatasetFilterParams } from "../../types/dataset";

export default function DataNonPemerintahPage() {
  const { 
    publicDatasets, fetchPublicDatasets, isLoading: isStoreLoading,
    downloadDataset, downloadDatasetList, fetchDatasetContent,
    selectedDatasetContent, resetContent,
    sidebarStats, fetchSidebarStats
  } = useDatasetStore();

  const { sources, fetchSources } = useSourceStore();
  const { sourceTypes, fetchSourceTypes } = useSourceTypeStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<DatasetFilterParams>({
    category_id: null,
    source_id: null,
    source_type_id: null,
    year: null
  });

  const loadData = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      await Promise.all([
        fetchPublicDatasets('non-pemerintah', filters),
        fetchSidebarStats('non-pemerintah'),
        fetchSources(),
        fetchSourceTypes(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [fetchPublicDatasets, fetchSidebarStats, fetchSources, fetchSourceTypes, fetchCategories, filters]);

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (newFilters: DatasetFilterParams) => {
    setFilters(newFilters);
    fetchPublicDatasets('non-pemerintah', newFilters);
  };

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
      <div className="bg-[#f0f4f8] min-h-screen flex items-center justify-center p-6 text-black">
        <LoadingState message="Mengumpulkan data organisasi internasional & NGO..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen font-sans text-black pt-6 md:pt-10 pb-10">
      <div className="max-w-[1500px] w-full mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Search Data
            </h1>
            
            {/* Filter Toggle Mobile */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
          
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search data (NGO, Internasional, Sektoral)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 md:py-4 pl-12 text-base focus:outline-none focus:border-[#0071bc] focus:ring-4 focus:ring-[#0071bc]/10 transition-all bg-white shadow-sm"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Sidebar (Filter) - Desktop: Sticky, Mobile: Drawer */}
          <aside className={`
            fixed inset-y-0 left-0 z-[60] w-[300px] bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0 lg:bg-transparent lg:w-[320px] shrink-0
            ${isMobileFilterOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header Sidebar */}
            <div className="lg:hidden flex items-center justify-between p-5 border-b bg-gray-50">
              <span className="font-bold">Filters Panel</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="h-full overflow-y-auto lg:h-auto lg:sticky lg:top-24 p-5 lg:p-0">
              <NonPemerintahFilter 
                sources={sources}
                sourceTypes={sourceTypes}
                categories={categories}
                sidebarStats={sidebarStats}
                currentFilters={filters}
                onFilterChange={handleFilterChange}
                onSearch={setSearchTerm}
                onReset={() => {
                  const resetObj = { category_id: null, source_id: null, source_type_id: null, year: null };
                  setSearchTerm("");
                  handleFilterChange(resetObj);
                }}
                onExport={(fmt) => downloadDatasetList('non-pemerintah', fmt)} 
              />
            </div>
          </aside>

          {/* Overlay Mobile */}
          {isMobileFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* Table Content */}
          <main className="flex-1 min-w-0 w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0071bc] uppercase tracking-widest border-b-2 border-[#0071bc] pb-1">
                Data List
              </h2>
            </div>

            <div className="p-4 md:p-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Showing <span className="text-gray-900 font-bold">{filteredData.length}</span> of <span className="text-gray-900 font-bold">{publicDatasets.length}</span> Datasets
                </p>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs text-gray-400 font-bold uppercase whitespace-nowrap">Sort:</label>
                  <select className="w-full sm:w-auto border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0071bc]/20">
                    <option>Terbaru</option>
                    <option>Alphabetical (A-Z)</option>
                    <option>High Quality</option>
                  </select>
                </div>
              </div>

              <NonPemerintahTable 
                data={filteredData}
                onOpenDetail={(d) => {
                  setSelectedDataset(d);
                  fetchDatasetContent(d.id, 100); 
                }}
              />
            </div>
          </main>
        </div>

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

        <footer className="mt-12 text-center text-gray-400 text-[10px] md:text-xs font-medium pb-8">
          © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
        </footer>
      </div>
    </div>
  );
}