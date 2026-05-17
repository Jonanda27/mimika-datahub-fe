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
 * ExplorerSidebar - The Slim Anchor (Docking Point)
 * Tempat laci kontrol utama (activeDrawer) melekat.
 */
export default function ExplorerSidebar() {
    // Mengekstrak activeDrawer alih-alih activePanels array
    const { openPanel, activeDrawer, closePanelsToTheRight } = useExplorerStore();

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

    // Logika evaluasi panel aktif disederhanakan
    const isPanelActive = (type: ExplorerPanelType) => {
        return activeDrawer?.type === type;
    };

    const handleNavClick = (item: typeof navigationItems[0]) => {
        if (item.type) {
            // Karena tidak ada lagi tumpukan bertingkat, kita cukup mengirimkan perintah openPanel.
            // Logika Store akan mendeteksi klik ganda (toggle-to-close).
            openPanel(item.type, item.title);
        }
    };

    return (
        <aside className="fixed bottom-0 left-0 w-full h-16 md:static md:w-16 md:h-full flex flex-row md:flex-col items-center bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50 transition-all">

            {/* BAGIAN UTAMA: Menu Navigasi */}
            <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center w-full">
                {navigationItems.map((item, index) => {
                    const isActive = item.type ? isPanelActive(item.type) : false;

                    return (
                        <div key={index} className="relative group w-full flex justify-center">
                            <button
                                onClick={() => handleNavClick(item)}
                                className={`w-full h-16 flex flex-col items-center justify-center gap-1 transition-colors relative active:bg-slate-100 rounded-none
                                    ${isActive
                                        ? "bg-teal-50 text-teal-700 md:border-l-[3px] border-b-[3px] md:border-b-0 border-teal-700"
                                        : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-[3px] border-transparent"
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />

                                <span className={`text-[9px] font-bold uppercase tracking-widest
                                    ${isActive ? "opacity-100" : "opacity-70"}`}>
                                    {item.label}
                                </span>
                            </button>

                            {/* Tooltip Label (Desktop Only - Sharp Edges) */}
                            <div className="hidden md:block absolute top-1/2 left-full -translate-y-1/2 ml-2 px-3 py-2 bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.title}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-none" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BAGIAN BAWAH: Info & Branding */}
            <div className="hidden md:flex flex-col items-center w-full mt-auto">
                <div className="w-8 h-px bg-slate-200 mb-2" />

                <div className="relative group w-full flex justify-center">
                    <button
                        onClick={() => openPanel("tentang", "Tentang Mimika DataHub")}
                        className={`w-full h-16 flex items-center justify-center transition-colors active:bg-slate-100 rounded-none border-l-[3px]
                            ${isPanelActive("tentang")
                                ? "bg-teal-50 text-teal-700 border-teal-700"
                                : "text-slate-400 hover:text-slate-800 hover:bg-slate-50 border-transparent"
                            }`}
                    >
                        <Info size={20} strokeWidth={isPanelActive("tentang") ? 2.5 : 2} />
                    </button>
                    {/* Tooltip Info - Sharp Edges */}
                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Tentang DataHub
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-none" />
                    </div>
                </div>
            </div>

        </aside>
    );
}