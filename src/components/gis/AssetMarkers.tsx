// src/components/gis/AssetMarkers.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { ArrowRight } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";
import { assetService } from "@/src/app/services/asset.service";

// ============================================================================
// PURE FABRICATION: GENERATOR IKON KUSTOM DINAMIS (BE-Driven)
// ============================================================================

// Ikon untuk Titik Individual (Menggunakan Icon URL & Color dinamis dari Backend)
const createCustomPin = (iconUrl: string, color: string) => {
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
        iconAnchor: [0, 0],
        popupAnchor: [0, -40],
    });
};

// Ikon untuk Klaster Spasial
const createClusterCustomIcon = function (cluster: any) {
    const count = cluster.getChildCount();

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
    const { activeAssetLayers, openPanel } = useExplorerStore();
    const [dbAssets, setDbAssets] = useState<Record<string, any[]>>({});

    // Memuat data aset aktif murni dari REST API Backend
    useEffect(() => {
        let isMounted = true;

        assetService.getPublicAssets()
            .then(data => {
                if (isMounted) setDbAssets(data || {});
            })
            .catch(err => {
                console.error("Gagal memuat koordinat aset spasial dari server:", err);
            });

        return () => { isMounted = false; };
    }, []);

    // Filter data koordinat O(M) berbasis taksonomi dinamis
    const visibleMarkers = useMemo(() => {
        if (!activeAssetLayers || activeAssetLayers.length === 0) return [];
        if (Object.keys(dbAssets).length === 0) return [];

        const markers: any[] = [];

        Object.keys(dbAssets).forEach(opdKey => {
            const assets = dbAssets[opdKey] || [];

            assets.forEach(asset => {
                const layerId = `${opdKey}::${asset.type}`;

                // Jika layer terpilih aktif pada Explorer Sidebar, muat koordinatnya
                if (activeAssetLayers.includes(layerId)) {
                    markers.push(asset);
                }
            });
        });

        return markers;
    }, [activeAssetLayers, dbAssets]);

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
            {visibleMarkers.map((marker, index) => {
                // Gunakan konfigurasi warna & ikon dari database / backend secara langsung
                const markerColor = marker.config?.color || "#0071bc";
                const markerIconUrl = marker.config?.iconUrl || "/icons/markers/office.svg";

                return (
                    <Marker
                        key={`${marker.id}-${index}`}
                        position={[marker.lat, marker.lng]}
                        icon={createCustomPin(markerIconUrl, markerColor)}
                    >
                        <Popup className="asset-popup">
                            <div className="flex flex-col p-0.5 w-50">

                                <span
                                    className="text-[9px] font-bold uppercase tracking-widest mb-1 border-b border-slate-200 pb-1"
                                    style={{ color: markerColor }}
                                >
                                    {marker.type}
                                </span>

                                <h4 className="text-[12px] font-bold text-slate-800 leading-tight mb-1.5">
                                    {marker.name}
                                </h4>

                                <div className="flex flex-col gap-0.5 bg-slate-50 p-1.5 rounded-xs border border-slate-100 mb-2">
                                    <span className="text-[10px] text-slate-500 font-medium">Koordinat:</span>
                                    <span className="text-[10px] font-medium text-slate-700 font-mono">
                                        {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
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
                );
            })}
        </MarkerClusterGroup>
    );
}