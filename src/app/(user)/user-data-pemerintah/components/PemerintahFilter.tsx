"use client";

import { useState } from "react";
import { 
  Search, 
  RotateCcw, 
  DownloadCloud, 
  FileSpreadsheet, 
  ChevronDown, 
  ChevronUp,
  Check
} from "lucide-react";
import { Source } from "@/src/app/types/source";
import { Category } from "@/src/app/types/category";
import { SourceType } from "@/src/app/types/source-type";
import { SidebarStats, DatasetFilterParams } from "@/src/app/types/dataset";

interface PemerintahFilterProps {
  sources: Source[];
  sourceTypes: SourceType[];
  categories: Category[];
  sidebarStats: SidebarStats | null;
  currentFilters: DatasetFilterParams;
  onFilterChange: (filters: DatasetFilterParams) => void;
  onSearch: (val: string) => void;
  onReset: () => void;
  onExport: (format: 'excel' | 'csv') => void;
}

export default function PemerintahFilter({ 
  sources, 
  sourceTypes,
  categories,
  sidebarStats,
  currentFilters,
  onFilterChange,
  onSearch, 
  onReset, 
  onExport 
}: PemerintahFilterProps) {
  
  // State akordion: Default terbuka semua di Desktop, bisa disesuaikan untuk Mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    source: false, // Default tutup di mobile/awal agar tidak terlalu panjang
    sourceType: false,
    category: true,
    year: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSourceCount = (id: number) => sidebarStats?.sources.find(s => s.id === id)?.count || 0;
  const getSourceTypeCount = (id: number) => sidebarStats?.source_types.find(st => st.id === id)?.count || 0;
  const getCategoryCount = (id: number) => sidebarStats?.categories.find(c => c.id === id)?.count || 0;

  const handleSelectFilter = (key: keyof DatasetFilterParams, id: number | null) => {
    onFilterChange({
      ...currentFilters,
      [key]: id
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl w-full font-sans text-black shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300">
      
      {/* HEADER: Sticky di bagian atas filter */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20 shrink-0">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase md:hidden">Saring Data Mimika</p>
        </div>
        <button 
          onClick={onReset} 
          className="text-[11px] font-black text-[#0071bc] flex items-center gap-1.5 hover:bg-blue-50 px-2 py-1 rounded-lg transition-all active:scale-95"
        >
          <RotateCcw size={14} /> CLEAR
        </button>
      </div>

      {/* BODY: Scrollable area dengan tinggi dinamis */}
      <div className="overflow-y-auto flex-1 max-h-[60vh] md:max-h-[70vh] lg:max-h-[calc(100vh-280px)] custom-scrollbar">
        
        {/* SECTION: PENCARIAN */}
        <FilterSection 
          title="Pencarian" 
          isOpen={openSections.search} 
          onToggle={() => toggleSection('search')}
        >
          <div className="relative mt-1">
            <input 
              type="text" 
              placeholder="Cari kata kunci..." 
              onChange={(e) => onSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071bc] focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50/50 text-black"
            />
            <Search size={16} className="absolute right-3 top-3 text-gray-400" />
          </div>
        </FilterSection>

        {/* SECTION: TAHUN (Responsive Grid) */}
        <FilterSection 
          title="Tahun Data" 
          isOpen={openSections.year} 
          onToggle={() => toggleSection('year')}
        >
          <div className="space-y-1 mt-1">
            <FilterItem 
              label="Semua Tahun" 
              isActive={currentFilters.year === null} 
              onClick={() => handleSelectFilter('year', null)} 
            />
            {/* Grid 2 kolom di HP & iPad, 1 kolom di Sidebar Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
              {sidebarStats?.years.map(y => (
                <FilterItem 
                  key={y.id}
                  label={y.name}
                  count={y.count}
                  isActive={currentFilters.year === y.id}
                  onClick={() => handleSelectFilter('year', y.id)}
                />
              ))}
            </div>
          </div>
        </FilterSection>

        {/* SECTION: SUMBER DATA (Scrollable inside) */}
        <FilterSection 
          title="Sumber Data (OPD)" 
          isOpen={openSections.source} 
          onToggle={() => toggleSection('source')}
        >
          <div className="space-y-1 mt-1 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            <FilterItem 
              label="Semua Sumber" 
              isActive={currentFilters.source_id === null} 
              onClick={() => handleSelectFilter('source_id', null)} 
            />
            {sources.map(s => (
              <FilterItem 
                key={s.id}
                label={s.name}
                count={getSourceCount(s.id)}
                isActive={currentFilters.source_id === s.id}
                onClick={() => handleSelectFilter('source_id', s.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* SECTION: JENIS SUMBER */}
        <FilterSection 
          title="Jenis Sumber" 
          isOpen={openSections.sourceType} 
          onToggle={() => toggleSection('sourceType')}
        >
          <div className="space-y-1 mt-1">
            <FilterItem 
              label="Semua Jenis" 
              isActive={currentFilters.source_type_id === null} 
              onClick={() => handleSelectFilter('source_type_id', null)} 
            />
            {sourceTypes.map(st => (
              <FilterItem 
                key={st.id}
                label={st.name}
                count={getSourceTypeCount(st.id)}
                isActive={currentFilters.source_type_id === st.id}
                onClick={() => handleSelectFilter('source_type_id', st.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* SECTION: KATEGORI */}
        <FilterSection 
          title="Kategori Dataset" 
          isOpen={openSections.category} 
          onToggle={() => toggleSection('category')}
        >
          <div className="space-y-1 mt-1">
            <FilterItem 
              label="Semua Kategori" 
              isActive={currentFilters.category_id === null} 
              onClick={() => handleSelectFilter('category_id', null)} 
            />
            {categories.map(c => (
              <FilterItem 
                key={c.id}
                label={c.name}
                count={getCategoryCount(c.id)}
                isActive={currentFilters.category_id === c.id}
                onClick={() => handleSelectFilter('category_id', c.id)}
              />
            ))}
          </div>
        </FilterSection>

      </div>

      {/* FOOTER: Tombol Export (Responsive Grid) */}
      <div className="p-4 border-t border-gray-100 space-y-3 bg-white shrink-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Export Dataset</p>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onExport('csv')} 
            className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <DownloadCloud size={16} className="text-gray-400" /> CSV
          </button>
          <button 
            onClick={() => onExport('excel')} 
            className="flex items-center justify-center gap-2 bg-[#0071bc] hover:bg-[#005a96] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <FileSpreadsheet size={16} /> EXCEL
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
}

function FilterSection({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border-b border-gray-50 last:border-0 transition-all">
      <button 
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors group"
      >
        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-[#0071bc]' : 'text-gray-500 group-hover:text-gray-800'}`}>
          {title}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
          <ChevronUp size={16} className={isOpen ? 'text-[#0071bc]' : 'text-gray-400'} />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterItem({ label, count, isActive, onClick }: { label: string, count?: number, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all text-left group ${
        isActive 
        ? 'bg-blue-50 text-[#0071bc] ring-1 ring-blue-100 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
          isActive 
          ? 'bg-[#0071bc] border-[#0071bc] scale-100' 
          : 'border-gray-200 bg-white group-hover:border-gray-300 scale-95'
        }`}>
          {isActive && <Check size={12} className="text-white stroke-[4px]" />}
        </div>
        <span className={`text-xs truncate ${isActive ? 'font-black' : 'font-medium'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-colors ${
          isActive 
          ? 'bg-blue-100 text-[#0071bc]' 
          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}