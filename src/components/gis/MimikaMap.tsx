// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { gisService } from '@/src/app/services/gis.service';
import { useAtlasStore } from '@/src/app/store/useAtlasStore';
import { DistrictDrilldownResponse } from '@/src/app/types/gis';

import type { LatLngExpression, PathOptions, Layer, Map as LeafletMap } from 'leaflet';

// Static Hash Map O(1) untuk menjembatani GeoJSON (Name) dengan API Backend (ID)
const DISTRICT_MAP: Record<string, number> = {
    "mimikabaru": 1, "kualakencana": 2, "tembagapura": 3, "wania": 4, "iwaka": 5,
    "kwamkinarama": 6, "mimikatimur": 7, "mimikatengah": 8, "mimikabarat": 9,
    "agimuga": 10, "jila": 11, "jita": 12, "mimikatimurjauh": 13, "mimikabaratjauh": 14,
    "mimikabarattengah": 15, "amar": 16, "hoya": 17, "alama": 18
};

// ============================================================================
// LOGIKA PEWARNAAN CHOROPLETH (ATLAS MODE)
// ============================================================================
const getColor = (value: number | undefined, scheme: string | undefined) => {
    if (value === undefined) return '#f3f4f6'; // Abu-abu jika tidak ada data

    // Skema Warna Dinamis berdasarkan Metadata Backend
    const colors: Record<string, string[]> = {
        "Reds": ["#fee2e2", "#fca5a5", "#ef4444", "#dc2626", "#991b1b"],
        "Blues": ["#dbeafe", "#93c5fd", "#3b82f6", "#2563eb", "#1e3a8a"],
        "Greens": ["#dcfce7", "#86efac", "#22c55e", "#16a34a", "#14532d"],
        "Default": ["#f1f5f9", "#cbd5e1", "#64748b", "#334155", "#0f172a"]
    };

    const selectedScheme = colors[scheme || "Default"] || colors["Default"];

    // Logika penentuan intensitas (Threshold sederhana)
    // Di lingkungan produksi, threshold ini idealnya dihitung berdasarkan min/max dataset dinamis
    if (value > 40) return selectedScheme[4];
    if (value > 30) return selectedScheme[3];
    if (value > 20) return selectedScheme[2];
    if (value > 10) return selectedScheme[1];
    return selectedScheme[0];
};

// ============================================================================
// EVENT HANDLER: ZOOM MONITOR
// ============================================================================
function MapEventsHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    useMapEvents({
        zoomend: (e) => {
            onZoomChange(e.target.getZoom());
        },
    });
    return null;
}

interface MimikaMapProps {
    isAtlasMode?: boolean;
}

