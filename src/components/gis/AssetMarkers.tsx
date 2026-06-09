// src/components/gis/AssetMarkers.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
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

                // [REFACTOR FASE 4.1] Adaptor Gambar Dinamis
                const primaryImage = (marker.images && marker.images.length > 0)
                    ? marker.images[0]
                    : (marker.image_url || null);

                const hasMultipleImages = marker.images && marker.images.length > 1;

                // [REFACTOR FASE 4.1] Mengambil Dynamic Metadata JSON details
                const details = marker.details || {};
                const hasDetails = Object.keys(details).length > 0;

                return (
                    <Marker
                        key={`${marker.id}-${index}`}
                        position={[marker.lat, marker.lng]}
                        icon={createCustomPin(markerIconUrl, markerColor)}
                        // [UX ENHANCEMENT] Klik langsung membuka drawer detail aset secara halus
                        eventHandlers={{
                            click: (e) => {
                                e.originalEvent.stopPropagation();
                                openPanel("detil-aset", marker.name, marker);
                            }
                        }}
                    >
                        {/* 
                            [NEW - PILAR 3] PORTAL RICH HOVER TOOLTIP ASET
                            Mengabaikan box padding bawaan Leaflet demi menghadirkan kartu visual frameless.
                        */}
                        <Tooltip
                            direction="top"
                            offset={[0, -25]}
                            opacity={1}
                            sticky={true}
                            className="p-0! border-none! bg-transparent! shadow-none! rounded-none!"
                        >
                            <div className="w-64 bg-white border border-slate-200 shadow-2xl p-0 overflow-hidden flex flex-col font-sans text-slate-800 rounded-none">

                                {/* Micro-Thumbnail Image Header */}
                                {primaryImage && (
                                    <div className="relative w-full h-24 shrink-0 bg-slate-100">
                                        <img
                                            src={primaryImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                        {/* Indikator sisa foto di dalam slider galeri */}
                                        {hasMultipleImages && (
                                            <div className="absolute bottom-1.5 right-1.5 bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-black uppercase text-white border border-white/20 tracking-wider">
                                                +{marker.images.length - 1} Foto
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-3.5 flex flex-col gap-2">
                                    {/* Identitas Aset */}
                                    <div className="flex flex-col">
                                        <span
                                            className="text-[9px] font-black uppercase tracking-widest leading-none mb-1"
                                            style={{ color: markerColor }}
                                        >
                                            {marker.type || "Aset Daerah"}
                                        </span>
                                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                            {marker.name}
                                        </h4>
                                    </div>

                                    {/* Dynamic Metadata (JSON details) - Maksimal 3 Baris agar Tooltip tetap ramping [10] */}
                                    {hasDetails ? (
                                        <div className="flex flex-col gap-1 text-[10px] font-medium border-t border-slate-100 pt-2 text-slate-500">
                                            {Object.entries(details).slice(0, 3).map(([key, value], idx) => (
                                                <div key={idx} className="flex justify-between items-center gap-2">
                                                    <span className="uppercase tracking-wider text-[8px] font-black text-slate-400 truncate max-w-22.5">
                                                        {key}:
                                                    </span>
                                                    <span className="text-slate-700 truncate max-w-32.5 font-bold">
                                                        {value as React.ReactNode}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[9px] font-bold text-slate-400 italic border-t border-slate-100 pt-2 text-center tracking-wide">
                                            Belum ada spesifikasi khusus
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                );
            })}
        </MarkerClusterGroup>
    );
}