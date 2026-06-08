// src/app/(admin)/admin-manajemen-aset/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Trash2, Search, Building2, Layers, MapPin,
    AlertCircle, CheckCircle2, Filter, Eye, Check, X,
    ShieldAlert
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import AssetDetailModal from "@/src/components/gis/AssetDetailModal";

import { assetService } from "@/src/app/services/asset.service";
import { useSourceStore } from "@/src/app/store/useSourceStore";

export default function AdminManajemenAsetPage() {
    // --- State ---
    const { sources, fetchSources } = useSourceStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [allAssets, setAllAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null); // State loading per-item

    // --- Filter & Search State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); // [REFACTOR FASE 4.4] Filter Status Moderasi

    // --- UI State ---
    const [alertMsg, setAlertMsg] = useState<{ message: string; type: "success" | "danger" } | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    // --- Initial Fetch ---
    const loadData = async () => {
        try {
            await fetchSources();
            const cats = await assetService.getAssetCategories();
            setCategories(cats);

            // Mengambil semua aset lintas OPD tanpa difilter.
            const assets = await assetService.getAllAssets();
            setAllAssets(assets);
        } catch (err) {
            console.error("Gagal memuat data master:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchSources]);

    // --- Logika Filter Data (O(N) Memoized) ---
    const filteredAssets = useMemo(() => {
        return allAssets.filter((asset) => {
            const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchSource = filterSource ? asset.source_id.toString() === filterSource : true;
            const matchCategory = filterCategory ? asset.category_id.toString() === filterCategory : true;
            const matchStatus = filterStatus ? asset.status === filterStatus : true; // [REFACTOR FASE 4.4]

            return matchSearch && matchSource && matchCategory && matchStatus;
        });
    }, [allAssets, searchTerm, filterSource, filterCategory, filterStatus]);

    // --- Handlers: Moderation Workflow ---
    const handleModerate = async (id: number, status: "approved" | "rejected", assetName: string) => {
        const actionText = status === "approved" ? "MENYETUJUI" : "MENOLAK";
        if (!window.confirm(`Konfirmasi Tindakan:\n\nApakah Anda yakin ingin ${actionText} aset "${assetName}"?\nStatus akan berubah dan OPD akan melihat perubahan ini.`)) {
            return;
        }

        setIsActionLoading(id);
        try {
            await assetService.moderateAsset(id, status);
            setAlertMsg({ message: `Aset "${assetName}" berhasil di-${status === 'approved' ? 'Setujui' : 'Tolak'}.`, type: "success" });

            // Re-fetch data secara halus (optimistic update lebih baik jika memungkinkan, tapi re-fetch lebih aman)
            await loadData();
            setTimeout(() => setAlertMsg(null), 4000);
        } catch (err: any) {
            setAlertMsg({ message: err.message || "Gagal mengubah status aset. Silakan coba lagi.", type: "danger" });
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDelete = async (id: number, assetName: string, opdName: string) => {
        if (!window.confirm(`PERINGATAN ADMINISTRATOR:\n\nHapus PERMANEN aset "${assetName}" milik OPD ${opdName}?\nData yang terhapus tidak dapat dikembalikan dan akan lenyap dari peta publik.`)) {
            return;
        }

        setIsActionLoading(id);
        try {
            await assetService.deleteAsset(id);
            setAllAssets(allAssets.filter(a => a.id !== id));
            setAlertMsg({ message: `Aset "${assetName}" berhasil dihapus dari sistem.`, type: "success" });
            setTimeout(() => setAlertMsg(null), 4000);
        } catch (err) {
            setAlertMsg({ message: "Gagal menghapus aset. Silakan coba lagi.", type: "danger" });
        } finally {
            setIsActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-8">
                <PageHeader title="Moderasi Aset Spasial" subtitle="Menyiapkan meja kerja administrator..." />
                <LoadingState message="Mengumpulkan koordinat aset seluruh OPD..." />
            </div>
        );
    }

    // Helper untuk merender Status Badge
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={10} /> Disetujui</span>;
            case "rejected":
                return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"><AlertCircle size={10} /> Ditolak</span>;
            default:
                return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"><AlertCircle size={10} /> Menunggu</span>;
        }
    };

    return (
        <div className="bg-[#f4f7fb] min-h-screen font-sans text-black p-4 md:p-6 lg:p-8 pb-20">
            <PageHeader
                title="Moderasi Aset Spasial"
                subtitle="Kontrol penuh untuk memantau, memverifikasi, dan mengatur tayangan titik GeoTagging OPD ke Peta Publik."
            />

            {alertMsg && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${alertMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    {alertMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-semibold">{alertMsg.message}</span>
                </div>
            )}

            {/* --- ACTION BAR & FILTERS --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center mb-6">

                {/* Search Input */}
                <div className="relative w-full xl:w-1/4 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama aset..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all"
                    />
                </div>

                {/* Filter Dropdowns (Multi-Kolom) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto flex-1 xl:max-w-3xl">
                    <div className="relative w-full">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071bc] appearance-none"
                        >
                            <option value="">Semua Instansi (OPD)</option>
                            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="relative w-full">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071bc] appearance-none"
                        >
                            <option value="">Kategori Aset</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* [REFACTOR] Tambahan Filter Status Moderasi */}
                    <div className="relative w-full">
                        <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071bc] appearance-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu Persetujuan</option>
                            <option value="approved">Telah Disetujui (Tayang)</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- INFO SUMMARY --- */}
            <div className="mb-4 px-2 flex justify-between items-center text-sm font-bold text-gray-500">
                <span>
                    Menampilkan <span className="text-[#0071bc]">{filteredAssets.length}</span> dari {allAssets.length} Aset Terdaftar
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded">
                    {allAssets.filter(a => a.status === 'pending').length} Aset Butuh Tinjauan
                </span>
            </div>

            {/* --- FULL WIDTH TABLE --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-250">
                        <thead className="bg-slate-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-5">Nama Aset & Status</th>
                                <th className="px-6 py-5">Pemilik (OPD)</th>
                                <th className="px-6 py-5">Kategori</th>
                                <th className="px-6 py-5">Lokasi (Distrik / Kordinat)</th>
                                <th className="px-6 py-5 text-right">Tindakan Moderasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets.length > 0 ? filteredAssets.map((a) => (
                                <tr key={a.id} className={`hover:bg-blue-50/40 transition-colors group ${a.status === 'pending' ? 'bg-amber-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {a.image_url ? (
                                                <img src={a.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                                    <Layers size={18} />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-900 group-hover:text-[#0071bc] transition-colors truncate max-w-50">
                                                    {a.name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {renderStatusBadge(a.status)}
                                                    <span className="text-[9px] font-medium text-gray-400">ID: #{a.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-slate-400" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">{a.owner?.name || "Tidak Diketahui"}</span>
                                                <span className="text-[9px] text-gray-400 font-medium">Uploader: User #{a.user_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-opacity-10"
                                            style={{
                                                color: a.category?.color || '#0071bc',
                                                borderColor: a.category?.color || '#0071bc',
                                                backgroundColor: a.category?.color ? `${a.category.color}20` : '#e0f2fe'
                                            }}
                                        >
                                            {a.category?.name || "Umum"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{a.district?.name || "Tanpa Distrik"}</span>
                                            <span className="text-[10px] font-mono text-slate-500 mt-0.5">{Number(a.lat).toFixed(5)}, {Number(a.lng).toFixed(5)}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        {isActionLoading === a.id ? (
                                            <div className="flex justify-end pr-4">
                                                <div className="w-5 h-5 border-2 border-[#0071bc] border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">

                                                {/* Tombol Lihat Detail */}
                                                <button
                                                    onClick={() => setSelectedAsset(a)}
                                                    className="inline-flex items-center justify-center p-2 border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-[#0071bc] rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="Periksa Metadata & Foto"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {/* Logika Moderasi: Hanya muncul jika statusnya bukan 'approved' */}
                                                {a.status !== "approved" && (
                                                    <button
                                                        onClick={() => handleModerate(a.id, "approved", a.name)}
                                                        className="inline-flex items-center justify-center p-2 border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                        title="Setujui dan Tayangkan"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}

                                                {/* Logika Moderasi: Hanya muncul jika statusnya bukan 'rejected' */}
                                                {a.status !== "rejected" && (
                                                    <button
                                                        onClick={() => handleModerate(a.id, "rejected", a.name)}
                                                        className="inline-flex items-center justify-center p-2 border border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                        title="Tolak Aset"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}

                                                {/* Pemisah Khusus Hapus Permanen */}
                                                <div className="w-px h-6 bg-slate-200 mx-1 self-center"></div>

                                                <button
                                                    onClick={() => handleDelete(a.id, a.name, a.owner?.name)}
                                                    className="inline-flex items-center justify-center p-2 border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="Hapus Permanen dari Database"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <MapPin size={48} className="mb-4 text-slate-500" />
                                            <h3 className="text-lg font-black text-slate-700 uppercase tracking-widest">Tidak Ada Data Aset</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-2">Ubah filter pencarian Anda atau tunggu OPD menginput data.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="mt-10 text-center text-gray-400 text-[10px] uppercase tracking-[0.3em] pb-6">
                Sistem Moderasi Spasial - Administrator Mimika DataHub
            </footer>

            {/* Menampilkan Modal Detail */}
            {selectedAsset && (
                <AssetDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                />
            )}
        </div>
    );
}