export default function MimikaMap({ isAtlasMode = false }: MimikaMapProps) {
    // State Spasial & Render Peta
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(8);

    // State Kunci Re-mount (Solusi Map Reuse)
    const [mapKey, setMapKey] = useState(Date.now());

    // Local State untuk Pop-up Profil Wilayah
    const [popupInfo, setPopupInfo] = useState<{ name: string; latlng: any; id: number } | null>(null);
    const [profileData, setProfileData] = useState<DistrictDrilldownResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    // INTEGRASI STORE: Mengambil data atlas jika mode atlas aktif
    const { spatialData, metadata, activeIndicator } = useAtlasStore();

    // Membersihkan instansi map sebelum unmount
    useEffect(() => {
        return () => { setMapKey(Date.now()); };
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

    // 2. Fetching Data Profil saat Poligon di-Klik
    useEffect(() => {
        if (popupInfo && popupInfo.id > 0) {
            let isMounted = true;
            setLoadingProfile(true);
            gisService.fetchDistrictDrilldown(popupInfo.id)
                .then(data => { if (isMounted) setProfileData(data); })
                .catch(err => console.error("Gagal memuat profil wilayah:", err))
                .finally(() => { if (isMounted) setLoadingProfile(false); });
            return () => { isMounted = false; };
        }
    }, [popupInfo]);

    // ============================================================================
    // FASE 3: Logika Konstruksi Inverted Polygon Masking
    // ============================================================================
    const maskingPositions = useMemo(() => {
        if (!geoData) return [];
        const worldBounds: [number, number][] = [[90, -360], [90, 360], [-90, 360], [-90, -360]];
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
    // STYLING: Dinamis Standar vs Atlas (Protected Variation)
    // ============================================================================
    const districtStyle = (feature: any): PathOptions => {
        const districtName = feature.properties?.district_name || "";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        const atlasValue = spatialData ? spatialData[key] : undefined;
        const isZoomedIn = zoomLevel >= 14;

        return {
            fillColor: isAtlasMode ? getColor(atlasValue, metadata?.color_scheme) : '#a7f3d0',
            weight: isZoomedIn ? 0 : 1.5,
            opacity: isZoomedIn ? 0 : 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: isZoomedIn ? 0 : 0.8,
        };
    };

    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');
        const atlasValue = spatialData ? spatialData[key] : undefined;

        // Tooltip adaptif berdasarkan mode peta
        const tooltipContent = isAtlasMode && atlasValue !== undefined
            ? `<div class="font-sans text-xs flex flex-col items-center">
                 <span class="font-bold text-gray-400 uppercase text-[9px] mb-1">${metadata?.title || 'Data Atlas'}</span>
                 <span class="text-lg font-black text-[#002244]">${atlasValue} <small class="text-[10px]">${metadata?.unit || ''}</small></span>
                 <span class="mt-1 pt-1 border-t border-gray-100 text-gray-500 font-bold tracking-tighter">Distrik ${districtName}</span>
               </div>`
            : `<div class="font-sans text-xs font-bold text-gray-700">Distrik ${districtName}</div>`;

        layer.bindTooltip(tooltipContent, {
            sticky: true,
            direction: 'top',
            className: isAtlasMode
                ? 'rounded-xl shadow-2xl border-none px-4 py-2 bg-white/95 backdrop-blur-md'
                : 'rounded-md shadow-sm border-none px-2 py-1'
        });

        layer.on({
            mouseover: (e: any) => {
                if (zoomLevel < 14) {
                    e.target.setStyle({ weight: 3, color: isAtlasMode ? '#1e293b' : '#059669', fillOpacity: 1 });
                    e.target.bringToFront();
                }
            },
            mouseout: (e: any) => {
                if (zoomLevel < 14) {
                    e.target.setStyle(districtStyle(feature));
                }
            },
            click: (e: any) => {
                const target = e.target;
                target._map.flyToBounds(target.getBounds(), { padding: [50, 50], duration: 1.2 });
                setProfileData(null);
                setIsTextExpanded(false);
                setPopupInfo({
                    name: districtName,
                    latlng: target.getBounds().getCenter(),
                    id: DISTRICT_MAP[key] || 0
                });
            }
        });
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-white rounded-3xl border border-gray-100 animate-pulse">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Sinkronisasi Spasial...</p>
                </div>
            </div>
        );
    }

    const mapCenter: LatLngExpression = [-4.5421, 136.8945];
    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePopup = Popup as any;
    const SafePolygon = Polygon as any;

    const renderPopupContent = () => {
        if (loadingProfile) return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
        if (popupInfo?.id === 0) return <p className="text-xs text-orange-500 py-4 text-center font-medium">Data master wilayah ini belum terdaftar di sistem Bappeda.</p>;
        if (!profileData) return <p className="text-xs text-red-500 py-4 text-center font-medium">Koneksi ke server spasial terputus.</p>;

        const deskripsi = profileData.profile.deskripsi || "Data profil kewilayahan belum tersedia.";
        const isLongText = deskripsi.length > 150;

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-1">
                    <div className={`transition-all duration-300 ${isTextExpanded ? 'max-h-40 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        <p className={`leading-relaxed text-justify ${!isTextExpanded ? 'line-clamp-4' : ''}`}>{deskripsi}</p>
                    </div>
                    {isLongText && (
                        <button onClick={(e) => { e.stopPropagation(); setIsTextExpanded(!isTextExpanded); }} className="text-[11px] font-bold text-[#0071bc] mt-1 hover:underline">
                            {isTextExpanded ? "Tutup selengkapnya" : "Baca selengkapnya..."}
                        </button>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-center">
                            <span className="block text-[10px] text-emerald-600 font-bold uppercase mb-1">Luas Wilayah</span>
                            <span className="font-extrabold text-gray-800 text-xs">{profileData.profile.luas_wilayah ? `${profileData.profile.luas_wilayah.toLocaleString('id-ID')} km²` : '-'}</span>
                        </div>
                        <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-center">
                            <span className="block text-[10px] text-blue-600 font-bold uppercase mb-1">Populasi</span>
                            <span className="font-extrabold text-gray-800 text-xs">{profileData.profile.jumlah_penduduk?.toLocaleString('id-ID') || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full overflow-hidden relative z-10 bg-gray-50">
            <SafeMapContainer key={mapKey} center={mapCenter} zoom={8} scrollWheelZoom={false} className="h-full w-full z-0">
                <MapEventsHandler onZoomChange={setZoomLevel} />

                <SafeTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {maskingPositions.length > 0 && (
                    <SafePolygon
                        positions={maskingPositions}
                        pathOptions={{
                            fillColor: '#1e293b',
                            fillOpacity: zoomLevel >= 14 ? 0 : 0.5,
                            stroke: false
                        }}
                    />
                )}

                {geoData && (
                    <SafeGeoJSON
                        key={`${isAtlasMode}-${activeIndicator}`} // Injeksi reaktivitas untuk memaksa rendering ulang Leaflet saat indikator berubah
                        data={geoData}
                        style={districtStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {popupInfo && (
                    <SafePopup position={popupInfo.latlng} onClose={() => setPopupInfo(null)}>
                        <div className="w-72 p-1 font-sans">
                            <h3 className="text-lg font-extrabold text-gray-800 border-b border-gray-200 pb-2 mb-3">Distrik {popupInfo.name}</h3>
                            {renderPopupContent()}
                        </div>
                    </SafePopup>
                )}
            </SafeMapContainer>
        </div>
    );
}