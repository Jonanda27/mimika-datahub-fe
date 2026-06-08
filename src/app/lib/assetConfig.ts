// src/app/lib/assetConfig.ts

/**
 * Asset Taxonomy Configuration
 * Single Source of Truth untuk pemetaan hierarki OPD, jenis aset, dan properti visual (icon, warna).
 * Konfigurasi ini menjamin Zero Hardcoding pada komponen UI dan Spatial Engine.
 */

export interface AssetCategoryMetadata {
    type: string;      // Identifier unik yang harus sama persis (exact match) dengan key 'type' di mock data atau database
    label: string;     // Nama ramah pembaca untuk ditampilkan di UI Accordion
    iconUrl: string;   // Path relatif menuju aset statis icon marker
    color: string;     // Kode warna HEX untuk fallback visual atau styling UI layer
}

export interface OpdAssetTaxonomy {
    opdKey: string;    // Slug unik OPD, misal: "dinas_kesehatan"
    opdName: string;   // Nama instansi lengkap untuk Header Accordion
    categories: AssetCategoryMetadata[];
}

export const ASSET_TAXONOMY_CONFIG: OpdAssetTaxonomy[] = [
    {
        opdKey: "dinas_kesehatan",
        opdName: "Dinas Kesehatan",
        categories: [
            { type: "Rumah Sakit", label: "Rumah Sakit Umum", iconUrl: "/icons/markers/hospital.svg", color: "#EF4444" },
            { type: "Puskesmas", label: "Puskesmas", iconUrl: "/icons/markers/clinic.svg", color: "#F97316" },
            { type: "Puskesmas Pembantu", label: "Puskesmas Pembantu", iconUrl: "/icons/markers/aid.svg", color: "#EAB308" },
            { type: "Klinik Industri", label: "Klinik Industri", iconUrl: "/icons/markers/factory-clinic.svg", color: "#3B82F6" }
        ]
    },
    {
        opdKey: "dinas_pendidikan",
        opdName: "Dinas Pendidikan",
        categories: [
            { type: "Gedung Sekolah", label: "Gedung Sekolah", iconUrl: "/icons/markers/school.svg", color: "#10B981" },
            { type: "Fasilitas Umum", label: "Perpustakaan & Fasilitas Umum", iconUrl: "/icons/markers/library.svg", color: "#8B5CF6" }
        ]
    },
    {
        opdKey: "dinas_pupr",
        opdName: "Dinas PUPR",
        categories: [
            { type: "Infrastruktur", label: "Infrastruktur Fisik", iconUrl: "/icons/markers/bridge.svg", color: "#64748B" },
            { type: "Infrastruktur Dasar", label: "Infrastruktur Air/Sanitasi", iconUrl: "/icons/markers/water.svg", color: "#0EA5E9" },
            { type: "Aset Bergerak", label: "Alat Berat", iconUrl: "/icons/markers/bulldozer.svg", color: "#F59E0B" },
            { type: "Kantor Operasional", label: "Kantor Pemeliharaan", iconUrl: "/icons/markers/office.svg", color: "#334155" }
        ]
    },
    {
        opdKey: "dinas_sosial",
        opdName: "Dinas Sosial",
        categories: [
            { type: "Fasilitas Sosial", label: "Fasilitas Sosial & Logistik", iconUrl: "/icons/markers/social-facility.svg", color: "#EC4899" }
        ]
    }
];