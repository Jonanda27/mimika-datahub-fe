// src/components/layout/ExplorerSidebar.tsx
"use client";

import React from "react";
import {
    Search,
    Layers,
    Database,
    Info,
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

/**
 * ExplorerSidebar - The Slim Anchor (Light Mode)
 * Desain: Ultra-Thin Ribbon dengan identitas warna Clean White & Corporate Teal.
 * Responsif: Menempel di kiri (Desktop) dan di bawah (Mobile).
 */
export default function ExplorerSidebar() {
    const { openPanel, activePanels, closePanelsToTheRight } = useExplorerStore();

    // Definisi Menu Navigasi (Command Center)
    const navigationItems = [
        {
            type: "hasil-pencarian" as ExplorerPanelType,
            label: "Cari",
            icon: Search,
            title: "Pencarian Spasial Global"
        },
        {
            type: "seleksi-kategori" as ExplorerPanelType,
            label: "Sektor",
            icon: Database,
            title: "Katalog Data Sektoral"
        },
        {
            type: "konfigurasi" as ExplorerPanelType,
            label: "Layers",
            icon: Layers,
            title: "Konfigurasi Lapisan Peta"
        }
    ];

    // Helper untuk mengecek apakah panel sedang aktif
    const isPanelActive = (type: ExplorerPanelType) => {
        return activePanels.some(p => p.type === type);
    };

    const handleNavClick = (item: typeof navigationItems[0]) => {
        if (item.type) {
            // Karena ini adalah "Root Menu", klik di sini akan mereset panel anak
            // dan hanya membuka panel utama yang dipilih (GFW Paradigm)
            closePanelsToTheRight(-1);
            openPanel(item.type, item.title);
        }
    };

    return (
        // Memperbaiki w-[88px] menjadi w-22 sesuai anjuran canonical Tailwind
        <aside className="fixed bottom-0 left-0 w-full h-16 md:static md:w-22 md:h-full flex flex-row md:flex-col items-center md:py-6 bg-white/95 backdrop-blur-xl border-t md:border-t-0 md:border-r border-slate-200 z-50 transition-all shadow-sm">

            {/* BAGIAN UTAMA: Menu Navigasi */}
            <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center gap-1 md:gap-5 w-full px-2 md:px-4">
                {navigationItems.map((item, index) => {
                    const isActive = item.type ? isPanelActive(item.type) : false;

                    return (
                        <div key={index} className="relative group w-full md:w-auto flex justify-center">
                            <button
                                onClick={() => handleNavClick(item)}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 relative overflow-hidden active:scale-95
                                    ${isActive
                                        ? "bg-teal-600 text-white shadow-[0_0_15px_rgba(13,148,136,0.3)]"
                                        : "text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                                    }`}
                            >
                                <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />

                                {/* Label teks (hanya muncul di desktop saat di-hover atau aktif) */}
                                <span className={`hidden md:block text-[9px] font-black uppercase tracking-widest transition-opacity
                                    ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                    {item.label}
                                </span>

                                {/* Indikator Titik Aktif (Mobile) */}
                                {isActive && (
                                    <div className="md:hidden absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </button>

                            {/* Tooltip Label (Desktop Only) */}
                            <div className="hidden md:block absolute top-1/2 left-full -translate-y-1/2 ml-4 px-3 py-2 bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-lg z-50">
                                {item.title}
                                {/* Panah Tooltip */}
                                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-800 rotate-45 rounded-sm" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BAGIAN BAWAH: Info & Branding (Sembunyi di Mobile untuk menghemat ruang) */}
            <div className="hidden md:flex flex-col items-center gap-5 w-full px-4">
                <div className="w-8 h-px bg-slate-200" />

                <div className="relative group w-full flex justify-center">
                    <button
                        onClick={() => {
                            // Reset seluruh tumpukan panel dan buka panel 'Tentang'
                            closePanelsToTheRight(-1);
                            openPanel("tentang", "Tentang Mimika DataHub");
                        }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-all active:scale-95"
                    >
                        <Info size={20} />
                    </button>
                    {/* Tooltip Info */}
                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-lg z-50">
                        Tentang DataHub
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-800 rotate-45 rounded-sm" />
                    </div>
                </div>
            </div>

        </aside>
    );
}