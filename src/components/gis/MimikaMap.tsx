// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, GeoJSON, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
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
    isPreviewMode?: boolean;
}

// ============================================================================
// FASE 4: Event Handler Zoom & External Controller (Indirection Pattern)
// ============================================================================
function MapEventsHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    useMapEvents({
        zoomend: (e) => onZoomChange(e.target.getZoom()),
    });
    return null;
}

// Listener eksternal agar tombol Floating Zoom di luar MapContainer bisa mengendalikan peta
function ExternalMapController() {
    const map = useMap();
    useEffect(() => {
        const handleZoomIn = () => map.zoomIn();
        const handleZoomOut = () => map.zoomOut();

        window.addEventListener('map-zoom-in', handleZoomIn);
        window.addEventListener('map-zoom-out', handleZoomOut);

        return () => {
            window.removeEventListener('map-zoom-in', handleZoomIn);
            window.removeEventListener('map-zoom-out', handleZoomOut);
        };
    }, [map]);
    return null;
}

export default function MimikaMap({ isAtlasMode = false, isPreviewMode = false }: MimikaMapProps) {
    const router = useRouter();

    const {
        openPanel,
        activeIndicator,
        mapOpacity,
        activeBaseMap
    } = useExplorerStore();

    // State Spasial & Render Peta
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(8);
    const [mapKey, setMapKey] = useState(Date.now());

    // Local State untuk Choropleth (Gradasi Warna)
    const [indicatorValues, setIndicatorValues] = useState<Record<string, number> | null>(null);
    const [maxValue, setMaxValue] = useState<number>(100);

    // Local State untuk Pop-up Profil Wilayah (Mode Standar)
    const [popupInfo, setPopupInfo] = useState<{ name: string; latlng: any; id: number } | null>(null);
    const [profileData, setProfileData] = useState<DistrictDrilldownResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    useEffect(() => {
        return () => setMapKey(Date.now());
    }, []);

    // 1. Fetching Resource Peta (GeoJSON)
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

    // 2. Fetching Data Profil (Mode Standar)
    useEffect(() => {
        if (!isAtlasMode && !isPreviewMode && popupInfo && popupInfo.id > 0) {
            let isMounted = true;
            setLoadingProfile(true);

            gisService.fetchDistrictDrilldown(popupInfo.id)
                .then(data => { if (isMounted) setProfileData(data); })
                .catch(err => console.error("Gagal memuat profil wilayah:", err))
                .finally(() => { if (isMounted) setLoadingProfile(false); });

            return () => { isMounted = false; };
        }
    }, [popupInfo, isAtlasMode, isPreviewMode]);

    // 3. Fetching Data Choropleth saat Indicator Berubah
    useEffect(() => {
        let isMounted = true;

        if (activeIndicator) {
            const generateMockData = async () => {
                await new Promise(res => setTimeout(res, 300));
                if (!isMounted) return;

                const mockData: Record<string, number> = {};
                Object.keys(DISTRICT_MAP).forEach(k => {
                    mockData[k] = Math.floor(Math.random() * 90) + 10;
                });

                setIndicatorValues(mockData);
                setMaxValue(100);
            };
            generateMockData();
        } else {
            setIndicatorValues(null);
        }

        return () => { isMounted = false; };
    }, [activeIndicator]);

    // ============================================================================
    // Logika Konstruksi Inverted Polygon Masking
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
    // FASE 5: SEMANTIC CHOROPLETH ENGINE (GFW Paradigm)
    // ============================================================================
    const getColorFromValue = (value: number, max: number, indicatorKey: string): string => {
        const ratio = value / max;
        const key = indicatorKey.toLowerCase();

        // KESEHATAN / SOSIAL: Magenta - Deep Pink (Sangat Berani & Mencolok di atas hijau satelit)
        if (key.includes('stunting') || key.includes('kesehatan') || key.includes('penduduk') || key.includes('miskin')) {
            if (ratio > 0.8) return '#9d174d'; // Pink-800
            if (ratio > 0.6) return '#be185d'; // Pink-700
            if (ratio > 0.4) return '#db2777'; // Pink-600
            if (ratio > 0.2) return '#f43f5e'; // Rose-500
            return '#fda4af';                  // Rose-300
        }
        // EKONOMI: Emerald - Cyan (Representasi Uang, Kemakmuran)
        else if (key.includes('pdrb') || key.includes('ekonomi') || key.includes('uang') || key.includes('dana')) {
            if (ratio > 0.8) return '#064e3b'; // Emerald-900
            if (ratio > 0.6) return '#047857'; // Emerald-700
            if (ratio > 0.4) return '#059669'; // Emerald-600
            if (ratio > 0.2) return '#10b981'; // Emerald-500
            return '#6ee7b7';                  // Emerald-300
        }
        // INFRASTRUKTUR / DEFAULT: Amber - Burnt Orange
        else {
            if (ratio > 0.8) return '#b45309'; // Amber-700
            if (ratio > 0.6) return '#d97706'; // Amber-600
            if (ratio > 0.4) return '#f59e0b'; // Amber-500
            if (ratio > 0.2) return '#fbbf24'; // Amber-400
            return '#fde68a';                  // Amber-200
        }
    };

    const districtStyle = (feature: any): PathOptions => {
        const isZoomedIn = zoomLevel >= 14;
        const districtName = feature.properties?.district_name || "";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        // Default outline color jika tidak ada indikator
        let baseColor = (isAtlasMode || isPreviewMode) ? '#00E5FF' : '#a7f3d0';

        if (activeIndicator && indicatorValues && indicatorValues[key] !== undefined) {
            baseColor = getColorFromValue(indicatorValues[key], maxValue, activeIndicator);
        }

        const opacityRatio = mapOpacity / 100;
        const finalFillOpacity = isZoomedIn ? 0 : opacityRatio;

        return {
            fillColor: baseColor,
            weight: isZoomedIn ? 0 : 0.8,
            color: activeIndicator ? '#ffffff' : baseColor, // Jika pewarnaan aktif, border putih tipis. Jika tidak, border pakai warna neon
            dashArray: activeIndicator ? undefined : '3', // Garis solid untuk choropleth
            fillOpacity: finalFillOpacity,
        };
    };

    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        layer.bindTooltip(
            `<div class="font-sans text-[10px] font-black text-[#0A192F] uppercase tracking-tighter">Distrik ${districtName}</div>`,
            { sticky: true, direction: 'top', className: 'rounded-lg shadow-xl border-none px-3 py-1.5 bg-[#00E5FF]' }
        );

        layer.on({
            mouseover: (e: any) => {
                if (zoomLevel < 14) {
                    const target = e.target;
                    target.setStyle({
                        weight: 2.5,
                        color: '#00E5FF', // Neon border on hover
                        fillOpacity: Math.min((mapOpacity / 100) + 0.3, 1)
                    });
                    target.bringToFront();
                }
            },
            mouseout: (e: any) => {
                if (zoomLevel < 14) {
                    const target = e.target;
                    const originalStyle = districtStyle(feature);
                    target.setStyle({
                        weight: originalStyle.weight,
                        color: originalStyle.color,
                        fillOpacity: originalStyle.fillOpacity
                    });
                }
            },
            click: (e: any) => {
                if (isPreviewMode) {
                    router.push('/explorer');
                    return;
                }

                const target = e.target;
                const map: LeafletMap = target._map;
                const distId = DISTRICT_MAP[key] || 0;

                map.flyToBounds(target.getBounds(), {
                    padding: [100, 100],
                    duration: 1.5
                });

                if (isAtlasMode) {
                    openPanel("district-detail", `Profil Distrik ${districtName}`, {
                        id: distId,
                        name: districtName
                    });
                } else {
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

    // ============================================================================
    // FASE 4: GOOGLE BASEMAP INJECTION
    // ============================================================================
    const getTileLayerUrl = () => {
        switch (activeBaseMap) {
            case 'dark':
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            case 'street':
                return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"; // Google Roadmap
            case 'satellite':
            default:
                return "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"; // Google Satellite High-Res
        }
    };

    const getTileMaxZoom = () => {
        return activeBaseMap === 'satellite' ? 22 : 20; // Satelit google punya zoom sampai 22
    };

    if (loading) return null;

    const mapCenter: LatLngExpression = [-4.5421, 136.8945];

    // Bypass Tipe Khusus React 19 / Next.js 15
    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePopup = Popup as any;
    const SafePolygon = Polygon as any;

    const renderPopupContent = () => {
        if (loadingProfile) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        if (popupInfo?.id === 0) return <p className="text-xs text-orange-500 py-4 text-center font-medium">Data belum terdaftar.</p>;
        if (!profileData) return <p className="text-xs text-red-500 py-4 text-center font-medium">Koneksi terputus.</p>;

        const deskripsi = profileData.profile.deskripsi || "Data profil kewilayahan belum tersedia.";
        const isLongText = deskripsi.length > 150;

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-1">
                    <div className={`transition-all duration-300 ${isTextExpanded ? 'max-h-40 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        <p className={`leading-relaxed text-justify ${!isTextExpanded ? 'line-clamp-4' : ''}`}>{deskripsi}</p>
                    </div>
                    {isLongText && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsTextExpanded(!isTextExpanded); }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors mt-1 inline-block"
                        >
                            {isTextExpanded ? "Tutup selengkapnya" : "Baca selengkapnya..."}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`h-full w-full relative z-10 ${(isAtlasMode || isPreviewMode) ? 'bg-[#0A192F]' : 'bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm'}`}>
            <SafeMapContainer
                key={mapKey}
                center={mapCenter}
                zoom={8}
                minZoom={7}
                scrollWheelZoom={!isPreviewMode}
                dragging={!isPreviewMode}
                doubleClickZoom={!isPreviewMode}
                zoomControl={false} // MATIKAN ZOOM DEFAULT LEAFLET KARENA KITA PAKAI HUD CUSTOM
                attributionControl={!(isAtlasMode || isPreviewMode)}
                className="h-full w-full z-0 outline-none"
            >
                <MapEventsHandler onZoomChange={setZoomLevel} />
                <ExternalMapController />

                {/* Google Basemap Provider */}
                <SafeTileLayer
                    attribution='&copy; Mimika DataHub | Map data &copy; Google'
                    url={getTileLayerUrl()}
                    maxZoom={getTileMaxZoom()}
                />

                {/* Layer 1: Inverted Masking (Warna Papuan Midnight transparan) */}
                {maskingPositions.length > 0 && (
                    <SafePolygon
                        positions={maskingPositions}
                        pathOptions={{
                            fillColor: (isAtlasMode || isPreviewMode) ? '#0A192F' : '#1e293b',
                            fillOpacity: zoomLevel >= 14 ? 0 : (isAtlasMode || isPreviewMode) ? 0.4 : 0.5,
                            stroke: false
                        }}
                    />
                )}

                {/* Layer 2: Poligon Batas Distrik (Semantic Choropleth) */}
                {geoData && (
                    <SafeGeoJSON
                        data={geoData}
                        style={districtStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {!isAtlasMode && !isPreviewMode && popupInfo && (
                    <SafePopup position={popupInfo.latlng} onClose={() => setPopupInfo(null)}>
                        <div className="w-72 p-1 font-sans">
                            <h3 className="text-lg font-extrabold text-[#0A192F] border-b border-gray-200 pb-2 mb-3">
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