// src/components/gis/panels/AssetDetailPanel.tsx
"use client";

import React from "react";
import { X, MapPin, Info } from "lucide-react";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

// Komponen Pure Fabrication untuk Slider Media
import ImageCarousel from "@/src/components/ui/ImageCarousel";

interface AssetDetailPanelProps {
    assetData: any; // Menerima payload marker aktual dari Database (AssetOut)
    panelId: string;
}

export default function AssetDetailPanel({ assetData, panelId }: AssetDetailPanelProps) {
    const { closePanel } = useExplorerStore();

    if (!assetData) return null;

    // Memastikan objek details aman untuk di-looping
    const details = assetData.details || {};
    const hasDetails = Object.keys(details).length > 0;

    // [REFACTOR FASE 4.1] Adaptor Data Media Aktual
    // Menggunakan array 'images' dari database. Jika kosong, fallback ke array kosong.
    // Menjamin Carousel selalu menerima array string yang valid.
    const mediaList: string[] = (assetData.images && assetData.images.length > 0)
        ? assetData.images
        : (assetData.image_url ? [assetData.image_url] : []);

    return (
        <div className="flex flex-col h-full w-full bg-white relative">

            {/* HEADER - Frameless & Sharp */}
            <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col pr-2">
                    <span
                        className="text-[9px] font-bold uppercase tracking-widest leading-none mb-1"
                        style={{ color: assetData.config?.color || '#0d9488' }}
                    >
                        {assetData.type || "Aset Daerah"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {assetData.name}
                    </h3>
                </div>

                <button
                    onClick={() => closePanel(panelId)}
                    className="p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors rounded-none shrink-0"
                    title="Tutup Panel"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </div>

            {/* BODY - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-6">

                {/* 1. HERO IMAGE CAROUSEL (Delegation Pattern) */}
                {/* Fallback "Tidak Ada Foto" sudah di-handle sepenuhnya di dalam ImageCarousel */}
                <ImageCarousel images={mediaList} altText={assetData.name} />

                {/* 2. KOORDINAT LOKASI */}
                <div className="flex flex-col border-b border-slate-200 py-3 px-4 gap-1.5 bg-white">
                    <div className="flex items-center gap-2 text-slate-500 mb-0.5">
                        <MapPin size={12} strokeWidth={2.5} className="text-teal-700" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider">Titik Koordinat</h4>
                    </div>
                    <p className="text-[11px] text-slate-800 font-mono font-medium">
                        {assetData.lat.toFixed(5)}, {assetData.lng.toFixed(5)}
                    </p>
                </div>

                {/* 3. DYNAMIC METADATA (Tabel Spesifikasi) */}
                <div className="flex flex-col bg-white">
                    <div className="flex items-center gap-2 text-slate-500 py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                        <Info size={12} strokeWidth={2.5} className="text-teal-700" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider">Spesifikasi Detail</h4>
                    </div>

                    {hasDetails ? (
                        <div className="flex flex-col">
                            {Object.entries(details).map(([key, value], index) => (
                                <div key={index} className="flex flex-col border-b border-slate-100 py-2.5 px-4 bg-white hover:bg-slate-50 transition-colors">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                        {key}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-800 leading-snug">
                                        {value as React.ReactNode}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-6 px-4 text-center text-slate-400">
                            <p className="text-[10px] font-bold uppercase tracking-widest italic">
                                Belum ada metadata tambahan.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}