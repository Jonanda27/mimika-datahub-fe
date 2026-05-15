// src/app/(public)/explorer/page.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Komponen Sidebar Slim (The Anchor) - Layer navigasi utama
import ExplorerSidebar from "@/src/components/layout/ExplorerSidebar";
// Orchestrator untuk Panel Bertumpuk (The Stacking Drawer)
import PanelOrchestrator from "@/src/components/gis/PanelOrchestrator";
import LoadingState from "@/components/ui/LoadingState";
import MapHUD from "@/src/components/gis/MapHUD"; // Pastikan diimport

// Import MapWrapper secara dinamis (Bypass SSR)
const MapWrapper = dynamic(() => import("@/src/components/gis/MapWrapper"), {
    ssr: false,
    loading: () => (
        // Loading state menggunakan identitas warna baru: Papuan Midnight (#0A192F) dan Electric Cyan (#00E5FF)
        <div className="h-full w-full bg-[#0A192F] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(0,229,255,0.5)]"></div>
            <LoadingState message="Memuat Ruang Spasial..." />
        </div>
    ),
});

/**
 * ExplorerPage - The Immersive Command Center
 * Mengadopsi GFW Paradigm (Absolute Map Canvas + Stacking Drawers).
 * Tidak ada lagi navbar tradisional di atas. Semua UI menempel di kiri atau melayang.
 */
export default function ExplorerPage() {
    return (
        // Menggunakan 100dvh untuk responsivitas mobile browser bar yang lebih sempurna
        <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#0A192F] font-sans selection:bg-[#00E5FF] selection:text-[#0A192F]">

            {/* =====================================================================
                LAYER 0: THE INFINITE CANVAS (PETA)
                Memenuhi 100% layar. Semua interaksi scroll halaman dimatikan.
            ====================================================================== */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="h-full w-full bg-[#0A192F]" />}>
                    <MapWrapper isAtlasMode={true} />
                </Suspense>
            </div>

            {/* =====================================================================
                LAYER 1: THE SLIM ANCHOR (SIDEBAR KIRI)
                Identitas Bold (Papuan Midnight) yang menjadi jangkar utama navigasi.
            ====================================================================== */}
            <div className="absolute top-0 bottom-0 left-0 z-50 pointer-events-none">
                <div className="h-full pointer-events-auto">
                    <ExplorerSidebar />
                </div>
            </div>

            {/* =====================================================================
                LAYER 2: THE STACKING DRAWERS (PANEL ANALISIS)
                Panel akan menumpuk bergeser ke kanan, bermula tepat di sebelah sidebar.
                (Sidebar width nanti diasumsikan ~72px-80px, jadi left-[88px] memberi jarak pas).
            ====================================================================== */}
            <div className="absolute top-4 bottom-4 left-[88px] z-40 pointer-events-none">
                <PanelOrchestrator />
            </div>

            {/* =====================================================================
                LAYER 3: MAP HUD & CONTROLS (KANAN BAWAH)
                Custom Zoom, Integritas Data, dan Tooltip Spasial melayang di atas peta.
            ====================================================================== */}
            <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-6 pointer-events-none">

                {/* HUD: MapControls (Zoom) yang akan dibuat dinamis di FASE 4 */}
                <div className="pointer-events-auto flex flex-col gap-2">
                    <button
                        onClick={() => window.dispatchEvent(new Event('map-zoom-in'))}
                        className="w-12 h-12 bg-[#0A192F]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl flex items-center justify-center font-black text-2xl text-white hover:bg-[#00E5FF] hover:text-[#0A192F] transition-all hover:scale-110 active:scale-95">
                        +
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new Event('map-zoom-out'))}
                        className="w-12 h-12 bg-[#0A192F]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl flex items-center justify-center font-black text-2xl text-white hover:bg-[#00E5FF] hover:text-[#0A192F] transition-all hover:scale-110 active:scale-95">
                        -
                    </button>
                </div>

            </div>

        </main>
    );
}