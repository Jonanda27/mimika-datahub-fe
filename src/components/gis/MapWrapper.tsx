// src/components/gis/MapWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import LoadingState from '@/components/ui/LoadingState';

interface MapWrapperProps {
    isAtlasMode?: boolean;
    isPreviewMode?: boolean; // Penambahan parameter untuk skenario Landing Page
}

/**
 * Import dinamis MimikaMap dengan bypass SSR.
 * Loading state disesuaikan dengan tema "Papuan Midnight & Neon" 
 * agar transisi visual lebih halus pada halaman Explorer dan Dashboard.
 */
const DynamicMimikaMap = dynamic(
    () => import('./MimikaMap'),
    {
        ssr: false,
        loading: () => (
            // RESOLUSI: Menggunakan w-full h-full agar mengisi penuh parent (seperti instruksi rekan Anda),
            // tetapi mempertahankan warna gelap agar teks putih & neon spinner tetap terbaca.
            <div className="w-full h-full flex items-center justify-center bg-[#0A192F]">
                <div className="text-center">
                    {/* Menggunakan spinner Electric Cyan khas identitas baru */}
                    <div className="w-12 h-12 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_20px_rgba(0,229,255,0.5)]"></div>
                    <p className="text-xs text-[#00E5FF] font-black uppercase tracking-[0.3em] animate-pulse">
                        Inisialisasi Mesin Spasial...
                    </p>
                    <p className="text-[10px] text-white/40 mt-2 font-medium">
                        Menyiapkan kanvas geospasial Mimika
                    </p>
                </div>
            </div>
        )
    }
) as any;

/**
 * MapWrapper - Gateway utama mesin pemetaan.
 * Bertindak sebagai kontainer absolut yang mengisi seluruh ruang parent (Base Layer).
 * Menerapkan pola Indirection untuk mendistribusikan konfigurasi ke mesin utama.
 */
export default function MapWrapper({ isAtlasMode = false, isPreviewMode = false }: MapWrapperProps) {
    return (
        // Memastikan lebar dan tinggi 100% mengikuti parent (Infinite Canvas).
        // Background diset ke Papuan Midnight agar saat tile belum termuat, layarnya tidak berkedip putih.
        <div className={`w-full h-full relative z-0 overflow-hidden ${isAtlasMode ? 'bg-[#0A192F]' : 'bg-gray-50'}`}>

            {/* isAtlasMode dan isPreviewMode dikirimkan ke MimikaMap untuk menentukan 
                apakah peta harus merespons interaksi penuh atau hanya sekadar tampilan statis (Teaser).
            */}
            <DynamicMimikaMap
                isAtlasMode={isAtlasMode}
                isPreviewMode={isPreviewMode}
            />

            {/* Overlay Vignette: Memberikan efek gelap di pinggiran peta 
                agar UI (Sidebar & HUD) yang melayang di atasnya terlihat lebih kontras (Best Practice UX).
                Vignette disesuaikan dengan warna Midnight Blue agar blend dengan peta satelit/gelap.
            */}
            {isAtlasMode && !isPreviewMode && (
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(10,25,47,0.9)] z-10" />
            )}
        </div>
    );
}