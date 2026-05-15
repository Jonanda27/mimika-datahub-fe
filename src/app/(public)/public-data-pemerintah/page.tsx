"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoadingState from "@/components/ui/LoadingState";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Import Komponen Modular
import PemerintahFilter from "./components/PemerintahFilter";
import PemerintahTable from "./components/PemerintahTable";
import PemerintahDetailModal from "./components/PemerintahDetailModal";

// Integrasi Store
import { useDatasetStore } from "./../../store/useDatasetStore";
import { useSourceStore } from "./../../store/useSourceStore";
import { useCategoryStore } from "./../../store/useCategoryStore";
import { useSourceTypeStore } from "./../../store/useSourceTypeStore";
import { Dataset, DatasetFilterParams } from "../../types/dataset";

// PISAHKAN KONTEN UTAMA KE DALAM KOMPONEN TERSENDIRI
function DataPemerintahContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || ""; // Ambil kata kunci dari URL

  const { 
    publicDatasets, fetchPublicDatasets, isLoading: isStoreLoading,
    downloadDataset, downloadDatasetList, fetchDatasetContent,
    selectedDatasetContent, resetContent,
    sidebarStats, fetchSidebarStats
  } = useDatasetStore();

  const { sources, fetchSources } = useSourceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { sourceTypes, fetchSourceTypes } = useSourceTypeStore();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Set state awal berdasarkan URL Parameter
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State untuk mobile filter

  const [filters, setFilters] = useState<DatasetFilterParams>({
    category_id: null,
    source_id: null,
    source_type_id: null,
    year: null
  });

  // Pantau perubahan URL Parameter jika user kembali / maju dari browser history
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const loadData = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      await Promise.all([
        fetchPublicDatasets('pemerintah', filters), 
        fetchSidebarStats('pemerintah'),
        fetchSources(),
        fetchCategories(),
        fetchSourceTypes()
      ]);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [fetchPublicDatasets, fetchSidebarStats, fetchSources, fetchCategories, fetchSourceTypes, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (newFilters: DatasetFilterParams) => {
    setFilters(newFilters);
    fetchPublicDatasets('pemerintah', newFilters);
  };

  const filteredData = publicDatasets.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isInitialLoading || isStoreLoading) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen flex items-center justify-center p-6">
        <LoadingState message="Menyiapkan data resmi Kabupaten Mimika..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen font-sans text-black pt-6 md:pt-10 pb-20">
      <div className="max-w-375 w-full mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Search Data
            </h1>
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-bold text-sm shadow-sm"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
          
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 md:py-5 text-base focus:outline-none focus:border-[#0071bc] focus:ring-2 focus:ring-[#0071bc]/20 transition-all bg-white shadow-sm"
            />
            <button className="absolute right-5 top-1/2 -translate-y-1/2">
              <Search size={22} className="text-gray-400 hover:text-[#0071bc] transition-colors" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* ASIDE / FILTER: Responsive Drawer for Mobile */}
          <aside className={`
            fixed inset-y-0 left-0 z-110-[280px] bg-white transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            lg:relative lg:translate-x-0 lg:z-0 lg:bg-transparent lg:w-[320px] shrink-0
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Close Button Mobile */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b">
              <span className="font-bold">Filters</span>
              <button onClick={() => setIsFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="h-full overflow-y-auto lg:h-auto lg:sticky lg:top-24 p-4 lg:p-0">
              <PemerintahFilter 
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
                onExport={(fmt) => downloadDatasetList('pemerintah', fmt)}
              />
            </div>
          </aside>

          {/* Overlay Mobile */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-100 lg:hidden backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-6 px-6 pt-2 border-b border-gray-200 overflow-x-auto w-full hide-scrollbar">
              <button className="py-4 text-sm font-bold text-[#0071bc] border-b-[3px] border-[#0071bc] whitespace-nowrap">
                All Datasets
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-sm text-gray-500">
                  Showing <strong className="text-gray-900">{filteredData.length}</strong> of <strong className="text-gray-900">{publicDatasets.length}</strong> Datasets
                  {searchTerm && (
                    <span> for <strong className="text-[#0071bc]">"{searchTerm}"</strong></span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</label>
                  <select className="border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0071bc]/20">
                    <option>Last updated date</option>
                    <option>A-Z (Alphabetical)</option>
                    <option>Highest Quality</option>
                  </select>
                </div>
              </div>

              <PemerintahTable 
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
        
        <footer className="mt-12 text-center text-gray-400 text-xs font-medium pb-8">
          © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
        </footer>
      </div>
    </div>
  );
}

// BUNGKUS DENGAN SUSPENSE AGAR NEXT.JS BUILD TIDAK ERROR SAAT MENGGUNAKAN useSearchParams()
export default function DataPemerintahPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f0f4f8] min-h-screen flex items-center justify-center p-6">
        <LoadingState message="Memuat halaman pencarian..." />
      </div>
    }>
      <DataPemerintahContent />
    </Suspense>
  );
}