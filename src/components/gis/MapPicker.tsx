// src/components/gis/MapPicker.tsx
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMapEvents, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Library Geofencing
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

import { MapPin, X, Check, Layers, AlertCircle, Map } from 'lucide-react';

// Titik tengah default: Kabupaten Mimika (Format Tuple Explicit untuk TS)
const DEFAULT_CENTER: [number, number] = [-4.5421, 136.8945];

interface MapPickerProps {
    isOpen: boolean; // Menandakan apakah modal fullscreen terbuka
    onClose: () => void; // Fungsi menutup modal
    onLocationSelect: (lat: number, lng: number) => void;
    selectedLat: number | null;
    selectedLng: number | null;
    focusDistrictName?: string | null;
}

// ============================================================================
// KOMPONEN INTERNAL: OBSERVER PUSAT PETA (Gojek-Style Engine)
// ============================================================================
function MapCenterTracker({
    onCenterChange,
    setIsMoving
}: {
    onCenterChange: (lat: number, lng: number) => void;
    setIsMoving: (moving: boolean) => void;
}) {
    const map = useMapEvents({
        movestart: () => {
            setIsMoving(true); // [FIX] Diperbaiki dari 'True' (typo Python) ke 'true' (TS)
        },
        move: () => {
            const center = map.getCenter();
            onCenterChange(center.lat, center.lng);
        },
        moveend: () => {
            setIsMoving(false);
            const center = map.getCenter();
            onCenterChange(center.lat, center.lng);
        }
    });

    // Set titik awal saat peta pertama kali dirender
    useEffect(() => {
        const center = map.getCenter();
        onCenterChange(center.lat, center.lng);
    }, [map, onCenterChange]);

    return null;
}

// ============================================================================
// KOMPONEN INTERNAL: BOUNDARIES & AUTO-FOCUS
// ============================================================================
function MapBoundaries({ focusDistrictName, geoData }: { focusDistrictName: string | null, geoData: any }) {
    const map = useMap();

    useEffect(() => {
        if (!focusDistrictName || !geoData) return;

        const targetFeature = geoData.features.find((f: any) =>
            f.properties.district_name.toLowerCase() === focusDistrictName.toLowerCase()
        );

        if (targetFeature) {
            const tempLayer = L.geoJSON(targetFeature);
            const bounds = tempLayer.getBounds();
            // Terbang ke area distrik
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        } else {
            map.flyTo(DEFAULT_CENTER, 8, { duration: 1.5 });
        }
    }, [focusDistrictName, geoData, map]);

    const districtStyle = {
        fillColor: '#0071bc',
        weight: 2,
        color: '#0071bc',
        dashArray: '4',
        fillOpacity: 0.1
    };

    return geoData ? (
        <GeoJSON
            data={geoData}
            style={districtStyle}
            interactive={false} // Poligon tidak bisa diklik agar tidak mengganggu geseran
        />
    ) : null;
}

