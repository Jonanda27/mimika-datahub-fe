// src/components/gis/MimikaMap.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import { gisService } from '@/src/app/services/gis.service';
import { SpatialStatResponse } from '@/src/app/types/gis';

// Import Tipe Data Inti dari Leaflet untuk membungkam error TypeScript React 19
import type { LatLngExpression, PathOptions, Layer } from 'leaflet';

export default function MimikaMap() {
    const searchParams = useSearchParams();

    const categoryId = searchParams.get('category_id');
    const year = searchParams.get('year');

    const [geoData, setGeoData] = useState<any>(null);
    const [stats, setStats] = useState<SpatialStatResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMapResources = async () => {
            setLoading(true);
            try {
                const [geoRes, statsRes] = await Promise.all([
                    fetch('/mimika_distrik.geojson').then(res => res.json()),
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

    const statsMap = useMemo(() => {
        const map = new Map<string, number>();
        stats.forEach(item => {
            // NORMALISASI: Kecilkan huruf dan HAPUS semua spasi
            const key = item.district_name.toLowerCase().replace(/\s/g, '');
            map.set(key, item.total_dataset);
        });
        return map;
    }, [stats]);

    const getColor = (total: number) => {
        return total > 20 ? '#064e3b' :
            total > 10 ? '#059669' :
                total > 5 ? '#34d399' :
                    total > 0 ? '#a7f3d0' :
                        '#f3f4f6';
    };

    // Explicit type 'PathOptions' dari leaflet menormalkan error tipe GeoJSON
    const districtStyle = (feature: any): PathOptions => {
        const districtName = feature.properties?.NAMOBJ || "";
        // NORMALISASI: Samakan kunci dengan yang ada di statsMap
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

    // Explicit type 'Layer' untuk parameter kedua
    const onEachFeature = (feature: any, layer: Layer) => {
        const districtName = feature.properties?.NAMOBJ || "Unknown";
        // NORMALISASI: Samakan kunci untuk pencarian data di Tooltip
        const key = districtName.toLowerCase().replace(/\s/g, '');
        const total = statsMap.get(key) || 0;

        layer.bindTooltip(
            `<div class="p-1 font-sans text-xs">
                <p class="font-bold border-b border-gray-100 pb-1 mb-1">${districtName}</p>
                <p class="text-gray-600">Total: <span class="text-emerald-600 font-bold">${total} Dataset</span></p>
            </div>`,
            { sticky: true, direction: 'top', className: 'rounded-lg shadow-xl border-none' }
        );

        layer.on({
            mouseover: (e: any) => {
                const target = e.target;
                target.setStyle({
                    weight: 3,
                    color: '#1e61d0',
                    fillOpacity: 0.9,
                });
                target.bringToFront();
            },
            mouseout: (e: any) => {
                const target = e.target;
                target.setStyle({
                    weight: 1.5,
                    color: 'white',
                    fillOpacity: 0.8,
                });
            },
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

    // Explicit type 'LatLngExpression' menyelesaikan error "center does not exist"
    const mapCenter: LatLngExpression = [-4.5421, 136.8945];

    // Bypass Tipe Khusus React 19: Menggunakan assertion 'as any' pada komponen pihak ketiga 
    // yang belum mengupdate tipe RefAttributes mereka untuk React 19.
    // Ini aman dan best practice di ekosistem Next.js 15 / React 19 saat ini.
    const SafeMapContainer = MapContainer as any;
    const SafeTileLayer = TileLayer as any;
    const SafeGeoJSON = GeoJSON as any;

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
            </SafeMapContainer>
        </div>
    );
}