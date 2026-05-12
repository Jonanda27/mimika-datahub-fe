// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { gisService } from '@/src/app/services/gis.service';
import { SpatialStatResponse, DistrictDrilldownResponse } from '@/src/app/types/gis';

import type { LatLngExpression, PathOptions, Layer } from 'leaflet';

// Static Hash Map O(1) untuk menjembatani GeoJSON (Name) dengan API Backend (ID)
// Asumsi urutan ID pada master data Bappeda. Jika ID di DB berbeda, cukup sesuaikan value ini.
const DISTRICT_MAP: Record<string, number> = {
    "mimikabaru": 1, "kualakencana": 2, "tembagapura": 3, "wania": 4, "iwaka": 5,
    "kwamkinarama": 6, "mimikatimur": 7, "mimikatengah": 8, "mimikabarat": 9,
    "agimuga": 10, "jila": 11, "jita": 12, "mimikatimurjauh": 13, "mimikabaratjauh": 14,
    "mimikabarattengah": 15, "amar": 16, "hoya": 17, "alama": 18
};

export default function MimikaMap() {
    const searchParams = useSearchParams();

    const categoryId = searchParams.get('category_id');
    const year = searchParams.get('year');

    // State Spasial & Render Peta
    const [geoData, setGeoData] = useState<any>(null);
    const [stats, setStats] = useState<SpatialStatResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Local State untuk Pop-up Drilldown (Menggantikan Zustand)
    const [popupInfo, setPopupInfo] = useState<{ name: string; latlng: any; id: number } | null>(null);
    const [drilldownData, setDrilldownData] = useState<DistrictDrilldownResponse | null>(null);
    const [loadingDrilldown, setLoadingDrilldown] = useState(false);

    // 1. Fetching Resource Peta Awal
    useEffect(() => {
        const loadMapResources = async () => {
            setLoading(true);
            try {
                const [geoRes, statsRes] = await Promise.all([
                    fetch('/mimika_18_distrik.json').then(res => res.json()), // Gunakan file JSON terbaru hasil Mapshaper
                    gisService.fetchGisStats(
                        categoryId ? Number(categoryId) : undefined,
                        year ? Number(year) : undefined
                    )
                ]);
                setGeoData(geoRes);
                setStats(statsRes);
            } catch (error) {
                console.error("Gagal memuat sumber daya peta:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMapResources();
    }, [categoryId, year]);

    // 2. Fetching Data Drilldown saat Poligon di-Klik
    useEffect(() => {
        if (popupInfo && popupInfo.id > 0) {
            let isMounted = true;
            setLoadingDrilldown(true);

            gisService.fetchDistrictDrilldown(popupInfo.id)
                .then(data => {
                    if (isMounted) setDrilldownData(data);
                })
                .catch(err => console.error("Gagal memuat drilldown:", err))
                .finally(() => {
                    if (isMounted) setLoadingDrilldown(false);
                });

            return () => { isMounted = false; };
        }
    }, [popupInfo]);

    // 3. Normalisasi Pemetaan Warna (Choropleth)
    const statsMap = useMemo(() => {
        const map = new Map<string, number>();
        stats.forEach(item => {
            const key = item.district_name.toLowerCase().replace(/\s/g, '');
            map.set(key, item.total_dataset);
        });
        return map;
    }, [stats]);

    const getColor = (total: number) => {
        return total > 20 ? '#064e3b' :
            total > 10 ? '#059669' :
                total > 5 ? '#34d399' :
                    total > 0 ? '#a7f3d0' : '#f3f4f6';
    };

    const districtStyle = (feature: any): PathOptions => {
        const districtName = feature.properties?.district_name || "";
        const key = districtName.toLowerCase().replace(/\s/g, '');
        const total = statsMap.get(key) || 0;

        return {
            fillColor: getColor(total),
            weight: 1.5,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8,
        };
    };

    // 4. Injeksi Event Listener Click-to-Drilldown
    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.district_name || "Unknown";
        const key = districtName.toLowerCase().replace(/\s/g, '');

        layer.on({
            mouseover: (e: any) => {
                const target = e.target;
                target.setStyle({ weight: 3, color: '#10b981', fillOpacity: 0.9 });
                target.bringToFront();
            },
            mouseout: (e: any) => {
                const target = e.target;
                target.setStyle({ weight: 1.5, color: 'white', fillOpacity: 0.8 });
            },
            click: (e: any) => {
                // Eksekusi State Management Spasial
                const distId = DISTRICT_MAP[key] || 0;
                setDrilldownData(null); // Reset data lama
                setPopupInfo({
                    name: districtName,
                    latlng: e.latlng,
                    id: distId
                });
            }
        });
    };

    if (loading) {
        return (
            <div className="h-112.5 w-full flex items-center justify-center bg-white rounded-3xl border border-gray-100 animate-pulse">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Sinkronisasi Geospasial...</p>
                </div>
            </div>
        );
    }

    const mapCenter: LatLngExpression = [-4.5421, 136.8945];

    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;
    const SafePopup = Popup as any;

    return (
        <div className="h-112.5 w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative z-10">
            <SafeMapContainer
                center={mapCenter}
                zoom={8}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
            >
                <SafeTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geoData && (
                    <SafeGeoJSON
                        data={geoData}
                        style={districtStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {/* 5. Render Deklaratif UI Pop-up */}
                {popupInfo && (
                    <SafePopup position={popupInfo.latlng} onClose={() => setPopupInfo(null)}>
                        <div className="w-72 p-1 font-sans">
                            {/* Layer Header */}
                            <h3 className="text-lg font-extrabold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                                Distrik {popupInfo.name}
                            </h3>

                            {loadingDrilldown ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : drilldownData ? (
                                <div className="space-y-4">
                                    {/* Layer Profil Statis */}
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p className="line-clamp-4 leading-relaxed">
                                            {drilldownData.profile.deskripsi || "Data profil kewilayahan belum tersedia."}
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                                            <div className="bg-gray-50 p-2 rounded-lg">
                                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Luas Wilayah</span>
                                                <span className="font-bold text-gray-700 text-xs">
                                                    {drilldownData.profile.luas_wilayah ? `${drilldownData.profile.luas_wilayah} km²` : '-'}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded-lg">
                                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Populasi</span>
                                                <span className="font-bold text-gray-700 text-xs">
                                                    {drilldownData.profile.jumlah_penduduk?.toLocaleString('id-ID') || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Layer Agregasi Kategori Dinamis */}
                                    <div className="pt-2">
                                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Ketersediaan Data Sektoral
                                        </h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                            {drilldownData.categories.length > 0 ? (
                                                drilldownData.categories.map(cat => (
                                                    <div key={cat.category_id} className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-lg hover:border-emerald-200 transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
                                                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                                                {cat.total}
                                                            </span>
                                                        </div>
                                                        {/* Routing Cerdas: Melempar parameter ke halaman tabel */}
                                                        <Link href={`/user-data-pemerintah?district_id=${popupInfo.id}&category_id=${cat.category_id}`}>
                                                            <button className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors">
                                                                Eksplor
                                                            </button>
                                                        </Link>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-500 italic text-center py-3 bg-gray-50 rounded-lg">
                                                    Belum ada publikasi data di wilayah ini.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-red-500 py-4 text-center font-medium">Koneksi ke server spasial terputus.</p>
                            )}
                        </div>
                    </SafePopup>
                )}
            </SafeMapContainer>
        </div>
    );
}