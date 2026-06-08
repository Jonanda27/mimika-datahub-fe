// src/app/(user)/user-manajemen-aset/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    MapPin, Save, Plus, Trash2, Image as ImageIcon,
    X, AlertCircle, Building2, Layers, CheckCircle2, List,
    Eye, Edit2, Map
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import AddItemModal from "../upload-data/components/AddItemModal";
import AssetDetailModal from "@/src/components/gis/AssetDetailModal";

import { assetService } from "@/src/app/services/asset.service";
import { useSourceStore } from "@/src/app/store/useSourceStore";

// [REFACTOR FASE 4.3] Mengimpor MapPicker Gojek-Style secara Dinamis
const MapPicker = dynamic(() => import("@/src/components/gis/MapPicker"), {
    ssr: false,
    loading: () => null // Loading state di-handle internal oleh MapPicker
});

// Master Data Distrik Mimika
const MIMIKA_DISTRICTS = [
    { id: 1, name: "Mimika Baru" }, { id: 2, name: "Kuala Kencana" }, { id: 3, name: "Tembagapura" },
    { id: 4, name: "Wania" }, { id: 5, name: "Iwaka" }, { id: 6, name: "Kwamki Narama" },
    { id: 7, name: "Mimika Timur" }, { id: 8, name: "Mimika Tengah" }, { id: 9, name: "Mimika Barat" },
    { id: 10, name: "Agimuga" }, { id: 11, name: "Jila" }, { id: 12, name: "Jita" },
    { id: 13, name: "Mimika Timur Jauh" }, { id: 14, name: "Mimika Barat Jauh" },
    { id: 15, name: "Mimika Barat Tengah" }, { id: 16, name: "Amar" }, { id: 17, name: "Hoya" },
    { id: 18, name: "Alama" },
];

