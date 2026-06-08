// src/components/gis/AssetMarkers.tsx
"use client";

import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { ArrowRight } from "lucide-react"; // [REFACTOR] Icon tambahan untuk tombol
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

// Import dipindahkan ke domain spesifik (mockAssets)
import { MOCK_ASSET_DATA } from "@/src/app/lib/mocks/mockAssets";
import { ASSET_TAXONOMY_CONFIG } from "@/src/app/lib/assetConfig";

// ============================================================================
// PURE FABRICATION: GENERATOR IKON KUSTOM DINAMIS
// ============================================================================

// A. Ikon untuk Titik Individual (Menggunakan Icon URL & Color dari Config)
const createCustomPin = (iconUrl: string, color: string) => {
    // Desain pin kustom: Lingkaran berwarna dengan icon SVG di tengahnya, plus segitiga kecil di bawah
    return L.divIcon({
        className: "custom-pin-icon bg-transparent border-none",
        html: `
            <div style="display: flex; flex-direction: column; items-center; filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.3)); transform: translate(-50%, -100%); width: 32px; align-items: center;">
                <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; z-index: 2;">
                    <img src="${iconUrl}" style="width: 14px; height: 14px; filter: brightness(0) invert(1);" alt="icon" onerror="this.style.display='none'" />
                </div>
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; margin-top: -2px; z-index: 1;"></div>
            </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [0, 0], // Di-handle oleh CSS transform di atas agar presisi di titik koordinat
        popupAnchor: [0, -40], // Popup muncul tepat di atas pin
    });
};

// B. Ikon untuk Klaster (Saat di-zoom out) - Mempertahankan desain elegan aslimu
const createClusterCustomIcon = function (cluster: any) {
    const count = cluster.getChildCount();

    // Ukuran klaster dinamis berdasarkan jumlah titik
    let size = 'w-10 h-10';
    if (count < 10) size = 'w-8 h-8';
    if (count > 20) size = 'w-12 h-12';

    return L.divIcon({
        html: `<div class="${size} bg-slate-800 text-white flex items-center justify-center rounded-full border-[3px] border-white shadow-md font-bold text-[12px] ring-2 ring-slate-800/30">
                ${count}
               </div>`,
        className: 'custom-cluster-icon bg-transparent',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================
export default function AssetMarkers() {
    // 1. Tarik state multi-selection array dan fungsi openPanel dari Store yang baru
    const { activeAssetLayers, openPanel } = useExplorerStore();

    // 2. Mesin Filtering O(n) dengan Memoization
    const visibleMarkers = useMemo(() => {
        // Jika tidak ada sakelar yang nyala sama sekali, return array kosong
        if (!activeAssetLayers || activeAssetLayers.length === 0) return [];

        const markers: any[] = [];

        // Buat Hash Map dari config untuk pencarian super cepat O(1)
        const configMap = new Map<string, any>();
        ASSET_TAXONOMY_CONFIG.forEach(opd => {
            opd.categories.forEach(cat => {
                configMap.set(`${opd.opdKey}::${cat.type}`, cat);
            });
        });

        // Iterasi seluruh mock data dan saring yang status layernya nyala
        Object.keys(MOCK_ASSET_DATA).forEach(opdKey => {
            const assets = MOCK_ASSET_DATA[opdKey];

            assets.forEach(asset => {
                const layerId = `${opdKey}::${asset.type}`;

                // Cek apakah jenis aset spesifik ini sedang diaktifkan user
                if (activeAssetLayers.includes(layerId)) {
                    const config = configMap.get(layerId);
                    if (config) {
                        markers.push({
                            ...asset,
                            config // Tempelkan config (warna & icon) ke data aset
                        });
                    }
                }
            });
        });

        return markers;
    }, [activeAssetLayers]);

    // Jika hasil filter kosong (Layer Mati), render null agar tidak membebani DOM
    if (visibleMarkers.length === 0) {
        return null;
    }

    return (
        <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            showCoverageOnHover={false}
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
        >
            {visibleMarkers.map((marker, index) => (
                <Marker
                    key={`${marker.id}-${index}`}
                    position={[marker.lat, marker.lng]}
                    // Panggil factory icon dengan data spesifik dari config
                    icon={createCustomPin(marker.config.iconUrl, marker.config.color)}
                >
                    {/* Mempertahankan Tooltip Info High-Density milikmu */}
                    <Popup className="asset-popup">
                        <div className="flex flex-col p-0.5 w-50">

                            <span
                                className="text-[9px] font-bold uppercase tracking-widest mb-1 border-b border-slate-200 pb-1"
                                style={{ color: marker.config.color }} // Warna judul ngikutin warna OPD
                            >
                                {marker.type}
                            </span>

                            <h4 className="text-[12px] font-bold text-slate-800 leading-tight mb-1.5">
                                {marker.name}
                            </h4>

                            <div className="flex flex-col gap-0.5 bg-slate-50 p-1.5 rounded-xs border border-slate-100 mb-2">
                                <span className="text-[10px] text-slate-500">Koordinat:</span>
                                <span className="text-[10px] font-medium text-slate-700 font-mono">
                                    {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                                </span>
                            </div>

                            {/* [REFACTOR] FASE 1: Tombol Trigger Panel Detail Aset */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Memicu perubahan state di Zustand untuk membuka panel detail aset
                                    openPanel("detil-aset", marker.name, marker);
                                }}
                                className="w-full flex items-center justify-between px-2 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors rounded-none group"
                            >
                                <span className="text-[9px] font-bold text-slate-600 group-hover:text-teal-700 uppercase tracking-widest">
                                    Analisis Detail
                                </span>
                                <ArrowRight size={12} className="text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                            </button>

                        </div>
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
}