// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, GeoJSON, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { gisService } from '@/src/app/services/gis.service';
import { DistrictDrilldownResponse } from '@/src/app/types/gis';
import { useExplorerStore } from '@/src/app/store/useExplorerStore';
import AssetMarkers from "./AssetMarkers";

import { getSemanticColor } from '@/src/app/lib/gisUtils';

import type { LatLngExpression, PathOptions, Layer, Map as LeafletMap } from 'leaflet';

const DISTRICT_MAP: Record<string, number> = {
    "mimikabaru": 1, "kualakencana": 2, "tembagapura": 3, "wania": 4, "iwaka": 5,
    "kwamkinarama": 6, "mimikatimur": 7, "mimikatengah": 8, "mimikabarat": 9,
    "agimuga": 10, "jila": 11, "jita": 12, "mimikatimurjauh": 13, "mimikabaratjauh": 14,
    "mimikabarattengah": 15, "amar": 16, "hoya": 17, "alama": 18
};

const DEFAULT_CENTER: LatLngExpression = [-4.5421, 136.8945];
const DEFAULT_ZOOM = 8;

interface MimikaMapProps {
    isAtlasMode?: boolean;
    isPreviewMode?: boolean;
}

// ============================================================================
// PURE FABRICATION: Kalkulator Gaya Poligon (Shared Logic)
// ============================================================================
function calculateLayerStyle(
    districtName: string,
    state: any,
    indicatorValues: Record<string, number> | null,
    maxValue: number,
    zoomLevel: number
): PathOptions {
    const key = districtName.toLowerCase().replace(/\s/g, '');
    const isFocused = state.focusedDistrict && state.focusedDistrict.toLowerCase() === districtName.toLowerCase();

    let weight = zoomLevel >= 14 ? 0 : 1;
    let color = state.activeBaseMap === 'dark' ? '#ffffff' : '#000000';
    let dashArray: string | undefined = '2';
    let fillOpacity = zoomLevel >= 14 ? 0 : (state.activeBaseMap === 'dark' ? 0.1 : 0);
    let fillColor = state.activeBaseMap === 'dark' ? '#ffffff' : '#000000';

    if (state.activeIndicator && indicatorValues && indicatorValues[key] !== undefined) {
        fillColor = getSemanticColor(indicatorValues[key], maxValue, state.activeIndicator);
        fillOpacity = zoomLevel >= 14 ? 0 : (state.mapOpacity / 100);
        color = state.activeBaseMap === 'dark' ? '#000000' : '#ffffff';
        dashArray = undefined;
    }

    if (isFocused) {
        weight = 3;
        color = '#14b8a6';
        dashArray = undefined;
        if (!state.activeIndicator) {
            fillColor = '#14b8a6';
            fillOpacity = 0.3;
        } else {
            fillOpacity = Math.min((state.mapOpacity / 100) + 0.3, 1);
        }
    } else if (state.focusedDistrict) {
        fillOpacity = 0.05;
        color = state.activeBaseMap === 'dark' ? '#334155' : '#cbd5e1';
        weight = 1;
    }

    return { fillColor, color, weight, fillOpacity, dashArray };
}

function MapEventsHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    useMapEvents({ zoomend: (e) => onZoomChange(e.target.getZoom()) });
    return null;
}