export default function ManajemenAsetPage() {
    // --- Master Data State ---
    const { sources, fetchSources } = useSourceStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [myAssets, setMyAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Modal State ---
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    // --- Form State ---
    const [editingAssetId, setEditingAssetId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [sourceId, setSourceId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [description, setDescription] = useState("");

    // [REFACTOR FASE 4.3] State untuk Multiple Images
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // State Map Picker (Gojek Style)
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [focusDistrict, setFocusDistrict] = useState<string | null>(null);

    // State Dynamic Metadata 
    const [details, setDetails] = useState<{ key: string, value: string }[]>([]);

    // --- UI State ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMsg, setAlertMsg] = useState<{ message: string; type: "success" | "danger" } | null>(null);

    // Initial Fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchSources();
                const cats = await assetService.getAssetCategories();
                setCategories(cats);
                const assets = await assetService.getMyAssets();
                setMyAssets(assets);
            } catch (err) {
                console.error("Gagal memuat master data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [fetchSources]);

    // [REFACTOR FASE 4.3] Cleanup object URL untuk array gambar
    useEffect(() => {
        // Jika ada file fisik yang dipilih, buat object URL untuk preview
        if (selectedImages.length > 0) {
            const urls = selectedImages.map(file => URL.createObjectURL(file));
            setImagePreviews(urls);

            return () => {
                urls.forEach(url => URL.revokeObjectURL(url));
            };
        }
    }, [selectedImages]);

    // --- Handlers ---
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setDistrictId(val);
        const distName = MIMIKA_DISTRICTS.find(d => d.id === Number(val))?.name;
        setFocusDistrict(distName || null);
    };

    const handleAddDetailRow = () => setDetails([...details, { key: "", value: "" }]);
    const handleRemoveDetailRow = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
    };
    const handleDetailChange = (index: number, field: "key" | "value", val: string) => {
        const newDetails = [...details];
        newDetails[index][field] = val;
        setDetails(newDetails);
    };

    const handleSaveCategory = async () => {
        if (!newItemName.trim()) return;
        setIsSubmitting(true);
        try {
            await assetService.createAssetCategory(newItemName);
            setAlertMsg({ message: `Kategori "${newItemName}" berhasil ditambahkan!`, type: "success" });
            const cats = await assetService.getAssetCategories();
            setCategories(cats);
            setShowCategoryModal(false);
            setNewItemName("");
        } catch (err: any) {
            setAlertMsg({ message: err.message || "Gagal menambah kategori", type: "danger" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi membersihkan form (Cancel Edit)
    const resetForm = () => {
        setEditingAssetId(null);
        setName(""); setCategoryId(""); setSourceId(""); setDescription(""); setDistrictId("");
        setSelectedImages([]); setImagePreviews([]); setLat(null); setLng(null); setFocusDistrict(null);
        setDetails([]);
    };

    // Fungsi menarik data ke Form untuk diedit
    const handleEditClick = (asset: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingAssetId(asset.id);
        setName(asset.name);
        setSourceId(asset.source_id.toString());
        setCategoryId(asset.category_id.toString());
        setDistrictId(asset.district_id ? asset.district_id.toString() : "");
        setDescription(asset.description || "");
        setLat(asset.lat);
        setLng(asset.lng);
        setFocusDistrict(asset.district?.name || null);

        // [REFACTOR FASE 4.3] Menarik Array of Images (Jika ada), atau Image tunggal
        setSelectedImages([]); // Reset input file fisik
        if (asset.images && asset.images.length > 0) {
            setImagePreviews(asset.images);
        } else if (asset.image_url) {
            setImagePreviews([asset.image_url]);
        } else {
            setImagePreviews([]);
        }

        if (asset.details && Object.keys(asset.details).length > 0) {
            const parsedDetails = Object.entries(asset.details).map(([k, v]) => ({ key: k, value: String(v) }));
            setDetails(parsedDetails);
        } else {
            setDetails([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !sourceId || !categoryId || !districtId || lat === null || lng === null) {
            setAlertMsg({ message: "Nama, Sumber OPD, Kategori, Distrik, dan Titik Koordinat Peta WAJIB diisi!", type: "danger" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setAlertMsg(null);

        const formattedDetails: Record<string, string> = {};
        details.forEach(item => {
            if (item.key.trim() && item.value.trim()) {
                formattedDetails[item.key.trim()] = item.value.trim();
            }
        });

        // [REFACTOR FASE 4.3] Menyesuaikan dengan interface CreateAssetPayload (Multiple Images)
        const payloadData = {
            name,
            source_id: Number(sourceId),
            category_id: Number(categoryId),
            district_id: Number(districtId),
            lat,
            lng,
            description,
            images: selectedImages, // Kirim Array File
            details: formattedDetails
        };

        try {
            if (editingAssetId) {
                await assetService.updateAsset(editingAssetId, payloadData);
                setAlertMsg({ message: "Aset berhasil diperbarui di database Geospasial!", type: "success" });
            } else {
                await assetService.createAsset(payloadData);
                setAlertMsg({ message: "Aset baru berhasil ditambahkan!", type: "success" });
            }

            const updatedAssets = await assetService.getMyAssets();
            setMyAssets(updatedAssets);

            resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err: any) {
            setAlertMsg({ message: err.message || "Gagal menyimpan aset", type: "danger" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number, assetName: string) => {
        if (!window.confirm(`Hapus aset "${assetName}"? Data yang terhapus akan hilang dari peta publik.`)) return;
        try {
            await assetService.deleteAsset(id);
            setMyAssets(myAssets.filter(a => a.id !== id));
            if (editingAssetId === id) resetForm();
            setAlertMsg({ message: "Aset berhasil dihapus.", type: "success" });
        } catch (err) {
            setAlertMsg({ message: "Gagal menghapus aset.", type: "danger" });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-8">
                <PageHeader title="Manajemen Aset" subtitle="Modul GeoTagging Fisik" />
                <LoadingState message="Menghubungkan ke Mesin Spasial..." />
            </div>
        );
    }

    return (
        <div className="bg-[#f4f7fb] min-h-screen font-sans text-black p-4 md:p-6 lg:p-8 pb-20">
            <PageHeader
                title="GeoTagging Aset Daerah"
                subtitle="Daftarkan atau perbarui lokasi aset fisik Instansi Anda ke dalam WebGIS."
            />

            {alertMsg && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${alertMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    {alertMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-semibold">{alertMsg.message}</span>
                </div>
            )}

            {/* --- WORKSPACE FORM (Centered & Focused) --- */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 lg:p-10 border border-gray-200 shadow-sm mb-12 relative overflow-hidden transition-all duration-300">
                {editingAssetId && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                )}

                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${editingAssetId ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-[#0071bc]"}`}>
                            <Building2 size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">
                            {editingAssetId ? "Update Data Aset" : "Informasi Aset Baru"}
                        </h3>
                    </div>
                    {editingAssetId && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md font-black uppercase tracking-widest shadow-sm">
                            Mode Edit Aktif
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Nama Aset */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama / Judul Aset <span className="text-red-500">*</span></label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting}
                            placeholder="Contoh: Puskesmas Wania"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] focus:bg-white transition-all font-bold text-gray-800"
                        />
                    </div>

                    {/* Dropdown 2 Kolom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori Aset <span className="text-red-500">*</span></label>
                            <select
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={isSubmitting}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="button" onClick={() => setShowCategoryModal(true)} disabled={isSubmitting} className="mt-2 ml-1 text-[10px] font-black text-[#0071bc] flex items-center gap-1 hover:underline uppercase tracking-widest">
                                <Plus size={12} /> Tambah Kategori Baru
                            </button>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kepemilikan (OPD) <span className="text-red-500">*</span></label>
                            <select
                                value={sourceId} onChange={(e) => setSourceId(e.target.value)} required disabled={isSubmitting}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                            >
                                <option value="">Pilih Instansi Pemilik</option>
                                {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Wilayah / Distrik */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lokasi Administratif (Distrik) <span className="text-red-500">*</span></label>
                        <select
                            value={districtId} onChange={handleDistrictChange} disabled={isSubmitting} required
                            className="w-full bg-blue-50 border border-blue-100 text-blue-900 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                        >
                            <option value="">-- Pilih Wilayah Distrik (Wajib) --</option>
                            {MIMIKA_DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    {/* [REFACTOR FASE 4.3] KOORDINAT & TRIGGER MAP */}
                    <div className="space-y-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                            <MapPin size={14} className="text-rose-500" /> Titik Koordinat Geospasial <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-600 font-mono shadow-inner text-center sm:text-left">
                                {lat !== null && lng !== null ? (
                                    <span className="font-bold text-[#0071bc]">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                                ) : (
                                    <span className="italic">Belum ada koordinat terpilih</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMapOpen(true)}
                                className="w-full sm:w-auto bg-[#002244] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0071bc] transition-all shadow-lg active:scale-95"
                            >
                                <Map size={16} /> Buka Peta Lokasi
                            </button>
                        </div>
                    </div>

                    {/* Keterangan / Deskripsi */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                            <span>Deskripsi Fisik / Keterangan</span>
                            <span className="text-[9px] text-gray-300 font-normal normal-case italic">*Opsional</span>
                        </label>
                        <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            rows={3} disabled={isSubmitting}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] focus:bg-white resize-none text-slate-700 font-medium placeholder:text-gray-400 transition-all"
                            placeholder="Jelaskan kondisi bangunan, sejarah operasional, atau fungsi spesifik dari aset ini..."
                        ></textarea>
                    </div>

                    {/* [REFACTOR FASE 4.3] UPLOAD FOTO MULTI-FILES */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                            <span>Dokumentasi Visual (Foto Fisik)</span>
                            {editingAssetId && imagePreviews.length > 0 && (
                                <span className="text-amber-500 italic normal-case tracking-normal text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded">
                                    Pilih foto baru untuk menimpa file lama
                                </span>
                            )}
                        </label>

                        {imagePreviews.length === 0 ? (
                            <div
                                onClick={() => document.getElementById('asset-images')?.click()}
                                className="w-full py-10 border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
                            >
                                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="text-slate-400 group-hover:text-blue-500" size={28} strokeWidth={2} />
                                </div>
                                <span className="text-xs font-bold text-slate-600 mb-1">Upload Dokumentasi Bangunan</span>
                                <span className="text-[10px] text-slate-400 font-medium">Bisa memilih lebih dari 1 file (JPG/PNG). Maks 5MB/file.</span>
                            </div>
                        ) : (
                            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                {/* Preview Horizontal Scroll */}
                                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-300 shadow-sm group bg-white">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            {/* Indikator urutan cover */}
                                            {idx === 0 && (
                                                <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-sm shadow-md">
                                                    Cover Utama
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Tombol Tambah Lebih Banyak (Trigger Ulang Input) */}
                                    <div
                                        onClick={() => document.getElementById('asset-images')?.click()}
                                        className="w-32 h-32 shrink-0 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-colors"
                                    >
                                        <Plus size={20} className="text-slate-400 mb-1" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ganti File</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{imagePreviews.length} Foto Terpilih</span>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedImages([]); setImagePreviews([]); }}
                                        className="text-[10px] bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-50 transition-colors uppercase tracking-widest"
                                    >
                                        Hapus Semua
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Input Hidden untuk Multiple Files */}
                        <input
                            id="asset-images"
                            type="file"
                            multiple
                            accept="image/jpeg, image/png, image/webp"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    // Validasi ukuran bisa ditambahkan di sini jika perlu
                                    setSelectedImages(Array.from(e.target.files));
                                }
                            }}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Dynamic Metadata (Key-Value) */}
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Atribut Spesifik (Metadata Khusus)</label>
                            <button type="button" onClick={handleAddDetailRow} className="text-[10px] font-black uppercase text-white bg-[#0071bc] hover:bg-[#005a96] px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1">
                                <Plus size={12} /> Tambah Row
                            </button>
                        </div>

                        {details.length === 0 && (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-[11px] text-slate-400 font-medium italic">Klik "Tambah Row" jika aset ini memiliki data teknis spesifik (Misal: Kapasitas Bed, Tahun Berdiri, Status Lahan).</p>
                            </div>
                        )}

                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                            {details.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center animate-in slide-in-from-top-1">
                                    <div className="flex flex-col flex-1 gap-1 relative">
                                        <input
                                            type="text" placeholder="Parameter (Misal: Kapasitas)" value={item.key} onChange={(e) => handleDetailChange(index, "key", e.target.value)} disabled={isSubmitting}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-[#0071bc] outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <input
                                            type="text" placeholder="Nilai (Misal: 100 Orang)" value={item.value} onChange={(e) => handleDetailChange(index, "value", e.target.value)} disabled={isSubmitting}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-[#0071bc] outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button" onClick={() => handleRemoveDetailRow(index)}
                                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-8 border-t border-slate-100">
                        {editingAssetId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className="w-full sm:w-1/3 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Batalkan Edit
                            </button>
                        )}
                        <button
                            type="submit" disabled={isSubmitting}
                            className={`w-full ${editingAssetId ? 'sm:w-2/3' : ''} text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${editingAssetId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-[#0071bc] hover:bg-[#005a96] shadow-blue-900/20'
                                }`}
                        >
                            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} strokeWidth={2.5} />}
                            {isSubmitting ? "Menyimpan ke Server..." : (editingAssetId ? "Update Data Spasial" : "Kirim Pengajuan Aset")}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- TABEL RIWAYAT ASET (Full Width) --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-[#0071bc] rounded-lg">
                            <List size={18} strokeWidth={2.5} />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Riwayat GeoTagging Instansi Anda</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                        {myAssets.length} Aset Terdaftar
                    </span>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-200">
                        <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-5">Identitas Aset</th>
                                <th className="px-6 py-5">Lokasi Distrik</th>
                                <th className="px-6 py-5 text-center">Status Tayang</th>
                                <th className="px-6 py-5 text-center">Aksi Pilihan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {myAssets.length > 0 ? myAssets.map((a) => (
                                <tr key={a.id} className={`hover:bg-blue-50/30 transition-colors ${editingAssetId === a.id ? 'bg-amber-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* Menampilkan cover utama jika ada */}
                                            {a.image_url ? (
                                                <img src={a.image_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                                                    <Layers size={16} />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 truncate max-w-62.5">{a.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kategori: {a.category?.name || "Umum"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{a.district?.name || "Tanpa Distrik"}</span>
                                            <span className="text-[10px] font-mono text-slate-500 mt-0.5">{Number(a.lat).toFixed(4)}, {Number(a.lng).toFixed(4)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Status Moderasi */}
                                        {a.status === "approved" ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <CheckCircle2 size={12} /> Publik
                                            </span>
                                        ) : a.status === "rejected" ? (
                                            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <AlertCircle size={12} /> Ditolak
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <AlertCircle size={12} /> Menunggu
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedAsset(a)}
                                                className="p-2.5 text-slate-500 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                                                title="Lihat Detail Metadata"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(a)}
                                                className={`p-2.5 border rounded-xl transition-all shadow-sm ${editingAssetId === a.id ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-500 bg-white border-slate-200 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50'}`}
                                                title="Koreksi Data / Peta"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(a.id, a.name)}
                                                className="p-2.5 text-rose-500 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 rounded-xl transition-all shadow-sm"
                                                title="Tarik / Hapus Data"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                            <MapPin size={48} className="mb-4 text-slate-800" />
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-800">Belum ada aset fisik didaftarkan</p>
                                            <p className="text-xs font-bold text-slate-500 mt-2">Gunakan formulir di atas untuk mulai memetakan aset OPD Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Kategori (Internal) */}
            <AddItemModal
                isOpen={showCategoryModal}
                onClose={() => { setShowCategoryModal(false); setNewItemName(""); }}
                onSave={handleSaveCategory}
                title="Kategori Aset"
                placeholder="Misal: Sarana Ibadah, Pasar, dll"
                value={newItemName}
                onChange={setNewItemName}
                type="category"
            />

            {/* Modal Preview Detail Aset */}
            {selectedAsset && (
                <AssetDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                />
            )}

            {/* [REFACTOR FASE 4.3] Fullscreen Gojek-Style Map Picker Overlay */}
            <MapPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={(lt: number, ln: number) => { setLat(lt); setLng(ln); }}
                selectedLat={lat}
                selectedLng={lng}
                focusDistrictName={focusDistrict}
            />
        </div>
    );
}