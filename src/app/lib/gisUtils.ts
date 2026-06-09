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
 * [REFACTOR] Mengkalkulasi kode warna (Hex) berbasis EQUAL INTERVAL dinamis (Pilar 1).
 * Menggunakan rentang batas bawah (min) dan batas atas (max) rill hasil kalkulasi backend
 * sehingga menghasilkan kontras warna spasial yang akurat dan seimbang.
 */
export const getSemanticColor = (value: number, min: number, max: number, indicatorKey: string): string => {
    const range = max - min;
    // Hindari pembagian dengan nol jika seluruh daerah bernilai seragam
    const ratio = range > 0 ? (value - min) / range : 0.5;
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

export interface SectoralStatus {
    level: number;       // Skor normalisasi 1-5
    label: string;       // Label semantik kontekstual
    color: string;       // Warna heksagonal representatif
}

/**
 * [NEW - PURE FABRICATION]
 * Mesin Klasifikasi Status Capaian Sektoral (Pilar 3).
 * Menerjemahkan angka mentah apa pun menjadi status kualitatif yang ramah orang awam (bebas ambigu),
 * dengan menyesuaikan arah evaluasi indikator positif vs negatif secara otomatis.
 */
export const getSectoralStatus = (
    value: number,
    min: number,
    max: number,
    direction: 'positive' | 'negative',
    indicatorKey: string
): SectoralStatus => {
    const range = max - min;
    const ratio = range > 0 ? (value - min) / range : 0.5;

    // 1. Tentukan nomor bin (1-5) dari terendah ke tertinggi
    let bin = 1;
    if (ratio > 0.8) bin = 5;
    else if (ratio > 0.6) bin = 4;
    else if (ratio > 0.4) bin = 3;
    else if (ratio > 0.2) bin = 2;

    // 2. Ambil warna heksadesimal representatif berdasarkan indikator aktif
    const color = getSemanticColor(value, min, max, indicatorKey);

    let label = "";
    let level = bin;

    // 3. Klasifikasi Semantik Kontekstual (Menolak istilah "Padat" untuk data umum)
    if (direction === 'positive') {
        // MAKIN TINGGI = MAKIN BAIK (Guru, IPM, PDRB)
        level = bin;
        const positiveLabels = [
            "Sangat Kurang",
            "Kurang",
            "Cukup",
            "Memadai",
            "Sangat Memadai"
        ];
        label = positiveLabels[bin - 1];
    } else {
        // MAKIN TINGGI = MAKIN KRITIS (Stunting, Gizi Buruk, Kemiskinan)
        // Nilai paling rendah (bin 1) adalah level terbaik (Sangat Aman)
        level = 6 - bin;
        const negativeLabels = [
            "Sangat Aman",
            "Aman",
            "Cukup / Sedang",
            "Waspada",
            "Kritis"
        ];
        label = negativeLabels[bin - 1];
    }

    return { level, label, color };
};