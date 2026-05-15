// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, GeoJSON, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { gisService } from '@/src/app/services/gis.service';
import { DistrictDrilldownResponse } from '@/src/app/types/gis';
import { useExplorerStore } from '@/src/app/store/useExplorerStore';

// Mengimpor mesin warna murni (Pure Fabrication) dari utils agar aman untuk SSR
import { getSemanticColor } from '@/src/app/lib/gisUtils';

import type { LatLngExpression, PathOptions, Layer, Map as LeafletMap } from 'leaflet';

// Static Hash Map O(1) untuk menjembatani GeoJSON (Name) dengan API Backend (ID)
const DISTRICT_MAP: Record<string, number> = {
    "mimikabaru": 1, "kualakencana": 2, "tembagapura": 3, "wania": 4, "iwaka": 5,
    "kwamkinarama": 6, "mimikatimur": 7, "mimikatengah": 8, "mimikabarat": 9,
    "agimuga": 10, "jila": 11, "jita": 12, "mimikatimurjauh": 13, "mimikabaratjauh": 14,
    "mimikabarattengah": 15, "amar": 16, "hoya": 17, "alama": 18
};

// Titik Pusat Default Kabupaten Mimika
const DEFAULT_CENTER: LatLngExpression = [-4.5421, 136.8945];
const DEFAULT_ZOOM = 8;

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

// TUGAS 3: Listener eksternal murni Leaflet Engine (Zero Delay)
function ExternalMapController() {
    const map = useMap();
    useEffect(() => {
        const handleZoomIn = () => map.zoomIn();
        const handleZoomOut = () => map.zoomOut();
        // Menambahkan perintah kembalikan ke pusat peta untuk tombol Reset Peta
        const handleResetView = () => map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });

        window.addEventListener('map-zoom-in', handleZoomIn);
        window.addEventListener('map-zoom-out', handleZoomOut);
        window.addEventListener('map-reset-view', handleResetView);

        return () => {
            window.removeEventListener('map-zoom-in', handleZoomIn);
            window.removeEventListener('map-zoom-out', handleZoomOut);
            window.removeEventListener('map-reset-view', handleResetView);
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
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
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
    // REAKTIVITAS GAYA (STYLING): Pengaturan Warna dan Opacity Poligon
    // ============================================================================
    const districtStyle = (feature: any): PathOptions => {
        const isZoomedIn = zoomLevel >= 14;
        const districtName = feature.properties?.district_name || "";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        // TUGAS 1: BLANK CANVAS (Default State)
        // Logika ini berjalan saat belum ada Indikator Sektoral yang dipilih
        if (!activeIndicator || !indicatorValues || indicatorValues[key] === undefined) {

            // --- IMPLEMENTASI LOGIKA WARNA KHUSUS BASEMAP GELAP ---
            const isDarkMode = activeBaseMap === 'dark';

            return {
                // Jika basemap Dark, gunakan warna putih (opacity 0.05). Jika tidak, gunakan hitam (opacity 0.1)
                fillColor: isDarkMode ? '#ffffff' : '#000000',
                color: isDarkMode ? '#ffffff' : '#000000',     // Garis batas (outline)
                weight: isZoomedIn ? 0 : 1, // Ketebalan outline 1
                fillOpacity: isZoomedIn ? 0 : (isDarkMode ? 0. : 0),
                dashArray: '2' // Batas putus-putus halus
            };
        }

        // TUGAS 2: PANGGIL SEMANTIC CHOROPLETH JIKA ADA INDIKATOR AKTIF
        const choroplethColor = getSemanticColor(indicatorValues[key], maxValue, activeIndicator);
        const opacityRatio = mapOpacity / 100;

        return {
            fillColor: choroplethColor,
            weight: isZoomedIn ? 0 : 1,
            color: activeBaseMap === 'dark' ? '#000000' : '#ffffff', // Garis putih tipis (hitam jika basemap gelap) agar warna choropleth pop-out
            dashArray: undefined, // Garis solid
            fillOpacity: isZoomedIn ? 0 : opacityRatio,
        };
    };

    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        // Tooltip menyesuaikan tema terang benderang
        layer.bindTooltip(
            `<div class="font-sans text-[10px] font-black text-slate-800 uppercase tracking-tighter">Distrik ${districtName}</div>`,
            { sticky: true, direction: 'top', className: 'rounded-lg shadow-lg border border-slate-200 px-3 py-1.5 bg-white' }
        );

        layer.on({
            mouseover: (e: any) => {
                if (zoomLevel < 14) {
                    const target = e.target;

                    if (activeIndicator) {
                        // Highlight untuk mode Analisis (Lebih tebal dan solid)
                        target.setStyle({
                            weight: 2.5,
                            color: '#ffffff',
                            fillOpacity: Math.min((mapOpacity / 100) + 0.15, 1)
                        });
                    } else {
                        // Highlight untuk mode Default / Blank Canvas
                        const isDarkMode = activeBaseMap === 'dark';
                        target.setStyle({
                            weight: 2,
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fillOpacity: isDarkMode ? 0 : 0.15
                        });
                    }
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
                        fillOpacity: originalStyle.fillOpacity,
                        dashArray: originalStyle.dashArray
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
                    openPanel("detil-distrik", `Profil Distrik ${districtName}`, {
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
        return activeBaseMap === 'satellite' ? 22 : 20;
    };

    if (loading) return null;

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
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

    // Helper untuk menghitung opasitas wilayah di luar Mimika (Masking)
    const getMaskingOpacity = () => {
        if (zoomLevel >= 14) return 0;

        if (activeBaseMap === 'dark') {
            return 0.7; // Lebih pekat untuk basemap gelap
        } else if (activeBaseMap === 'street') {
            return 0.4; // Lebih terang untuk basemap roadmap/jalanan
        } else {
            return 0.5; // Sedang untuk basemap satelit
        }
    };

    return (
        <div className={`h-full w-full relative z-10 ${(isAtlasMode || isPreviewMode) ? 'bg-slate-100' : 'bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm'}`}>
            <SafeMapContainer
                key={mapKey}
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                minZoom={7}
                scrollWheelZoom={!isPreviewMode}
                dragging={!isPreviewMode}
                doubleClickZoom={!isPreviewMode}
                zoomControl={false} // MATIKAN ZOOM DEFAULT LEAFLET
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

                {/* Layer 1: Inverted Masking (Gelap Halus agar Area Mimika Menonjol) */}
                {maskingPositions.length > 0 && (
                    <SafePolygon
                        positions={maskingPositions}
                        pathOptions={{
                            fillColor: '#000000',
                            // --- TUNING OPACITY DI LUAR MIMIKA ADA DI SINI ---
                            fillOpacity: getMaskingOpacity(),
                            stroke: false
                        }}
                    />
                )}

                {/* Layer 2: Poligon Batas Distrik (Semantic Choropleth / Blank Canvas) */}
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
                            <h3 className="text-lg font-extrabold text-slate-800 border-b border-gray-200 pb-2 mb-3">
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