// ============================================================================
// KOMPONEN UTAMA (FULLSCREEN OVERLAY)
// ============================================================================
export default function MapPicker({
    isOpen,
    onClose,
    onLocationSelect,
    selectedLat,
    selectedLng,
    focusDistrictName
}: MapPickerProps) {
    const [geoData, setGeoData] = useState<any>(null);

    // State untuk Titik Tengah & Animasi
    // [FIX] Menggunakan index pada Tuple DEFAULT_CENTER yang sudah didefinisikan tipenya
    const [currentLat, setCurrentLat] = useState<number>(selectedLat || DEFAULT_CENTER[0]);
    const [currentLng, setCurrentLng] = useState<number>(selectedLng || DEFAULT_CENTER[1]);
    const [isMoving, setIsMoving] = useState(false);

    // Basemap Toggle
    const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

    // Load GeoJSON
    useEffect(() => {
        if (isOpen && !geoData) {
            fetch('/mimika_18_distrik.json')
                .then(res => res.json())
                .then(data => setGeoData(data))
                .catch(err => console.error("Gagal memuat GeoJSON:", err));
        }
    }, [isOpen, geoData]);

    // HACK React 18: Re-mount map saat dibuka agar ukuran kontainer tidak glitch
    const mapKey = useMemo(() => Date.now(), [isOpen]);

    // ==========================================
    // LOGIKA GEOFENCING SAAT KONFIRMASI
    // ==========================================
    const handleConfirm = () => {
        if (focusDistrictName && geoData) {
            const targetFeature = geoData.features.find((f: any) =>
                f.properties.district_name.toLowerCase() === focusDistrictName.toLowerCase()
            );

            if (targetFeature) {
                // Turf.js menggunakan format [Longitude, Latitude]
                const centerPoint = point([currentLng, currentLat]);
                const isInside = booleanPointInPolygon(centerPoint, targetFeature);

                if (!isInside) {
                    alert(`Titik koordinat berada di LUAR batas Distrik ${focusDistrictName}!\nSilakan geser peta hingga jarum berada di dalam area yang ditandai garis biru.`);
                    return; // Batalkan penyimpanan jika meleset
                }
            }
        }

        // Jika lolos validasi, simpan koordinat dan tutup peta
        onLocationSelect(currentLat, currentLng);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 bg-slate-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* --- TOP BAR --- */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0071bc]">GeoTagging</span>
                    <h2 className="text-sm font-bold text-slate-800">Tentukan Lokasi Aset</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* --- MAP CANVAS --- */}
            <div className="flex-1 relative w-full h-full bg-slate-200">
                <MapContainer
                    key={mapKey}
                    center={[currentLat, currentLng]}
                    zoom={focusDistrictName ? 12 : 8} // Zoom in otomatis jika ada distrik terpilih
                    zoomControl={false}
                    className="w-full h-full z-0"
                >
                    {/* Engine Pencatat Kordinat Pusat & Boundaries */}
                    <MapCenterTracker onCenterChange={(lat, lng) => { setCurrentLat(lat); setCurrentLng(lng); }} setIsMoving={setIsMoving} />
                    <MapBoundaries focusDistrictName={focusDistrictName || null} geoData={geoData} />

                    {/* Basemap Switcher Dinamis */}
                    {mapType === 'street' ? (
                        <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} />
                    ) : (
                        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22} />
                    )}
                </MapContainer>

                {/* --- CENTER CROSSHAIR PIN (The "Gojek" Illusion) --- */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-400 pointer-events-none flex flex-col items-center">
                    {/* Bayangan Pin (Membesar/Mengecil saat digeser) */}
                    <div className={`absolute -bottom-1.5 w-6 h-3 bg-black/30 rounded-[100%] blur-[2px] transition-all duration-300 ${isMoving ? 'scale-50 opacity-30' : 'scale-100 opacity-60'}`}></div>

                    {/* Pin Fisik (Terangkat saat digeser) */}
                    <div className={`transition-transform duration-300 ${isMoving ? '-translate-y-4' : 'translate-y-0'}`}>
                        <div className="bg-rose-600 w-12 h-12 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white relative">
                            <MapPin size={24} fill="currentColor" className="text-white" />
                            {/* Jarum Bawah Pin */}
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-10 border-l-transparent border-r-transparent border-t-white"></div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-rose-600"></div>
                        </div>
                    </div>
                </div>

                {/* --- MAP TYPE CONTROLLER (Floating Kanan Atas) --- */}
                <div className="absolute top-4 right-4 z-400 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col pointer-events-auto">
                    <button
                        onClick={() => setMapType('street')}
                        className={`p-3 transition-colors flex flex-col items-center gap-1 ${mapType === 'street' ? 'bg-[#0071bc] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Map size={18} />
                        <span className="text-[9px] font-bold uppercase">Jalan</span>
                    </button>
                    <button
                        onClick={() => setMapType('satellite')}
                        className={`p-3 transition-colors flex flex-col items-center gap-1 ${mapType === 'satellite' ? 'bg-[#0071bc] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Layers size={18} />
                        <span className="text-[9px] font-bold uppercase">Satelit</span>
                    </button>
                </div>

                {/* --- CROSSHAIR HELPER TEXT --- */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 z-400 pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-wider shadow-lg">
                        Geser peta untuk menentukan titik
                    </div>
                </div>
            </div>

            {/* --- BOTTOM BAR (Konfirmasi & Info) --- */}
            <div className="bg-white border-t border-slate-200 p-4 sm:p-6 z-10 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                {focusDistrictName && (
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 p-3 rounded-xl mb-4">
                        <AlertCircle size={16} className="text-[#0071bc] mt-0.5 shrink-0" />
                        <p className="text-[11px] text-[#004b87] leading-relaxed font-medium">
                            Pastikan jarum (pin) berada di dalam area batas <strong>Distrik {focusDistrictName}</strong> (Garis Biru). Jika meleset, sistem akan menolak koordinat tersebut.
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Titik Kordinat Terpilih:</span>
                        <span className="text-sm font-mono text-slate-800 font-bold">
                            {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
                        </span>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95 pointer-events-auto"
                    >
                        <Check size={18} strokeWidth={2.5} /> Konfirmasi Lokasi
                    </button>
                </div>
            </div>

        </div>
    );
}