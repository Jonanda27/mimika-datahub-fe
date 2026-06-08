// src/components/gis/AssetDetailModal.tsx
"use client";

import React from "react";
import {
    X,
    MapPin,
    Info,
    Calendar,
    Building2,
    Tag
} from "lucide-react";

// [FIX DARI QA] Import ImageCarousel agar mendukung Multi-Foto di Dashboard
import ImageCarousel from "@/src/components/ui/ImageCarousel";

interface AssetDetailModalProps {
    asset: any; // Menerima raw data object dari tabel (AssetOut)
    onClose: () => void;
}

export default function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
    if (!asset) return null;

    // Memastikan objek details aman untuk di-looping
    const details = asset.details || {};
    const hasDetails = Object.keys(details).length > 0;

    // [FIX DARI QA] Adaptor Data Media
    // Menarik array 'images' jika ada, atau fallback ke 'image_url' lama
    const mediaList: string[] = (asset.images && asset.images.length > 0)
        ? asset.images
        : (asset.image_url ? [asset.image_url] : []);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 text-slate-800">
            {/* Modal Container */}
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-teal-700 uppercase tracking-widest leading-none mb-1">
                                Informasi Detail Aset
                            </h3>
                            <h2 className="text-sm font-bold text-slate-900">
                                #{asset.id} - {asset.name}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-200 hover:text-rose-500 transition-colors rounded-xl"
                        title="Tutup Preview"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* KOLOM KIRI: FOTO & DESKRIPSI */}
                        <div className="flex flex-col gap-6">

                            {/* [FIX DARI QA] Hero Image Carousel diganti dari Image tunggal */}
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                                <ImageCarousel images={mediaList} altText={asset.name} />
                            </div>

                            {/* Deskripsi */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Info size={12} className="text-teal-600" />
                                    Catatan / Deskripsi Aset
                                </h4>
                                <p className="text-[13px] text-slate-600 leading-relaxed font-medium text-justify">
                                    {asset.description || "Tidak ada deskripsi tambahan yang diberikan oleh instansi."}
                                </p>
                            </div>
                        </div>

                        {/* KOLOM KANAN: METADATA & SPESIFIKASI */}
                        <div className="flex flex-col gap-6">

                            {/* Grid Informasi Utama */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                        <Building2 size={12} className="text-teal-600" /> Pemilik Aset
                                    </p>
                                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                                        {asset.owner?.name || "Tidak Diketahui"}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                        <Tag size={12} className="text-teal-600" /> Kategori
                                    </p>
                                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                                        {asset.category?.name || "Umum"}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                        <MapPin size={12} className="text-teal-600" /> Titik Lokasi
                                    </p>
                                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug font-mono">
                                        {Number(asset.lat).toFixed(4)}, {Number(asset.lng).toFixed(4)}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                        <Calendar size={12} className="text-teal-600" /> Terdaftar
                                    </p>
                                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                                        {new Date(asset.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Tabel Spesifikasi Dinamis (Details JSON) */}
                            <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/80">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Data Spesifikasi Tambahan
                                    </h4>
                                </div>

                                {hasDetails ? (
                                    <div className="flex flex-col divide-y divide-slate-100">
                                        {Object.entries(details).map(([key, value], index) => (
                                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors gap-1 sm:gap-4">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-full sm:w-1/3 shrink-0">
                                                    {key}
                                                </span>
                                                <span className="text-[12px] font-medium text-slate-800 text-left sm:text-right w-full sm:w-2/3 wrap-break-word">
                                                    {value as React.ReactNode}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-5 py-10 text-center text-slate-400 flex flex-col items-center justify-center">
                                        <Info size={24} className="mb-2 opacity-50" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest italic">
                                            Belum ada atribut khusus
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}