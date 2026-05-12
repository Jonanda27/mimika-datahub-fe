// src/components/gis/MapWrapper.tsx
"use client";

import dynamic from 'next/dynamic';

/**
 * Wrapper Komponen Peta menggunakan Dynamic Import.
 * Mematikan Server-Side Rendering (ssr: false) karena Leaflet berinteraksi langsung dengan DOM.
 */
const MapWrapper = dynamic(
    () => import('./MimikaMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-112.5 w-full flex items-center justify-center bg-gray-50 rounded-3xl border border-gray-100">
                <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                        Menyiapkan Engine Pemetaan...
                    </p>
                </div>
            </div>
        )
    }
);

export default MapWrapper;