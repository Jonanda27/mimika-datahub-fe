// src/app/lib/gisUtils.ts

/**
 * gisUtils - Pure Fabrication Engine
 * Berisi sekumpulan fungsi utilitas murni untuk kebutuhan spasial.
 * Didesain tanpa ketergantungan pada React atau Leaflet agar 100% aman dieksekusi di Server-Side (Node.js).
 */

/**
 * Konfigurasi Eksternal Tile Server (Basemap Gallery).
 */
export const BASEMAP_URLS: Record<string, string> = {
    satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    street: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

export const getBasemapUrl = (baseMapId: string): string => {
    return BASEMAP_URLS[baseMapId] || BASEMAP_URLS.satellite;
};

/**
 * Mendapatkan konfigurasi visual untuk marker aset.
 * Mengembalikan objek konfigurasi yang digunakan komponen UI untuk membangun Icon Leaflet.
 * * @param color Warna dominan instansi/OPD (Hex)
 * @returns Object konfigurasi styling
 */
export const getMarkerConfig = (color: string = '#0f172a') => {
    return {
        containerClass: "flex items-center justify-center w-7 h-7 rounded-none border-[1.5px] border-white shadow-md",
        backgroundColor: color,
        iconSize: [28, 28] as [number, number],
        iconAnchor: [14, 14] as [number, number],
    };
};

/**
 * Mengkalkulasi kode warna (Hex) untuk peta choropleth berdasarkan nilai data dan kategori indikator.
 * Fungsi ini murni matematis/logis.
 */
export const getSemanticColor = (value: number, max: number, indicatorKey: string): string => {
    const ratio = value / max;
    const key = indicatorKey.toLowerCase();

    // Logic Grouping berdasarkan domain data
    // KESEHATAN / STUNTING (Skala Merah)
    if (key.includes('stunting') || key.includes('kesehatan') || key.includes('ibu')) {
        if (ratio > 0.8) return '#9f1239'; // Rose-800
        if (ratio > 0.6) return '#e11d48'; // Rose-600
        if (ratio > 0.4) return '#f43f5e'; // Rose-500
        if (ratio > 0.2) return '#fda4af'; // Rose-300
        return '#ffe4e6';                 // Rose-100
    }
    // INFRASTRUKTUR (Skala Amber/Orange)
    else if (key.includes('air') || key.includes('infrastruktur') || key.includes('jalan')) {
        if (ratio > 0.8) return '#92400e'; // Amber-800
        if (ratio > 0.6) return '#d97706'; // Amber-600
        if (ratio > 0.4) return '#f59e0b'; // Amber-500
        if (ratio > 0.2) return '#fcd34d'; // Amber-300
        return '#fef3c7';                 // Amber-100
    }
    // EKONOMI / PDRB (Skala Emerald/Hijau)
    else if (key.includes('pdrb') || key.includes('ekonomi') || key.includes('investasi')) {
        if (ratio > 0.8) return '#065f46'; // Emerald-800
        if (ratio > 0.6) return '#059669'; // Emerald-600
        if (ratio > 0.4) return '#10b981'; // Emerald-500
        if (ratio > 0.2) return '#6ee7b7'; // Emerald-300
        return '#d1fae5';                 // Emerald-100
    }
    // SOSIAL / UMUM (Skala Slate/Gray)
    else {
        if (ratio > 0.8) return '#1e293b'; // Slate-800
        if (ratio > 0.6) return '#475569'; // Slate-600
        if (ratio > 0.4) return '#64748b'; // Slate-500
        if (ratio > 0.2) return '#94a3b8'; // Slate-400
        return '#f1f5f9';                 // Slate-100
    }
};