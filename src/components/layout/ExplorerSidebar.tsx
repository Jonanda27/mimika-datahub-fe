// src/components/layout/ExplorerSidebar.tsx
"use client";

import React from "react";
import {
    Layers,
    Database,
    Map as MapIcon,
    BarChart3,
    Info,
    ChevronRight,
    Filter
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

/**
 * ExplorerSidebar - Navigasi Vertikal Modul Explorer
 * Desain: Glassmorphism Ultra-Thin (w-20)
 * Logic: Menghubungkan klik icon dengan openPanel di Zustand Store.
 */
export default function ExplorerSidebar() {
    const { openPanel, activePanels, closePanelsToTheRight } = useExplorerStore();

    // Definisi Menu Navigasi
    const navigationItems = [
        {
            type: "category-selector" as ExplorerPanelType,
            label: "Tema Sektoral",
            icon: Database,
            title: "Kategori Data Sektoral"
        },
        {
            type: "indicator-config" as ExplorerPanelType,
            label: "Indikator Peta",
            icon: Layers,
            title: "Konfigurasi Lapisan Peta"
        },
        {
            type: "search-result" as ExplorerPanelType,
            label: "Hasil Pencarian",
            icon: Filter,
            title: "Pencarian Terpola"
        },
    ];

    // Helper untuk mengecek apakah panel sedang aktif
    const isPanelActive = (type: ExplorerPanelType) => {
        return activePanels.some(p => p.type === type);
    };

    const handleNavClick = (item: typeof navigationItems[0]) => {
        // Jika panel diklik dari sidebar, kita asumsikan ini adalah 'Root' interaksi
        // Maka kita bersihkan panel di sebelah kanan (GFW Logic)
        closePanelsToTheRight(-1);
        openPanel(item.type, item.title);
    };

    return (
        <aside className="w-20 h-full flex flex-col items-center py-6 glass-morphism-dark border-r border-white/10 relative z-50">

            {/* BAGIAN ATAS: Menu Utama */}
            <div className="flex-1 flex flex-col gap-4 w-full px-2">
                {navigationItems.map((item) => {
                    const isActive = isPanelActive(item.type);

                    return (
                        <div key={item.type} className="relative group">
                            <button
                                onClick={() => handleNavClick(item)}
                                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 relative overflow-hidden
                  ${isActive
                                        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity
                  ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                    {item.label.split(" ")[0]}
                                </span>

                                {/* Indikator Aktif (Dot) */}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                                )}
                            </button>

                            {/* Tooltip Label */}
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 -translate-x-2.5 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-2xl border border-white/10">
                                {item.title}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-white/10" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BAGIAN BAWAH: Info & Branding */}
            <div className="flex flex-col gap-4 w-full px-2">
                <button
                    onClick={() => openPanel("search-result", "Informasi Sistem", { section: "about" })}
                    className="w-full aspect-square rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <Info size={20} />
                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl">
                        Tentang DataHub
                    </div>
                </button>

                <div className="w-full h-px bg-white/5 my-2" />

                <div className="w-full flex justify-center pb-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="text-[8px] font-black text-blue-400">M</span>
                    </div>
                </div>
            </div>

        </aside>
    );
}