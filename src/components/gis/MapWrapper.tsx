// src/components/gis/MapWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Mendefinisikan kontrak props agar TypeScript mengenali isAtlasMode
interface MapWrapperProps {
    isAtlasMode?: boolean;
}

/**
 * Import dinamis dari MimikaMap.
 * Mematikan Server-Side Rendering (ssr: false) karena Leaflet berinteraksi langsung dengan Window/DOM.
 */
const DynamicMimikaMap = dynamic(
    () => import('./MimikaMap'),
    {
        ssr: false,
        loading: () => (
            // Menggunakan h-full agar mengisi penuh kontainer parent-nya, baik di Dashboard maupun di Atlas
            <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-3xl border border-gray-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#0071bc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                        Menyiapkan Engine Pemetaan...
                    </p>
                </div>
            </div>
        )
    }
);

/**
 * MapWrapper Component
 * Berfungsi sebagai pembungkus yang aman untuk SSR dan meneruskan props spesifik ke komponen Leaflet.
 */
export default function MapWrapper({ isAtlasMode = false }: MapWrapperProps) {
    // Meneruskan props isAtlasMode ke komponen anak (DynamicMimikaMap)
    return <DynamicMimikaMap isAtlasMode={isAtlasMode} />;
}