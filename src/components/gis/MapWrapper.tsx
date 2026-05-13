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
            // Penyesuaian Loader agar selaras dengan widget Dashboard (putih, rounded, shadow)
            <div className="h-full w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
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
 * Berfungsi sebagai pembungkus yang aman untuk SSR dan membentengi Leaflet agar tidak kolaps di dalam CSS Grid.
 */
export default function MapWrapper({ isAtlasMode = false }: MapWrapperProps) {
    return (
        // Pembungkus absolut ini memastikan Peta menuruti aturan Grid dan memiliki radius sudut yang konsisten
        <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white z-0">
            <DynamicMimikaMap isAtlasMode={isAtlasMode} />
        </div>
    );
}