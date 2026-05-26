// src/app/(user)/user-manajemen-aset/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    MapPin, Save, Plus, Trash2, Image as ImageIcon,
    X, AlertCircle, Building2, Layers, CheckCircle2, List,
    Eye, Edit2 // [REFACTOR] Tambahan Ikon
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import AddItemModal from "../upload-data/components/AddItemModal";
import AssetDetailModal from "@/src/components/gis/AssetDetailModal"; // [REFACTOR] Import Modal Detail

import { assetService } from "@/src/app/services/asset.service";
import { useSourceStore } from "@/src/app/store/useSourceStore";

// Import MapPicker secara dinamis DILUAR fungsi komponen utama!
const MapPicker = dynamic(() => import("@/src/components/gis/MapPicker"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 border-4 border-[#0071bc] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Menyiapkan Kanvas Peta...</span>
        </div>
    )
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
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null); // [REFACTOR] State untuk Detail Modal

    // --- Form State ---
    const [editingAssetId, setEditingAssetId] = useState<number | null>(null); // [REFACTOR] State Edit Mode
    const [name, setName] = useState("");
    const [sourceId, setSourceId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // State Map Picker
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

    // Cleanup object URL
    useEffect(() => {
        if (!selectedImage) {
            // Jangan buang imagePreview jika sedang edit dan belum pilih gambar baru
            if (!editingAssetId) setImagePreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedImage);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage, editingAssetId]);

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

    // [REFACTOR] Fungsi membersihkan form (Cancel Edit)
    const resetForm = () => {
        setEditingAssetId(null);
        setName(""); setCategoryId(""); setSourceId(""); setDescription(""); setDistrictId("");
        setSelectedImage(null); setImagePreview(null); setLat(null); setLng(null); setFocusDistrict(null);
        setDetails([]);
    };

    // [REFACTOR] Fungsi menarik data ke Form untuk diedit
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
        setImagePreview(asset.image_url || null);
        setSelectedImage(null); // Reset input file baru
        setFocusDistrict(asset.district?.name || null);

        // Parse object details kembali ke array of objects untuk form
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
            setAlertMsg({ message: "Nama, Sumber OPD, Kategori, Distrik, dan Titik Koordinat (Peta) WAJIB diisi!", type: "danger" });
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

        const payloadData = {
            name,
            source_id: Number(sourceId),
            category_id: Number(categoryId),
            district_id: Number(districtId),
            lat,
            lng,
            description,
            image: selectedImage,
            details: formattedDetails
        };

        try {
            // [REFACTOR] Logika percabangan: Create atau Update
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
            if (editingAssetId === id) resetForm(); // Reset form jika yang dihapus sedang diedit
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

            {/* --- WORKSPACE GRID (KIRI: FORM, KANAN: PETA) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">

                {/* KOLOM KIRI: FORM INPUT */}
                <div className={`lg:col-span-5 bg-white rounded-3xl p-6 lg:p-8 border shadow-sm flex flex-col h-full transition-colors duration-300 ${editingAssetId ? 'border-amber-400 shadow-amber-100' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Building2 size={20} className={editingAssetId ? "text-amber-500" : "text-[#0071bc]"} />
                            <h3 className="text-base font-black text-gray-800 uppercase tracking-widest">
                                {editingAssetId ? "Update Data Aset" : "Informasi Aset Baru"}
                            </h3>
                        </div>
                        {editingAssetId && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold uppercase tracking-widest">
                                Mode Edit
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">

                        {/* Nama Aset */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama / Judul Aset <span className="text-red-500">*</span></label>
                            <input
                                type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting}
                                placeholder="Contoh: Puskesmas Wania"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all"
                            />
                        </div>

                        {/* Dropdown 2 Kolom */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori Aset <span className="text-red-500">*</span></label>
                                <select
                                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={isSubmitting}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button type="button" onClick={() => setShowCategoryModal(true)} disabled={isSubmitting} className="mt-2 ml-1 text-[10px] font-black text-[#0071bc] flex items-center gap-1 hover:underline uppercase tracking-widest">
                                    <Plus size={12} /> Tambah Kategori
                                </button>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kepemilikan <span className="text-red-500">*</span></label>
                                <select
                                    value={sourceId} onChange={(e) => setSourceId(e.target.value)} required disabled={isSubmitting}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                                >
                                    <option value="">Pilih OPD</option>
                                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Wilayah / Distrik */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lokasi Distrik <span className="text-red-500">*</span></label>
                            <select
                                value={districtId} onChange={handleDistrictChange} disabled={isSubmitting} required
                                className="w-full bg-blue-50 border border-blue-100 text-blue-900 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
                            >
                                <option value="">Pilih Distrik (Wajib)</option>
                                {MIMIKA_DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>

                        {/* Koordinat */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude <span className="text-red-500">*</span></label>
                                <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 font-mono">
                                    {lat ? lat.toFixed(6) : "Klik di Peta ➔"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude <span className="text-red-500">*</span></label>
                                <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 font-mono">
                                    {lng ? lng.toFixed(6) : "Klik di Peta ➔"}
                                </div>
                            </div>
                        </div>

                        {/* Keterangan / Deskripsi */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                                <span>Deskripsi Aset / Keterangan</span>
                                <span className="text-[9px] text-gray-300 font-normal normal-case italic">*Opsional</span>
                            </label>
                            <textarea
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                rows={2} disabled={isSubmitting}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] resize-none text-black placeholder:text-gray-400"
                                placeholder="Jelaskan kondisi, sejarah, atau fungsi spesifik aset ini..."
                            ></textarea>
                        </div>

                        {/* Upload Foto */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                                Foto Fisik Bangunan
                                {editingAssetId && imagePreview && <span className="text-amber-500 italic lowercase text-[9px]">Pilih foto baru untuk mengganti</span>}
                            </label>

                            {!imagePreview ? (
                                <div
                                    onClick={() => document.getElementById('asset-image')?.click()}
                                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group"
                                >
                                    <ImageIcon className="text-gray-400 group-hover:text-blue-500 mb-1" size={24} />
                                    <span className="text-[10px] text-gray-500 font-medium">Klik untuk upload (JPG/PNG)</span>
                                </div>
                            ) : (
                                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('asset-image')?.click()}
                                            className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md"
                                        >
                                            Ganti Foto
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <input id="asset-image" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} disabled={isSubmitting} />
                        </div>

                        {/* Dynamic Metadata (Key-Value) */}
                        <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data / Atribut Spesifik</label>
                                <button type="button" onClick={handleAddDetailRow} className="text-[10px] font-black uppercase text-[#0071bc] hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                                    <Plus size={12} /> Tambah Atribut Baru
                                </button>
                            </div>

                            {details.length === 0 && (
                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-[10px] text-gray-400 font-medium italic">Klik "Tambah Atribut Baru" jika ada spesifikasi khusus (misal: Kapasitas, Akreditasi, Status).</p>
                                </div>
                            )}

                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                {details.map((item, index) => (
                                    <div key={index} className="flex gap-2 animate-in slide-in-from-top-1">
                                        <input
                                            type="text" placeholder="Misal: Kapasitas" value={item.key} onChange={(e) => handleDetailChange(index, "key", e.target.value)} disabled={isSubmitting}
                                            className="w-1/3 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#0071bc] outline-none"
                                        />
                                        <input
                                            type="text" placeholder="Misal: 100 Orang" value={item.value} onChange={(e) => handleDetailChange(index, "value", e.target.value)} disabled={isSubmitting}
                                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#0071bc] outline-none"
                                        />
                                        <button
                                            type="button" onClick={() => handleRemoveDetailRow(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* [REFACTOR] ACTION BUTTONS */}
                        <div className="flex gap-3 mt-auto pt-4">
                            {editingAssetId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                    className="w-1/3 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit" disabled={isSubmitting}
                                className={`flex-1 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${editingAssetId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-[#0a2647] hover:bg-[#144272] shadow-blue-900/20'
                                    }`}
                            >
                                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
                                {isSubmitting ? "Menyimpan..." : (editingAssetId ? "Update Titik Aset" : "Simpan Titik Aset")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* KOLOM KANAN: MAP PICKER */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-3 border border-gray-200 shadow-sm h-125 lg:h-auto min-h-150 relative">
                    <MapPicker
                        onLocationSelect={(lt: number, ln: number) => { setLat(lt); setLng(ln); }}
                        selectedLat={lat}
                        selectedLng={lng}
                        focusDistrictName={focusDistrict}
                    />
                </div>

            </div>

            {/* --- TABEL RIWAYAT ASET BAWAH --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <List size={20} className="text-[#0071bc]" />
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Riwayat Aset Terdaftar</h3>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-200">
                        <thead className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Nama Aset</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Koordinat</th>
                                <th className="px-6 py-4">Tgl Dibuat</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {myAssets.length > 0 ? myAssets.map((a) => (
                                <tr key={a.id} className={`hover:bg-blue-50/30 transition-colors ${editingAssetId === a.id ? 'bg-amber-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {a.image_url ? (
                                                <img src={a.image_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                                    <Layers size={14} />
                                                </div>
                                            )}
                                            <span className="font-bold text-gray-800 truncate max-w-62.5">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-teal-100">
                                            {a.category?.name || "Umum"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {Number(a.lat).toFixed(4)}, {Number(a.lng).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                        {new Date(a.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedAsset(a)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(a)}
                                                className={`p-2 rounded-lg transition-colors ${editingAssetId === a.id ? 'text-amber-600 bg-amber-100' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                                                title="Edit Aset"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(a.id, a.name)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Aset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">
                                        <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Belum ada aset didaftarkan</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Kategori */}
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

            {/* [REFACTOR] Modal Detail Aset */}
            {selectedAsset && (
                <AssetDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                />
            )}
        </div>
    );
}