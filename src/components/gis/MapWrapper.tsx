// src/components/gis/MapWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

interface MapWrapperProps {
    isAtlasMode?: boolean;
}

/**
 * Import dinamis MimikaMap dengan bypass SSR.
 * Dibuat sebagai 'any' untuk sementara guna menghindari mismatch type pada dynamic import Next.js
 */
const DynamicMimikaMap = dynamic(
    () => import('./MimikaMap'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#0071bc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                        Menyiapkan Geospasial...
                    </p>
                </div>
            </div>
        )
    }
) as any;

export default function MapWrapper({ isAtlasMode = false }: MapWrapperProps) {
    return (
        // Menggunakan h-full w-full agar peta memenuhi container h-[75vh] di page.tsx
        <div className="w-full h-full relative z-0">
            <DynamicMimikaMap isAtlasMode={isAtlasMode} />
        </div>
    );
}