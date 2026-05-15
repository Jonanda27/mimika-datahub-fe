// src/app/(public)/explorer/page.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Komponen Navigasi Global (Atas) & Sidebar Slim (Kiri)
import ExplorerNavbar from "@/src/components/layout/ExplorerNavbar";
import ExplorerSidebar from "@/src/components/layout/ExplorerSidebar";

// Orchestrator untuk Panel Bertumpuk & HUD Peta
import PanelOrchestrator from "@/src/components/gis/PanelOrchestrator";
import MapHUD from "@/src/components/gis/MapHUD";
import LoadingState from "@/components/ui/LoadingState";

// Import MapWrapper secara dinamis (Bypass SSR)
const MapWrapper = dynamic(() => import("@/src/components/gis/MapWrapper"), {
    ssr: false,
    loading: () => (
        // Loading state diubah ke tema TERANG BENDERANG yang bersih dan elegan
        <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 shadow-md"></div>
            <LoadingState message="Memuat Kanvas Spasial..." />
        </div>
    ),
});

/**
 * ExplorerPage - The Immersive Command Center (Light & Clean Theme)
 * Mengadopsi GFW Paradigm secara presisi:
 * 1. Navbar di atas sebagai Global Context.
 * 2. Sidebar di kiri sebagai alat navigasi spasial.
 * 3. Peta mendominasi 100% ruang yang tersisa.
 */
export default function ExplorerPage() {
    return (
        // Latar belakang diatur ke terang (slate-50) dengan warna seleksi teks biru
        <main className="relative h-[100dvh] w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900">

            {/* =====================================================================
                LAYER 0: THE INFINITE CANVAS (PETA)
                Berada di dasar (z-0), memenuhi 100% layar.
            ====================================================================== */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="h-full w-full bg-slate-50" />}>
                    <MapWrapper isAtlasMode={true} />
                </Suspense>
            </div>

            {/* =====================================================================
                LAYER 1: THE GLOBAL CONTEXT (NAVBAR ATAS)
                Posisi absolut di atas, mengambil tinggi 64px (h-16).
            ====================================================================== */}
            <div className="absolute top-0 left-0 right-0 h-16 z-50 pointer-events-auto">
                <ExplorerNavbar />
            </div>

            {/* =====================================================================
                LAYER 2: THE SLIM ANCHOR (SIDEBAR KIRI)
                Dimulai persis di bawah Navbar (top-[64px] atau top-16).
            ====================================================================== */}
            <div className="absolute top-16 bottom-0 left-0 z-40 pointer-events-none">
                <div className="h-full pointer-events-auto">
                    <ExplorerSidebar />
                </div>
            </div>

            {/* =====================================================================
                LAYER 3: THE STACKING DRAWERS (PANEL ANALISIS)
                Panel akan menumpuk bergeser ke kanan.
                Diberikan margin atas (top-20) agar tidak menempel keras ke Navbar.
                Berada di sebelah kanan Sidebar (left-[88px]).
            ====================================================================== */}
            <div className="absolute top-20 bottom-4 left-[88px] z-30 pointer-events-none">
                <PanelOrchestrator />
            </div>

            {/* =====================================================================
                LAYER 4: MAP HUD & CONTROLS (KANAN BAWAH)
                Komponen MapHUD memegang fungsi Zoom dan Kesiapan Data.
            ====================================================================== */}
            <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
                <MapHUD />
            </div>

        </main>
    );
}