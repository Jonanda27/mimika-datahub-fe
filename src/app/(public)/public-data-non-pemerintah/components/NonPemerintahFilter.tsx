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

interface NonPemerintahFilterProps {
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

export default function NonPemerintahFilter({ 
  sources,
  sourceTypes,
  categories,
  sidebarStats,
  currentFilters,
  onFilterChange,
  onSearch, 
  onReset, 
  onExport 
}: NonPemerintahFilterProps) {
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    source: true,
    sourceType: true,
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
    <div className="bg-white border border-gray-200 rounded-sm w-full font-sans text-black shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Filters</h2>
        <button 
          onClick={onReset} 
          className="text-xs font-bold text-[#0071bc] flex items-center gap-1.5 hover:text-[#005a96] transition-colors"
        >
          <RotateCcw size={14} /> CLEAR ALL
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
        
        {/* PENCARIAN */}
        <FilterSection title="Pencarian" isOpen={openSections.search} onToggle={() => toggleSection('search')}>
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Cari dataset..." 
              onChange={(e) => onSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0071bc] focus:ring-1 focus:ring-[#0071bc] transition-all bg-white text-black"
            />
            <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </FilterSection>

        {/* SUMBER DATA */}
        <FilterSection title="Sumber Data" isOpen={openSections.source} onToggle={() => toggleSection('source')}>
          <div className="space-y-1 mt-2">
            <FilterItem label="Semua Sumber" isActive={currentFilters.source_id === null} onClick={() => handleSelectFilter('source_id', null)} />
            {sources.map(s => (
              <FilterItem key={s.id} label={s.name} count={getSourceCount(s.id)} isActive={currentFilters.source_id === s.id} onClick={() => handleSelectFilter('source_id', s.id)} />
            ))}
          </div>
        </FilterSection>

        {/* JENIS LEMBAGA (Source Type) */}
        <FilterSection title="Jenis Lembaga" isOpen={openSections.sourceType} onToggle={() => toggleSection('sourceType')}>
          <div className="space-y-1 mt-2">
            <FilterItem label="Semua Jenis" isActive={currentFilters.source_type_id === null} onClick={() => handleSelectFilter('source_type_id', null)} />
            {sourceTypes.map(st => (
              <FilterItem key={st.id} label={st.name} count={getSourceTypeCount(st.id)} isActive={currentFilters.source_type_id === st.id} onClick={() => handleSelectFilter('source_type_id', st.id)} />
            ))}
          </div>
        </FilterSection>

        {/* KATEGORI */}
        <FilterSection title="Kategori" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
          <div className="space-y-1 mt-2">
            <FilterItem label="Semua Kategori" isActive={currentFilters.category_id === null} onClick={() => handleSelectFilter('category_id', null)} />
            {categories.map(c => (
              <FilterItem key={c.id} label={c.name} count={getCategoryCount(c.id)} isActive={currentFilters.category_id === c.id} onClick={() => handleSelectFilter('category_id', c.id)} />
            ))}
          </div>
        </FilterSection>

        {/* TAHUN */}
        <FilterSection title="Tahun Data" isOpen={openSections.year} onToggle={() => toggleSection('year')}>
          <div className="space-y-1 mt-2">
            <FilterItem label="Semua Tahun" isActive={currentFilters.year === null} onClick={() => handleSelectFilter('year', null)} />
            {sidebarStats?.years.map(y => (
              <FilterItem key={y.id} label={y.name} count={y.count} isActive={currentFilters.year === y.id} onClick={() => handleSelectFilter('year', y.id)} />
            ))}
          </div>
        </FilterSection>

      </div>

      <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Export Dataset</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onExport('csv')} className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 rounded text-xs font-bold transition-all active:scale-95 shadow-sm">
            <DownloadCloud size={14} /> CSV
          </button>
          <button onClick={() => onExport('excel')} className="flex items-center justify-center gap-2 bg-[#0071bc] hover:bg-[#005a96] text-white py-2 rounded text-xs font-bold transition-all shadow-sm active:scale-95">
            <FileSpreadsheet size={14} /> EXCEL
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function FilterSection({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors group">
        <span className={`text-xs font-bold uppercase tracking-wider ${isOpen ? 'text-[#0071bc]' : 'text-gray-600 group-hover:text-gray-900'}`}>{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-[#0071bc]" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
}

function FilterItem({ label, count, isActive, onClick }: { label: string, count?: number, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md transition-all text-left ${isActive ? 'bg-blue-50 text-[#0071bc] font-bold border-l-2 border-[#0071bc]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-2 border-transparent'}`}>
      <div className="flex items-center gap-2 overflow-hidden">
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-[#0071bc] border-[#0071bc]' : 'border-gray-300 bg-white'}`}>{isActive && <Check size={10} className="text-white" />}</div>
        <span className="text-sm truncate">{label}</span>
      </div>
      {count !== undefined && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isActive ? 'bg-blue-100 text-[#0071bc]' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
    </button>
  );
}