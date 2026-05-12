// src/app/(user)/user-data-pemerintah/page.tsx
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoadingState from "@/components/ui/LoadingState";
import { Search, LineChart, Database, FileText, LayoutGrid } from "lucide-react";

// Import Komponen Modular
import PemerintahFilter from "./components/PemerintahFilter";
import PemerintahTable from "./components/PemerintahTable";
import PemerintahDetailModal from "./components/PemerintahDetailModal";

// Integrasi Store
import { useDatasetStore } from "@/src/app/store/useDatasetStore";
import { useSourceStore } from "@/src/app/store/useSourceStore";
import { useCategoryStore } from "@/src/app/store/useCategoryStore";
import { useSourceTypeStore } from "@/src/app/store/useSourceTypeStore";
import { Dataset, DatasetFilterParams } from "@/src/app/types/dataset";

function DataPemerintahContent() {
  const searchParams = useSearchParams();

  // Tangkap parameter Drill-down dari Peta (URL)
  const urlDistrictId = searchParams.get('district_id');
  const urlCategoryId = searchParams.get('category_id');

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  // Inisialisasi state filter secara dinamis dari URL (URL-Driven State)
  // Pastikan properti 'district_id' sudah ada di interface DatasetFilterParams Anda
  const [filters, setFilters] = useState<DatasetFilterParams & { district_id?: number | null }>({
    category_id: urlCategoryId ? Number(urlCategoryId) : null,
    source_id: null,
    source_type_id: null,
    year: null,
    district_id: urlDistrictId ? Number(urlDistrictId) : null
  });

  // Fungsi untuk memuat data awal
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler saat filter dropdown berubah
  const handleFilterChange = (newFilters: DatasetFilterParams) => {
    // Merge new filters dengan mempertahankan district_id yang aktif (jika UI filter mendukung district)
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchPublicDatasets('pemerintah', updatedFilters);
  };

  const filteredData = publicDatasets.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isInitialLoading || isStoreLoading) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen font-sans text-black pt-8">
        <div className="max-w-[1500px] w-full mx-auto p-4 md:p-6 lg:p-8">
          <LoadingState message="Menyiapkan data resmi Kabupaten Mimika..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500 text-black pt-6 md:pt-10">
      <div className="max-w-[1500px] w-full mx-auto px-4 md:px-6 lg:px-8 overflow-x-hidden">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight shrink-0">
            Search Data
          </h1>

          <div className="relative w-full md:max-w-2xl lg:max-w-4xl flex-1">
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 md:py-4 text-base focus:outline-none focus:border-[#0071bc] focus:ring-1 focus:ring-[#0071bc] transition-all bg-white shadow-sm"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search size={22} className="text-gray-900 font-bold" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 sticky top-24">
            <PemerintahFilter
              sources={sources}
              sourceTypes={sourceTypes}
              categories={categories}
              sidebarStats={sidebarStats}
              currentFilters={filters}
              onFilterChange={handleFilterChange}
              onSearch={setSearchTerm}
              onReset={() => {
                const resetObj = { category_id: null, source_id: null, source_type_id: null, year: null, district_id: null };
                setSearchTerm("");
                handleFilterChange(resetObj);

                // Menghapus parameter dari URL secara halus tanpa me-refresh halaman
                window.history.replaceState(null, '', window.location.pathname);
              }}
              onExport={(fmt) => downloadDatasetList('pemerintah', fmt)}
            />
          </aside>

          <main className="flex-1 min-w-0 w-full bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="flex items-center gap-6 px-6 pt-2 border-b border-gray-200 overflow-x-auto w-full hide-scrollbar">
              <button className="py-3 text-sm font-bold text-[#0071bc] border-b-[3px] border-[#0071bc] flex items-center gap-2 whitespace-nowrap shrink-0">
                All
              </button>
            </div>

            <div className="p-4 md:p-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
                <p className="text-sm text-gray-700">
                  Showing <strong className="text-gray-900">{filteredData.length > 0 ? "1" : "0"}-{filteredData.length}</strong> of <strong className="text-gray-900">{publicDatasets.length}</strong> Datasets
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select className="border border-gray-300 bg-white text-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#0071bc] cursor-pointer">
                      <option>Last updated date</option>
                      <option>A-Z (Alphabetical)</option>
                      <option>Highest Quality</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <PemerintahTable
                  data={filteredData}
                  onOpenDetail={(d) => {
                    setSelectedDataset(d);
                    fetchDatasetContent(d.id, 100);
                  }}
                />
              </div>
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

        <footer className="mt-12 text-center text-gray-400 text-xs font-medium pb-8 w-full">
          © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
        </footer>
      </div>
    </div>
  );
}

// Default export yang dibungkus dengan Suspense sesuai best practice Next.js App Router
export default function DataPemerintahPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f0f4f8] min-h-screen font-sans text-black pt-8">
        <div className="max-w-[1500px] w-full mx-auto p-4 md:p-6 lg:p-8">
          <LoadingState message="Menyiapkan data resmi Kabupaten Mimika..." />
        </div>
      </div>
    }>
      <DataPemerintahContent />
    </Suspense>
  );
}