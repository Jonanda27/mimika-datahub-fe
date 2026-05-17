// src/app/lib/gisUtils.ts

/**
 * gisUtils - Pure Fabrication Engine
 * Berisi sekumpulan fungsi utilitas murni untuk kebutuhan spasial.
 * Didesain tanpa ketergantungan pada React atau Leaflet agar 100% aman dieksekusi di Server-Side (Node.js).
 */

/**
 * Konfigurasi Eksternal Tile Server (Basemap Gallery).
 * Memisahkan definisi URL dari komponen UI untuk mematuhi prinsip High Cohesion & Low Coupling.
 */
export const BASEMAP_URLS: Record<string, string> = {
    satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", // Google Satellite High-Res
    street: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",    // Google Roadmap
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Carto Dark Matter
};

/**
 * Mengambil URL Tile Server berdasarkan ID aktif.
 * @param baseMapId ID dari basemap (contoh: "satellite", "dark")
 * @returns String URL Endpoint dari Tile Provider
 */
export const getBasemapUrl = (baseMapId: string): string => {
    return BASEMAP_URLS[baseMapId] || BASEMAP_URLS.satellite;
};

/**
 * Mengkalkulasi kode warna (Hex) untuk peta choropleth berdasarkan nilai data dan kategori indikator.
 * @param value Nilai aktual dari distrik/poligon.
 * @param max Nilai maksimum dari seluruh dataset indikator saat ini.
 * @param indicatorKey Kata kunci indikator untuk menentukan skema warna (Semantic Color).
 * @returns String kode warna Hexadecimal.
 */
export const getSemanticColor = (value: number, max: number, indicatorKey: string): string => {
    const ratio = value / max;
    const key = indicatorKey.toLowerCase();

    // KESEHATAN / SOSIAL: Magenta - Deep Pink (Sangat Berani & Mencolok)
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