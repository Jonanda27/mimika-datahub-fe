// src/components/layout/ExplorerSidebar.tsx
"use client";

import React from "react";
import {
    Search,
    Layers,
    Database,
    Info,
    Building2, // Icon tambahan yang lebih representatif untuk OPD
} from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { ExplorerPanelType } from "@/src/app/types/gis";

/**
 * ExplorerSidebar - The Slim Anchor (Frameless Edition)
 * Desain: Ultra-Thin Ribbon dengan lebar w-16, menempel di tepi viewport.
 * Interaksi visual menggunakan border penanda alih-alih shadow atau rounded background.
 */
export default function ExplorerSidebar() {
    const { openPanel, activePanels, closePanelsToTheRight } = useExplorerStore();

    const navigationItems = [
        {
            type: "hasil-pencarian" as ExplorerPanelType,
            label: "Cari",
            icon: Search,
            title: "Pencarian Spasial Global"
        },
        {
            // [UBAH] Transisi dari 'seleksi-kategori' ke 'seleksi-opd'
            type: "seleksi-opd" as ExplorerPanelType,
            label: "Instansi", // Mengubah label agar lebih OPD-Centric
            icon: Building2,   // Menggunakan icon Building2 agar lebih terkesan Institusional
            title: "Katalog Data Instansi / OPD"
        },
        {
            type: "konfigurasi" as ExplorerPanelType,
            label: "Layers",
            icon: Layers,
            title: "Konfigurasi Lapisan Peta"
        }
    ];

    const isPanelActive = (type: ExplorerPanelType) => {
        return activePanels.some(p => p.type === type);
    };

    const handleNavClick = (item: typeof navigationItems[0]) => {
        if (item.type) {
            closePanelsToTheRight(-1);
            openPanel(item.type, item.title);
        }
    };

    return (
        <aside className="fixed bottom-0 left-0 w-full h-16 md:static md:w-16 md:h-full flex flex-row md:flex-col items-center bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50 transition-all">

            {/* BAGIAN UTAMA: Menu Navigasi */}
            <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center w-full mt-0 md:mt-4 gap-2">
                {navigationItems.map((item, index) => {
                    const isActive = item.type ? isPanelActive(item.type) : false;

                    return (
                        <div key={index} className="relative group w-full flex justify-center">
                            <button
                                onClick={() => handleNavClick(item)}
                                className={`w-full h-16 flex flex-col items-center justify-center gap-1 transition-colors relative active:bg-slate-100 rounded-none
                                    ${isActive
                                        ? "bg-teal-50 text-teal-700 md:border-l-[3px] border-b-[3px] md:border-b-0 border-teal-600"
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
                                {/* Panah Tooltip yang lebih tajam */}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-none" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BAGIAN BAWAH: Info & Branding */}
            <div className="hidden md:flex flex-col items-center w-full mt-auto mb-4">
                <div className="w-8 h-px bg-slate-200 mb-2" />

                <div className="relative group w-full flex justify-center">
                    <button
                        onClick={() => {
                            closePanelsToTheRight(-1);
                            openPanel("tentang", "Tentang Mimika DataHub");
                        }}
                        className="w-full h-16 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors active:bg-slate-100 rounded-none border-l-[3px] border-transparent"
                    >
                        <Info size={20} />
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