function ExternalMapController() {
    const map = useMap();
    useEffect(() => {
        const handleZoomIn = () => map.zoomIn();
        const handleZoomOut = () => map.zoomOut();
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

// ============================================================================
// CONTROLLER: Cinematic Spotlight & Imperative GeoJSON Updater
// Terbagi menjadi dua entitas terpisah untuk mencegah Infinite Loop
// ============================================================================
function CinematicSpotlightController({ geoData, geoJsonRef, indicatorValues, maxValue, zoomLevel }: any) {
    const map = useMap();

    // [FIX 1] Ekstraksi Primitif Murni: Menghindari error "getSnapshot should be cached"
    const focusedDistrict = useExplorerStore((state) => state.focusedDistrict);
    const activeIndicator = useExplorerStore((state) => state.activeIndicator);
    const mapOpacity = useExplorerStore((state) => state.mapOpacity);
    const activeBaseMap = useExplorerStore((state) => state.activeBaseMap);

    // EFEK A: Mengurus murni STYLING (Warna, Garis Tepi, Opacity)
    useEffect(() => {
        if (!geoJsonRef.current || !geoData) return;

        const stateSnapshot = { focusedDistrict, activeIndicator, mapOpacity, activeBaseMap };
        const layers = geoJsonRef.current.getLayers();

        layers.forEach((layer: any) => {
            const districtName = layer.feature.properties?.district_name || "";
            const isFocused = focusedDistrict && focusedDistrict.toLowerCase() === districtName.toLowerCase();

            const newStyle = calculateLayerStyle(districtName, stateSnapshot, indicatorValues, maxValue, zoomLevel);
            layer.setStyle(newStyle);

            if (isFocused) {
                layer.bringToFront();
            }
        });

    }, [focusedDistrict, activeIndicator, mapOpacity, activeBaseMap, zoomLevel, geoData, indicatorValues, maxValue, geoJsonRef]);

    // EFEK B: Mengurus murni KAMERA (Zoom/FlyTo)
    // [FIX 2] Ketergantungan (Dependencies) Dibatasi secara ekstrim HANYA pada focusedDistrict.
    // Menghilangkan zoomLevel dari array dependency agar tidak memicu infinite loop.
    useEffect(() => {
        if (!geoJsonRef.current || !geoData) return;

        if (focusedDistrict) {
            const layers = geoJsonRef.current.getLayers();
            const targetLayer = layers.find((layer: any) => {
                const districtName = layer.feature.properties?.district_name || "";
                return districtName.toLowerCase() === focusedDistrict.toLowerCase();
            });

            if (targetLayer) {
                map.flyToBounds(targetLayer.getBounds(), {
                    paddingTopLeft: [380, 20],
                    paddingBottomRight: [20, 20],
                    duration: 1.5
                });
            }
        } else {
            map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
        }
    }, [focusedDistrict, geoData, geoJsonRef, map]); // <--- KUNCI ANTI INFINITE LOOP

    return null;
}

export default function MimikaMap({ isAtlasMode = false, isPreviewMode = false }: MimikaMapProps) {
    const router = useRouter();

    const { openPanel, setFocusDistrict } = useExplorerStore();

    const geoJsonRef = useRef<L.GeoJSON>(null);

    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
    const [mapKey, setMapKey] = useState(Date.now());

    const [indicatorValues, setIndicatorValues] = useState<Record<string, number> | null>(null);
    const [maxValue, setMaxValue] = useState<number>(100);

    const indicatorValuesRef = useRef(indicatorValues);
    const maxValueRef = useRef(maxValue);

    useEffect(() => { indicatorValuesRef.current = indicatorValues; }, [indicatorValues]);
    useEffect(() => { maxValueRef.current = maxValue; }, [maxValue]);

    const [popupInfo, setPopupInfo] = useState<{ name: string; latlng: any; id: number } | null>(null);
    const [profileData, setProfileData] = useState<DistrictDrilldownResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    useEffect(() => { return () => setMapKey(Date.now()); }, []);

    useEffect(() => {
        const loadMapResources = async () => {
            setLoading(true);
            try {
                const geoRes = await fetch('/mimika_18_distrik.json').then(res => res.json());
                setGeoData(geoRes);
            } catch (error) {
                console.error("Gagal memuat sumber daya peta:", error);
            } finally { setLoading(false); }
        };
        loadMapResources();
    }, []);

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

    useEffect(() => {
        let isMounted = true;
        if (useExplorerStore.getState().activeIndicator) {
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
    }, [useExplorerStore.getState().activeIndicator]);

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

    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        layer.bindTooltip(
            `<div class="font-sans text-[10px] font-black text-slate-800 uppercase tracking-tighter">Distrik ${districtName}</div>`,
            { sticky: true, direction: 'top', className: 'rounded-none shadow-none border border-slate-300 px-3 py-1.5 bg-white' }
        );

        layer.on({
            mouseover: (e: any) => {
                const state = useExplorerStore.getState();
                const target = e.target;
                const currentZoom = target._map.getZoom();
                if (currentZoom >= 14) return;

                const isFocused = state.focusedDistrict && state.focusedDistrict.toLowerCase() === districtName.toLowerCase();

                if (isFocused) return;

                if (state.focusedDistrict) {
                    target.setStyle({ fillOpacity: 0.15, color: '#94a3b8', weight: 2 });
                    return;
                }

                if (state.activeIndicator) {
                    target.setStyle({ weight: 2.5, color: '#ffffff', fillOpacity: Math.min((state.mapOpacity / 100) + 0.15, 1) });
                } else {
                    const isDarkMode = state.activeBaseMap === 'dark';
                    target.setStyle({ weight: 2, color: isDarkMode ? '#ffffff' : '#000000', fillOpacity: isDarkMode ? 0 : 0.15 });
                }
                target.bringToFront();
            },
            mouseout: (e: any) => {
                const state = useExplorerStore.getState();
                const target = e.target;
                const currentZoom = target._map.getZoom();

                const originalStyle = calculateLayerStyle(
                    districtName,
                    {
                        focusedDistrict: state.focusedDistrict,
                        activeIndicator: state.activeIndicator,
                        mapOpacity: state.mapOpacity,
                        activeBaseMap: state.activeBaseMap
                    },
                    indicatorValuesRef.current,
                    maxValueRef.current,
                    currentZoom
                );
                target.setStyle(originalStyle);
            },
            click: (e: any) => {
                if (isPreviewMode) {
                    router.push('/explorer');
                    return;
                }

                const distId = DISTRICT_MAP[key] || 0;

                setFocusDistrict(districtName);

                if (isAtlasMode) {
                    openPanel("detil-distrik", `Profil Distrik ${districtName}`, {
                        id: distId,
                        name: districtName
                    });
                } else {
                    setProfileData(null);
                    setIsTextExpanded(false);
                    setPopupInfo({ name: districtName, latlng: e.target.getBounds().getCenter(), id: distId });
                }
            }
        });
    };

    const getTileLayerUrl = () => {
        const baseMapId = useExplorerStore.getState().activeBaseMap;
        switch (baseMapId) {
            case 'dark': return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            case 'street': return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
            case 'esri': return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'osm': return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            case 'satellite': default: return "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
        }
    };

    const getTileMaxZoom = () => useExplorerStore.getState().activeBaseMap === 'satellite' ? 22 : 20;

    if (loading) return null;

    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePopup = Popup as any;
    const SafePolygon = Polygon as any;

    const renderPopupContent = () => {
        if (loadingProfile) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-none animate-spin"></div>
                </div>
            );
        }
        if (popupInfo?.id === 0) return <p className="text-xs text-slate-500 py-4 text-center font-bold uppercase tracking-widest">Data belum terdaftar.</p>;
        if (!profileData) return <p className="text-xs text-rose-600 py-4 text-center font-bold uppercase tracking-widest">Koneksi terputus.</p>;

        const deskripsi = profileData.profile.deskripsi || "Data profil kewilayahan belum tersedia.";
        const isLongText = deskripsi.length > 150;

        return (
            <div className="space-y-4">
                <div className="text-sm text-slate-700 space-y-1">
                    <div className={`transition-all duration-300 ${isTextExpanded ? 'max-h-40 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        <p className={`leading-relaxed text-justify ${!isTextExpanded ? 'line-clamp-4' : ''}`}>{deskripsi}</p>
                    </div>
                    {isLongText && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsTextExpanded(!isTextExpanded); }}
                            className="text-[10px] font-black uppercase tracking-widest text-teal-700 hover:text-teal-900 transition-colors mt-2 inline-block"
                        >
                            {isTextExpanded ? "Tutup" : "Selengkapnya"}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const getMaskingOpacity = () => {
        const state = useExplorerStore.getState();
        if (zoomLevel >= 14) return 0;
        if (state.activeBaseMap === 'dark') return 0.7;
        if (state.activeBaseMap === 'street') return 0.4;
        return 0.5;
    };

    return (
        <div className={`h-full w-full overflow-hidden relative z-10 bg-slate-50 border-none`}>
            <SafeMapContainer
                key={mapKey}
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                minZoom={7}
                scrollWheelZoom={!isPreviewMode}
                dragging={!isPreviewMode}
                doubleClickZoom={!isPreviewMode}
                zoomControl={false}
                attributionControl={!(isAtlasMode || isPreviewMode)}
                className="h-full w-full z-0 outline-none"
            >
                <MapEventsHandler onZoomChange={setZoomLevel} />
                <ExternalMapController />

                <CinematicSpotlightController
                    geoData={geoData}
                    geoJsonRef={geoJsonRef}
                    indicatorValues={indicatorValues}
                    maxValue={maxValue}
                    zoomLevel={zoomLevel}
                />

                <SafeTileLayer
                    attribution='&copy; Mimika DataHub | Map data &copy; Google'
                    url={getTileLayerUrl()}
                    maxZoom={getTileMaxZoom()}
                />

                {maskingPositions.length > 0 && (
                    <SafePolygon
                        positions={maskingPositions}
                        pathOptions={{
                            fillColor: '#000000',
                            fillOpacity: getMaskingOpacity(),
                            stroke: false
                        }}
                    />
                )}

                {geoData && (
                    <SafeGeoJSON
                        ref={geoJsonRef}
                        data={geoData}
                        onEachFeature={onEachFeature}
                    />
                )}

                <AssetMarkers />

                {!isAtlasMode && !isPreviewMode && popupInfo && (
                    <SafePopup position={popupInfo.latlng} onClose={() => setPopupInfo(null)}>
                        <div className="w-72 p-2 font-sans rounded-none">
                            <h3 className="text-[13px] uppercase tracking-widest font-black text-slate-900 border-b border-slate-300 pb-2 mb-3">
                                {popupInfo.name}
                            </h3>
                            {renderPopupContent()}
                        </div>
                    </SafePopup>
                )}
            </SafeMapContainer>
        </div>
    );
}