// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { gisService } from '@/src/app/services/gis.service';
import { DistrictDrilldownResponse } from '@/src/app/types/gis';
import { useExplorerStore } from '@/src/app/store/useExplorerStore';

import type { LatLngExpression, PathOptions, Layer, Map as LeafletMap } from 'leaflet';

// Static Hash Map O(1) untuk menjembatani GeoJSON (Name) dengan API Backend (ID)
const DISTRICT_MAP: Record<string, number> = {
    "mimikabaru": 1, "kualakencana": 2, "tembagapura": 3, "wania": 4, "iwaka": 5,
    "kwamkinarama": 6, "mimikatimur": 7, "mimikatengah": 8, "mimikabarat": 9,
    "agimuga": 10, "jila": 11, "jita": 12, "mimikatimurjauh": 13, "mimikabaratjauh": 14,
    "mimikabarattengah": 15, "amar": 16, "hoya": 17, "alama": 18
};

interface MimikaMapProps {
    isAtlasMode?: boolean;
}

// ============================================================================
// FASE 4: Event Handler Khusus untuk memantau perubahan Zoom Kamera Peta
// ============================================================================
function MapEventsHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    useMapEvents({
        zoomend: (e) => {
            onZoomChange(e.target.getZoom());
        },
    });
    return null;
}

