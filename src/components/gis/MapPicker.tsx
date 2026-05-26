// src/components/gis/MapPicker.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// [REFACTOR] Import Library Geofencing
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

// Fix untuk default icon leaflet yang sering hilang di Next.js
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Titik tengah default: Kabupaten Mimika
const DEFAULT_CENTER: L.LatLngExpression = [-4.5421, 136.8945];

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    selectedLat: number | null;
    selectedLng: number | null;
    focusDistrictName?: string | null; // Trigger eksternal untuk Auto-Focus ke Distrik tertentu
}

// ============================================================================
// KOMPONEN INTERNAL: PENDETEKSI KLIK PENGGUNA DENGAN STRICT GEOFENCING
// ============================================================================
function LocationMarker({ onLocationSelect, selectedLat, selectedLng, focusDistrictName, geoData }: any) {
    // Menangkap event klik di atas peta
    useMapEvents({
        click(e) {
            // [REFACTOR] Logika Strict Geofencing (Point in Polygon)
            if (focusDistrictName && geoData) {
                // Cari poligon distrik yang sedang aktif
                const targetFeature = geoData.features.find((f: any) =>
                    f.properties.district_name.toLowerCase() === focusDistrictName.toLowerCase()
                );

                if (targetFeature) {
                    // Buat titik referensi dari klik user (Perhatikan: GeoJSON menggunakan format [Longitude, Latitude])
                    const clickedPoint = point([e.latlng.lng, e.latlng.lat]);

                    // Kalkulasi matematika spasial
                    const isInside = booleanPointInPolygon(clickedPoint, targetFeature);

                    if (!isInside) {
                        // Tolak pemasangan marker jika di luar batas
                        window.alert(`Titik berada di luar batas administrasi Distrik ${focusDistrictName}! Silakan klik di dalam area yang ditandai.`);
                        return;
                    }
                }
            }

            // Jika aman (di dalam poligon atau tidak ada distrik yang dipilih), pasang marker
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return selectedLat !== null && selectedLng !== null ? (
        <Marker position={[selectedLat, selectedLng]} icon={customIcon} />
    ) : null;
}

// ============================================================================
// KOMPONEN INTERNAL: PENGENDALI AUTO-FOCUS & GEOJSON BOUNDARIES
// ============================================================================
function MapBoundaries({ focusDistrictName, geoData }: { focusDistrictName: string | null, geoData: any }) {
    const map = useMap();

    useEffect(() => {
        if (!focusDistrictName || !geoData) return;

        // Cari poligon distrik yang cocok berdasarkan nama
        const targetFeature = geoData.features.find((f: any) =>
            f.properties.district_name.toLowerCase() === focusDistrictName.toLowerCase()
        );

        if (targetFeature) {
            // Buat layer sementara untuk mengekstrak batas (bounds)
            const tempLayer = L.geoJSON(targetFeature);
            const bounds = tempLayer.getBounds();

            // Terbang ke area tersebut dengan sedikit padding
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        } else {
            // Jika distrik tidak ada atau reset, kembali ke tengah Mimika
            map.flyTo(DEFAULT_CENTER, 8, { duration: 1.5 });
        }
    }, [focusDistrictName, geoData, map]);

    // Gaya transparan minimalis untuk batas distrik agar user tahu batasan wilayah
    const districtStyle = {
        fillColor: '#0071bc',
        weight: 2, // Ditebalkan sedikit agar user lebih jelas melihat batasannya
        color: '#0071bc',
        dashArray: '4',
        fillOpacity: 0.1 // Diterangkan sedikit agar batas wilayah lebih terlihat
    };

    return geoData ? (
        <GeoJSON
            data={geoData}
            style={districtStyle}
            // Mencegah GeoJSON menghalangi event klik ke layer peta di bawahnya
            interactive={false}
        />
    ) : null;
}

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================
export default function MapPicker({ onLocationSelect, selectedLat, selectedLng, focusDistrictName }: MapPickerProps) {
    const [geoData, setGeoData] = useState<any>(null);

    // Load GeoJSON Mimika untuk referensi batas wilayah
    useEffect(() => {
        fetch('/mimika_18_distrik.json')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Gagal memuat GeoJSON:", err));
    }, []);

    // HACK: Cegah error "Map container is already initialized" di React 18 Strict Mode
    const mapKey = useMemo(() => Date.now(), []);

    return (
        <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-300 shadow-inner relative z-0">
            <MapContainer
                key={mapKey}
                center={DEFAULT_CENTER}
                zoom={8}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                {/* Gunakan Basemap Google Street agar nama jalan terlihat jelas saat GeoTagging */}
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution="&copy; Google Maps"
                />

                <MapBoundaries focusDistrictName={focusDistrictName || null} geoData={geoData} />

                {/* [REFACTOR] Injeksi geoData dan focusDistrictName ke pendeteksi klik */}
                <LocationMarker
                    onLocationSelect={onLocationSelect}
                    selectedLat={selectedLat}
                    selectedLng={selectedLng}
                    focusDistrictName={focusDistrictName}
                    geoData={geoData}
                />
            </MapContainer>

            {/* Overlay instruksi tipis di pojok kiri bawah */}
            <div className="absolute bottom-4 left-4 z-400 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm pointer-events-none">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">
                    Instruksi: <br /> <span className="font-medium text-slate-500 capitalize tracking-normal">Gunakan mouse untuk menggeser peta, lalu klik area spesifik untuk menandai lokasi bangunan/aset.</span>
                </p>
            </div>
        </div>
    );
}