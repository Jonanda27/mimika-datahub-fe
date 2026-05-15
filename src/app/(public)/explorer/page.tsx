// src/app/(public)/explorer/page.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Import Komponen UI Melayang (Floating UI)
// Catatan: Komponen ini akan dibuat di fase berikutnya, saat ini kita siapkan strukturnya.
import ExplorerNavbar from "@/src/components/layout/ExplorerNavbar";
import ExplorerSidebar from "@/src/components/layout/ExplorerSidebar";
import PanelOrchestrator from "@/src/components/gis/PanelOrchestrator";
import LoadingState from "@/components/ui/LoadingState";

// Import MapWrapper secara dinamis untuk menghindari mismatch SSR
const MapWrapper = dynamic(() => import("@/src/components/gis/MapWrapper"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-900 flex items-center justify-center">
            <LoadingState message="Menyiapkan Kanvas Geospasial..." />
        </div>
    ),
});

/**
 * ExplorerPage - The Immersive Shell
 * * Menggunakan prinsip "Map-as-Canvas". Seluruh viewport (100vw/100vh) adalah peta.
 * Komponen UI diletakkan di atas peta menggunakan layering Z-Index.
 */
export default function ExplorerPage() {
    return (
        <main className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans">

            {/* LAYER 0: MAP CANVAS (The Base) */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="h-full w-full bg-slate-900" />}>
                    {/* Prop isAtlasMode diaktifkan agar MapWrapper tahu 
             ia harus merender peta dalam mode full-page tanpa margin.
          */}
                    <MapWrapper isAtlasMode={true} />
                </Suspense>
            </div>

            {/* LAYER 1: NAVIGATION OVERLAY (Navbar & Sidebar) */}
            {/* Z-Index diletakkan tinggi (z-50) agar selalu di atas panel data */}
            <div className="pointer-events-none absolute inset-0 z-50 flex flex-col">
                {/* Navbar: Menggunakan glassmorphism agar peta tetap "tembus" */}
                <div className="pointer-events-auto">
                    <ExplorerNavbar />
                </div>

                <div className="flex-1 flex items-stretch">
                    {/* Sidebar: Navigasi vertikal tipis di sisi kiri */}
                    <div className="pointer-events-auto shrink-0">
                        <ExplorerSidebar />
                    </div>

                    {/* Spacer untuk membiarkan peta terlihat di tengah */}
                    <div className="flex-1" />
                </div>
            </div>

            {/* LAYER 2: SHIFTING PANELS (The Orchestrator) */}
            {/* Z-Index 40: Diletakkan di bawah Navbar tapi di atas Peta.
         Komponen ini akan menangani logika panel yang bergeser ke kanan 
         berdasarkan interaksi user (klik sidebar atau klik poligon).
      */}
            <div className="absolute top-20 bottom-8 left-20 z-40 pointer-events-none">
                <PanelOrchestrator />
            </div>

            {/* LAYER 3: MAP CONTROLS (Right-side Actions) */}
            {/* Lokasi untuk tombol Zoom, Reset Center, Layer Toggle, dll */}
            <div className="absolute bottom-10 right-8 z-30 flex flex-col gap-3">
                {/* Komponen MapControls akan diimplementasikan di fase berikutnya */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur shadow-xl rounded-xl flex items-center justify-center font-bold text-slate-800 hover:bg-white transition-all">
                        +
                    </button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur shadow-xl rounded-xl flex items-center justify-center font-bold text-slate-800 hover:bg-white transition-all">
                        -
                    </button>
                </div>
            </div>

            {/* LAYER 4: BRANDING FOOTER (Bottom Left) */}
            <div className="absolute bottom-6 left-20 z-20 pointer-events-none">
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <p className="text-[9px] text-white/60 font-medium uppercase tracking-[0.2em]">
                        Mimika DataHub Explorer &copy; 2026
                    </p>
                </div>
            </div>

        </main>
    );
}