export default function MimikaMap({ isAtlasMode = false }: MimikaMapProps) {
    // State Spasial & Render Peta
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(8);

    // State Kunci Re-mount (Solusi Map Reuse)
    const [mapKey, setMapKey] = useState(Date.now());

    // Zustand Store Integration (Fase 3 & 4)
    const { openPanel } = useExplorerStore();

    // Local State untuk Pop-up Profil Wilayah (Mode Non-Explorer / Standar)
    const [popupInfo, setPopupInfo] = useState<{ name: string; latlng: any; id: number } | null>(null);
    const [profileData, setProfileData] = useState<DistrictDrilldownResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // State UX untuk interaksi Expandable Text
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    // Membersihkan instansi map sebelum unmount untuk mencegah memory leak
    useEffect(() => {
        return () => {
            setMapKey(Date.now());
        };
    }, []);

    // 1. Fetching Resource Peta (Hanya GeoJSON)
    useEffect(() => {
        const loadMapResources = async () => {
            setLoading(true);
            try {
                const geoRes = await fetch('/mimika_18_distrik.json').then(res => res.json());
                setGeoData(geoRes);
            } catch (error) {
                console.error("Gagal memuat sumber daya peta:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMapResources();
    }, []);

    // 2. Fetching Data Profil saat Poligon di-Klik (Hanya aktif jika bukan mode Explorer)
    useEffect(() => {
        if (!isAtlasMode && popupInfo && popupInfo.id > 0) {
            let isMounted = true;
            setLoadingProfile(true);

            gisService.fetchDistrictDrilldown(popupInfo.id)
                .then(data => {
                    if (isMounted) setProfileData(data);
                })
                .catch(err => console.error("Gagal memuat profil wilayah:", err))
                .finally(() => {
                    if (isMounted) setLoadingProfile(false);
                });

            return () => { isMounted = false; };
        }
    }, [popupInfo, isAtlasMode]);

    // ============================================================================
    // FASE 3: Logika Konstruksi Inverted Polygon Masking
    // ============================================================================
    const maskingPositions = useMemo(() => {
        if (!geoData) return [];

        // 1. Buat Poligon Raksasa seukuran peta dunia (Outer Ring)
        const worldBounds: [number, number][] = [
            [90, -360], [90, 360], [-90, 360], [-90, -360]
        ];

        // 2. Ekstraksi koordinat batas Mimika untuk dijadikan "Lubang" (Inner Rings)
        const holes: [number, number][][] = [];
        geoData.features.forEach((feature: any) => {
            if (feature.geometry.type === 'Polygon') {
                const ring = feature.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]] as [number, number]);
                holes.push(ring);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((poly: any[]) => {
                    const ring = poly[0].map((c: number[]) => [c[1], c[0]] as [number, number]);
                    holes.push(ring);
                });
            }
        });

        return [worldBounds, ...holes];
    }, [geoData]);


    // ============================================================================
    // FASE 3 & 4: Styling Dinamis & Fade Out
    // ============================================================================
    const districtStyle = (): PathOptions => {
        const isZoomedIn = zoomLevel >= 14;
        return {
            // Menggunakan warna primer sistem jika mode Atlas aktif
            fillColor: isAtlasMode ? '#3b82f6' : '#a7f3d0',
            weight: isZoomedIn ? 0 : 1,
            opacity: isZoomedIn ? 0 : 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: isZoomedIn ? 0 : 0.1,
        };
    };

    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        layer.bindTooltip(
            `<div class="font-sans text-[10px] font-black text-slate-800 uppercase tracking-tighter">Distrik ${districtName}</div>`,
            { sticky: true, direction: 'top', className: 'rounded-lg shadow-xl border-none px-3 py-1.5' }
        );

        layer.on({
            mouseover: (e: any) => {
                if (zoomLevel < 14) {
                    const target = e.target;
                    target.setStyle({
                        weight: 1.5,
                        color: isAtlasMode ? '#60a5fa' : '#059669',
                        fillOpacity: 0
                    });
                    target.bringToFront();
                }
            },
            mouseout: (e: any) => {
                if (zoomLevel < 14) {
                    const target = e.target;
                    target.setStyle({ weight: 1, color: 'black', fillOpacity: 0});
                }
            },
            click: (e: any) => {
                const target = e.target;
                const map: LeafletMap = target._map;
                const distId = DISTRICT_MAP[key] || 0;

                // Auto-Focus/Zoom In Terbang mulus ke batas poligon
                map.flyToBounds(target.getBounds(), {
                    padding: [100, 100],
                    duration: 1.5
                });

                if (isAtlasMode) {
                    /** * LOGIKA MODE EXPLORER (GFW Paradigm):
                     * Klik poligon tidak memunculkan popup, melainkan membuka
                     * Floating Panel di sebelah kiri layar.
                     */
                    openPanel("district-detail", `Profil Distrik ${districtName}`, {
                        id: distId,
                        name: districtName
                    });
                } else {
                    /** * LOGIKA MODE STANDAR:
                     * Menampilkan pop-up klasik di dalam kontainer peta.
                     */
                    setProfileData(null);
                    setIsTextExpanded(false);
                    setPopupInfo({
                        name: districtName,
                        latlng: target.getBounds().getCenter(),
                        id: distId
                    });
                }
            }
        });
    };

    if (loading) return null; // Loading state sudah dihandle oleh MapWrapper

    const mapCenter: LatLngExpression = [-4.5421, 136.8945];

    // Bypass Tipe Khusus React 19 / Next.js 15
    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePopup = Popup as any;
    const SafePolygon = Polygon as any;

    // Helper untuk merender isi pop-up (Hanya untuk mode Standar)
    const renderPopupContent = () => {
        if (loadingProfile) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (popupInfo?.id === 0) {
            return <p className="text-xs text-orange-500 py-4 text-center font-medium">Data master wilayah ini belum terdaftar di sistem Bappeda.</p>;
        }

        if (!profileData) {
            return <p className="text-xs text-red-500 py-4 text-center font-medium">Koneksi ke server spasial terputus.</p>;
        }

        const deskripsi = profileData.profile.deskripsi || "Data profil kewilayahan belum tersedia.";
        const isLongText = deskripsi.length > 150;

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-1">
                    <div className={`transition-all duration-300 ${isTextExpanded ? 'max-h-40 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        <p className={`leading-relaxed text-justify ${!isTextExpanded ? 'line-clamp-4' : ''}`}>
                            {deskripsi}
                        </p>
                    </div>

                    {isLongText && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsTextExpanded(!isTextExpanded);
                            }}
                            className="text-[11px] font-bold text-[#0071bc] hover:text-[#005a96] transition-colors mt-1 inline-block"
                        >
                            {isTextExpanded ? "Tutup selengkapnya" : "Baca selengkapnya..."}
                        </button>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                            <span className="block text-[10px] text-emerald-600 font-bold uppercase mb-1">Luas Wilayah</span>
                            <span className="font-extrabold text-gray-800 text-xs">
                                {profileData.profile.luas_wilayah ? `${profileData.profile.luas_wilayah.toLocaleString('id-ID')} km²` : '-'}
                            </span>
                        </div>
                        <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                            <span className="block text-[10px] text-blue-600 font-bold uppercase mb-1">Populasi</span>
                            <span className="font-extrabold text-gray-800 text-xs">
                                {profileData.profile.jumlah_penduduk?.toLocaleString('id-ID') || '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`h-full w-full relative z-10 ${isAtlasMode ? 'bg-slate-950' : 'bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm'}`}>
            <SafeMapContainer
                key={mapKey}
                center={mapCenter}
                zoom={8}
                minZoom={7}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                zoomControl={!isAtlasMode} // Kontrol Zoom disembunyikan jika di mode Explorer (Ganti dengan kustom UI)
                attributionControl={!isAtlasMode}
            >
                <MapEventsHandler onZoomChange={setZoomLevel} />

                <SafeTileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Layer 1: Inverted Masking (Visual Masking Gelap) */}
                {maskingPositions.length > 0 && (
                    <SafePolygon
                        positions={maskingPositions}
                        pathOptions={{
                            fillColor: isAtlasMode ? '#0f172a' : '#1e293b',
                            fillOpacity: zoomLevel >= 14 ? 0 : isAtlasMode ? 0.2 : 0.5,
                            stroke: false
                        }}
                    />
                )}

                {/* Layer 2: Poligon Batas Distrik */}
                {geoData && (
                    <SafeGeoJSON
                        data={geoData}
                        style={districtStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {/* UI Pop-up: Hanya untuk mode Standar (Bukan Explorer) */}
                {!isAtlasMode && popupInfo && (
                    <SafePopup position={popupInfo.latlng} onClose={() => setPopupInfo(null)}>
                        <div className="w-72 p-1 font-sans">
                            <h3 className="text-lg font-extrabold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                                Distrik {popupInfo.name}
                            </h3>
                            {renderPopupContent()}
                        </div>
                    </SafePopup>
                )}
            </SafeMapContainer>
        </div>
    );
}