// src/components/gis/MapWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import LoadingState from '@/components/ui/LoadingState';

interface MapWrapperProps {
    isAtlasMode?: boolean;
}

/**
 * Import dinamis MimikaMap dengan bypass SSR.
 * Loading state disesuaikan dengan tema Immersive (Dark) 
 * agar transisi visual lebih halus pada halaman Explorer.
 */
const DynamicMimikaMap = dynamic(
    () => import('./MimikaMap'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    {/* Menggunakan spinner biru khas Mimika DataHub */}
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                    <p className="text-xs text-blue-400 font-black uppercase tracking-[0.3em] animate-pulse">
                        Inisialisasi Mesin Spasial...
                    </p>
                    <p className="text-[10px] text-white/30 mt-2 font-medium">
                        Menyiapkan data vektor distrik Mimika
                    </p>
                </div>
            </div>
        )
    }
) as any;

/**
 * MapWrapper - Gateway utama mesin pemetaan.
 * Bertindak sebagai kontainer absolut yang mengisi seluruh ruang parent (Base Layer).
 */
export default function MapWrapper({ isAtlasMode = false }: MapWrapperProps) {
    return (
        <div className="w-full h-full relative z-0 overflow-hidden">
            {/* isAtlasMode dikirimkan ke MimikaMap untuk menentukan 
        apakah peta harus menampilkan kontrol default Leaflet atau 
        menggunakan kontrol kustom yang kita buat di Page Explorer.
      */}
            <DynamicMimikaMap isAtlasMode={isAtlasMode} />

            {/* Overlay Vignette: Memberikan efek gelap di pinggiran peta 
          agar UI melayang di atasnya terlihat lebih kontras (Best Practice UX) 
      */}
            {isAtlasMode && (
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] z-1" />
            )}
        </div>
    );
}