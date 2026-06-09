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

// [REFACTOR FASE 4.2] Impor data statis dari lokal untuk visualisasi instan bebas lag
import { MOCK_DISTRICT_DRILLDOWN } from '@/src/app/lib/mocks/mockDistricts';
import { getSemanticColor, getSectoralStatus } from '@/src/app/lib/gisUtils';

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
    minValue: number,
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
        fillColor = getSemanticColor(indicatorValues[key], minValue, maxValue, state.activeIndicator);
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
function CinematicSpotlightController({ geoData, geoJsonRef, indicatorValues, minValue, maxValue, zoomLevel }: any) {
    const map = useMap();

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

            const newStyle = calculateLayerStyle(districtName, stateSnapshot, indicatorValues, minValue, maxValue, zoomLevel);
            layer.setStyle(newStyle);

            if (isFocused) {
                layer.bringToFront();
            }
        });

    }, [focusedDistrict, activeIndicator, mapOpacity, activeBaseMap, zoomLevel, geoData, indicatorValues, minValue, maxValue, geoJsonRef]);

    // EFEK B: Mengurus murni KAMERA (Zoom/FlyTo)
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
    }, [focusedDistrict, geoData, geoJsonRef, map]);

    return null;
}

export default function MimikaMap({ isAtlasMode = false, isPreviewMode = false }: MimikaMapProps) {
    const router = useRouter();

    const { openPanel, setFocusDistrict } = useExplorerStore();

    // State Hover Pengendali Kursor Global
    const hoveredDistrict = useExplorerStore((state) => state.hoveredDistrict);
    const hoveredAsset = useExplorerStore((state) => state.hoveredAsset);
    const setHoveredDistrict = useExplorerStore((state) => state.setHoveredDistrict);
    const setHoveredAsset = useExplorerStore((state) => state.setHoveredAsset);

    const activeMin = useExplorerStore((state) => state.activeMin);
    const activeMax = useExplorerStore((state) => state.activeMax);
    const activeUnit = useExplorerStore((state) => state.activeUnit);
    const activeDirection = useExplorerStore((state) => state.activeDirection);
    const activeIndicator = useExplorerStore((state) => state.activeIndicator);

    const geoJsonRef = useRef<L.GeoJSON>(null);

    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
    const [mapKey, setMapKey] = useState(Date.now());

    const [indicatorValues, setIndicatorValues] = useState<Record<string, number> | null>(null);
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(100);

    // Kordinat Melayang Pelacak Kursor Tooltip (Pilar 3)
    const [mouseCoords, setMouseCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const indicatorValuesRef = useRef(indicatorValues);
    const minValueRef = useRef(minValue);
    const maxValueRef = useRef(maxValue);

    useEffect(() => { indicatorValuesRef.current = indicatorValues; }, [indicatorValues]);
    useEffect(() => { minValueRef.current = minValue; }, [minValue]);
    useEffect(() => { maxValueRef.current = maxValue; }, [maxValue]);

    // Integrasi kursor pelacak koordinat mouse
    const handleMouseMove = (e: MouseEvent) => {
        setMouseCoords({ x: e.clientX, y: e.clientY });
    };

    // Event listener didaftarkan secara UNCONDITIONAL agar hover ter-render sempurna di seluruh mode halaman
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

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

                // Set local boundaries jika tidak disuplai secara dinamis dari store
                const vals = Object.values(mockData);
                const localMin = min_val(vals);
                const localMax = max_val(vals);
                setMinValue(activeMin ?? localMin);
                setMaxValue(activeMax ?? localMax);
            };
            generateMockData();
        } else {
            setIndicatorValues(null);
            setMinValue(0);
            setMaxValue(100);
        }
        return () => { isMounted = false; };
    }, [activeIndicator, activeMin, activeMax]);

    // Helpers matematika array pembantu
    const min_val = (arr: number[]) => arr.length ? Math.min(...arr) : 0;
    const max_val = (arr: number[]) => arr.length ? Math.max(...arr) : 100;

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

    // PEMBARUAN EVENT LISTENER PETA (HOVER OVER PORTAL)
    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        layer.on({
            mouseover: (e: any) => {
                const state = useExplorerStore.getState();
                const target = e.target;
                const currentZoom = target._map.getZoom();
                if (currentZoom >= 14) return;

                // Set State Hover Global di Store
                setHoveredDistrict(districtName);

                const isFocused = state.focusedDistrict && state.focusedDistrict.toLowerCase() === districtName.toLowerCase();
                if (isFocused) return;

                if (state.focusedDistrict) {
                    target.setStyle({ fillOpacity: 0.15, color: '#94a3b8', weight: 2 });
                    return;
                }

                if (state.activeIndicator) {
                    target.setStyle({
                        weight: 2.5,
                        color: '#ffffff',
                        fillOpacity: Math.min((state.mapOpacity / 100) + 0.15, 1)
                    });
                } else {
                    const isDarkMode = state.activeBaseMap === 'dark';
                    target.setStyle({
                        weight: 2,
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fillOpacity: isDarkMode ? 0 : 0.15
                    });
                }
                target.bringToFront();
            },
            mouseout: (e: any) => {
                // Bersihkan State Hover Global di Store
                setHoveredDistrict(null);

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
                    minValueRef.current,
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

                openPanel("detil-distrik", `Profil Distrik ${districtName}`, {
                    id: distId,
                    name: districtName
                });
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

    // Rekonstruksi Evaluator Tooltip Wilayah Hover agar tidak dikunci oleh Active Indicator 
    // dan menarik profil statis cache murni O(1) di frontend untuk rendering foto wilayah
    const hoveredDistrictData = useMemo(() => {
        if (!hoveredDistrict) return null;
        const key = hoveredDistrict.toLowerCase().replace(/\s/g, '');
        const distId = DISTRICT_MAP[key];
        const localProfile = distId ? MOCK_DISTRICT_DRILLDOWN[distId] : null;
        const rawValue = (indicatorValues && key in indicatorValues) ? indicatorValues[key] : null;

        return {
            id: distId,
            name: hoveredDistrict,
            profile: localProfile?.profile || null,
            value: rawValue,
            status: (rawValue !== null && activeIndicator) ? getSectoralStatus(
                rawValue,
                minValue,
                maxValue,
                activeDirection || 'positive',
                activeIndicator
            ) : null
        };
    }, [hoveredDistrict, activeIndicator, indicatorValues, minValue, maxValue, activeDirection]);

    if (loading) return null;

    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePolygon = Polygon as any;

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

                {/* Perbaikan Typo Sintaks Tag Komponen [FIXED] */}
                <CinematicSpotlightController
                    geoData={geoData}
                    geoJsonRef={geoJsonRef}
                    indicatorValues={indicatorValues}
                    minValue={minValue}
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
            </SafeMapContainer>

            {/* PORTAL RICH HOVER TOOLTIP (THEATER HUD OVERLAY) */}
            {hoveredDistrict && hoveredDistrictData && (
                <div
                    className="fixed pointer-events-none z-9999 bg-white border border-slate-200 shadow-2xl p-0 w-64 rounded-none animate-in fade-in zoom-in-95 duration-150 text-slate-800 flex flex-col overflow-hidden"
                    style={{
                        left: `${mouseCoords.x + 15}px`,
                        top: `${mouseCoords.y + 15}px`
                    }}
                >
                    {/* [FIX 3 - ASERSY AMAN] Merender Gambar Utama Wilayah dari Static Cache */}
                    {hoveredDistrictData.profile && (hoveredDistrictData.profile as any).images?.[0] && (
                        <div className="relative w-full h-20 shrink-0 bg-slate-100">
                            <img
                                src={(hoveredDistrictData.profile as any).images[0]}
                                alt={hoveredDistrictData.name}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        </div>
                    )}

                    <div className="p-3.5 flex flex-col gap-2">
                        {/* Judul Distrik */}
                        <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Distrik {hoveredDistrictData.name}
                            </h3>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                ID: {hoveredDistrictData.id ? hoveredDistrictData.id.toString().padStart(2, '0') : '--'}
                            </span>
                        </div>

                        {/* Detail Konten Data Sektoral */}
                        <div className="flex flex-col gap-1 text-[10px] font-bold">
                            {/* Kondisi A: Jika Ada Indikator Aktif (Render Data Sektoral + Status Semantik) [3] */}
                            {activeIndicator && hoveredDistrictData.value !== null && hoveredDistrictData.status && (
                                <>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Indikator:</span>
                                        <span className="text-slate-600 truncate max-w-32.5 text-right uppercase tracking-tighter">
                                            {activeIndicator.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Nilai Aktual:</span>
                                        <span className="text-slate-800 font-mono">
                                            {hoveredDistrictData.value.toLocaleString('id-ID')}{activeUnit || ""}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1.5 pt-2 border-t border-slate-100">
                                        <span className="text-[10px] uppercase tracking-widest text-slate-400">Status Capaian:</span>
                                        <span
                                            className="px-2 py-0.5 text-[8px] uppercase tracking-wider border font-black"
                                            style={{
                                                color: hoveredDistrictData.status.color,
                                                borderColor: `${hoveredDistrictData.status.color}50`,
                                                backgroundColor: `${hoveredDistrictData.status.color}10`
                                            }}
                                        >
                                            {hoveredDistrictData.status.label}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Kondisi B: Jika TIDAK Ada Indikator Aktif (Render Statistik Demografi Dasar) [10] */}
                            {!activeIndicator && hoveredDistrictData.profile && (
                                <div className="space-y-1 text-[10px] text-slate-500 font-medium">
                                    <div className="flex justify-between">
                                        <span>Luas Wilayah:</span>
                                        <span className="text-slate-800 font-bold font-mono">
                                            {hoveredDistrictData.profile.luas_wilayah?.toLocaleString('id-ID') || '-'} km²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Populasi:</span>
                                        <span className="text-slate-800 font-bold font-mono">
                                            {hoveredDistrictData.profile.jumlah_penduduk?.toLocaleString('id-ID') || '-'} Jiwa
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}