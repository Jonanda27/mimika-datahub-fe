// src/components/layout/ExplorerSidebar.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    Search,
    Layers,
    Database,
    Info,
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

/**
 * ExplorerSidebar - The Slim Anchor (FASE 2)
 * Desain: Ultra-Thin Ribbon dengan identitas warna Papuan Midnight & Neon Cyan.
 * Responsif: Menempel di kiri (Desktop) dan di bawah (Mobile).
 */
export default function ExplorerSidebar() {
    const router = useRouter();
    const { openPanel, activePanels, closePanelsToTheRight } = useExplorerStore();

    // Definisi Menu Navigasi (Command Center)
    const navigationItems = [
        {
            action: "link",
            path: "/",
            label: "Home",
            icon: Home,
            title: "Kembali ke Beranda"
        },
        {
            action: "panel",
            type: "search-result" as ExplorerPanelType,
            label: "Cari",
            icon: Search,
            title: "Pencarian Spasial Global"
        },
        {
            action: "panel",
            type: "category-selector" as ExplorerPanelType,
            label: "Sektor",
            icon: Database,
            title: "Katalog Data Sektoral"
        },
        {
            action: "panel",
            type: "indicator-config" as ExplorerPanelType,
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
        if (item.action === "link" && item.path) {
            router.push(item.path);
        } else if (item.type) {
            // Karena ini adalah "Root Menu", klik di sini akan mereset panel anak
            // dan hanya membuka panel utama yang dipilih (GFW Paradigm)
            closePanelsToTheRight(-1);
            openPanel(item.type, item.title);
        }
    };

    return (
        <aside className="fixed bottom-0 left-0 w-full h-16 md:static md:w-[88px] md:h-full flex flex-row md:flex-col items-center md:py-6 bg-[#0A192F]/95 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 z-50 transition-all">

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
                                        ? "bg-[#00E5FF] text-[#0A192F] shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                                        : "text-white/40 hover:text-white hover:bg-white/10"
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
                                    <div className="md:hidden absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#0A192F]" />
                                )}
                            </button>

                            {/* Tooltip Label (Desktop Only) */}
                            <div className="hidden md:block absolute top-1/2 left-full -translate-y-1/2 ml-4 px-3 py-2 bg-[#00E5FF] text-[#0A192F] text-[11px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-[0_0_20px_rgba(0,229,255,0.3)] z-50">
                                {item.title}
                                {/* Panah Tooltip */}
                                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#00E5FF] rotate-45 rounded-sm" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BAGIAN BAWAH: Info & Branding (Sembunyi di Mobile untuk menghemat ruang) */}
            <div className="hidden md:flex flex-col items-center gap-5 w-full px-4">
                <div className="w-8 h-px bg-white/10" />

                <div className="relative group w-full flex justify-center">
                    <button
                        onClick={() => {
                            closePanelsToTheRight(-1);
                            openPanel("search-result", "Informasi Sistem", { section: "about" });
                        }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Info size={20} />
                    </button>
                    {/* Tooltip Info */}
                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl border border-white/10 z-50">
                        Tentang DataHub
                    </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-blue-600 p-[2px] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
                        <span className="text-[12px] font-black text-[#00E5FF]">M</span>
                    </div>
                </div>
            </div>

        </aside>
    );
}