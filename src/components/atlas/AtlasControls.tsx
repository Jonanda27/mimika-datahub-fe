// src/components/atlas/AtlasControls.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';
import { DUMMY_ATLAS_DATA } from '@/src/app/lib/dummyAtlasData';
import {
    ChevronDown,
    Activity,
    TrendingUp,
    Droplets,
    Users,
    Map as MapIcon
} from 'lucide-react';

// ============================================================================
// HELPER: Penentuan Ikon Otomatis Berdasarkan Kategori
// ============================================================================
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'kesehatan': return <Activity size={18} />;
        case 'ekonomi': return <TrendingUp size={18} />;
        case 'infrastruktur': return <Droplets size={18} />;
        case 'sosial': return <Users size={18} />;
        default: return <MapIcon size={18} />;
    }
};

export default function AtlasControls() {
    // Koneksi ke Controller Utama (Zustand)
    const { activeIndicator, setActiveIndicator } = useAtlasStore();

    // State lokal khusus untuk mengatur buka/tutup menu dropdown
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ============================================================================
    // UX ENHANCEMENT: Tutup dropdown secara otomatis saat user klik di luar area
    // ============================================================================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Ekstraksi Metadata dari Bank Data Statis untuk dijadikan List Menu
    const availableIndicators = Object.keys(DUMMY_ATLAS_DATA).map(key => ({
        key,
        ...DUMMY_ATLAS_DATA[key].metadata
    }));

    // Mencari detail dari indikator yang saat ini sedang aktif
    const currentSelection = availableIndicators.find(ind => ind.key === activeIndicator) || availableIndicators[0];

    return (
        <div className="relative w-full z-50" ref={dropdownRef}>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                Pilih Indikator Analisis
            </label>

            {/* --- TOMBOL TRIGGER DROPDOWN --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-[#0071bc] px-5 py-4 rounded-2xl shadow-sm transition-all text-left focus:outline-none focus:ring-4 focus:ring-blue-50"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-[#0071bc]">
                        {getCategoryIcon(currentSelection.category)}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#0071bc] uppercase tracking-[0.15em] mb-0.5">
                            {currentSelection.category}
                        </p>
                        <p className="text-base font-black text-[#002244] leading-none">
                            {currentSelection.title}
                        </p>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-slate-50 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-50 text-[#0071bc]' : 'text-gray-400'}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            {/* --- MENU LIST DROPDOWN --- */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                        {availableIndicators.map((ind) => {
                            const isActive = activeIndicator === ind.key;

                            return (
                                <button
                                    key={ind.key}
                                    onClick={() => {
                                        setActiveIndicator(ind.key);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-start gap-4 px-4 py-3 rounded-xl transition-colors text-left group
                                        ${isActive ? 'bg-[#0071bc]/5' : 'hover:bg-slate-50'}
                                    `}
                                >
                                    <div className={`p-2.5 rounded-xl mt-0.5 transition-colors ${isActive ? 'bg-[#0071bc] text-white shadow-md' : 'bg-slate-100 text-gray-500 group-hover:bg-slate-200'}`}>
                                        {getCategoryIcon(ind.category)}
                                    </div>
                                    <div className="grow">
                                        <p className={`text-sm font-black mb-1 ${isActive ? 'text-[#0071bc]' : 'text-[#002244]'}`}>
                                            {ind.title}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium pr-4">
                                            {ind.description}
                                        </p>
                                    </div>

                                    {/* Indikator Checklist Aktif */}
                                    {isActive && (
                                        <div className="w-2 h-2 rounded-full bg-[#0071bc] mt-2 shadow-[0_0_8px_rgba(0,113,188,0.5)]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}