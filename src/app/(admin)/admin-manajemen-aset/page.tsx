// src/app/(admin)/manajemen-aset/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Trash2, Search, Building2, Layers, MapPin,
    AlertCircle, CheckCircle2, Filter, ShieldAlert, Eye
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import AssetDetailModal from "@/src/components/gis/AssetDetailModal"; // [REFACTOR] Import Modal Detail

import { assetService } from "@/src/app/services/asset.service";
import { useSourceStore } from "@/src/app/store/useSourceStore";

export default function AdminManajemenAsetPage() {
    // --- State ---
    const { sources, fetchSources } = useSourceStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [allAssets, setAllAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Filter & Search State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    // --- UI State ---
    const [alertMsg, setAlertMsg] = useState<{ message: string; type: "success" | "danger" } | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null); // [REFACTOR] State untuk Modal Detail

    // --- Initial Fetch ---
    useEffect(() => {
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
        loadData();
    }, [fetchSources]);

    // --- Logika Filter Data (O(N) Memoized) ---
    const filteredAssets = useMemo(() => {
        return allAssets.filter((asset) => {
            const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchSource = filterSource ? asset.source_id.toString() === filterSource : true;
            const matchCategory = filterCategory ? asset.category_id.toString() === filterCategory : true;

            return matchSearch && matchSource && matchCategory;
        });
    }, [allAssets, searchTerm, filterSource, filterCategory]);

    // --- Handlers ---
    const handleDelete = async (id: number, assetName: string, opdName: string) => {
        if (!window.confirm(`PERINGATAN ADMINISTRATOR:\n\nHapus aset "${assetName}" milik OPD ${opdName}?\nData yang terhapus tidak dapat dikembalikan dan akan lenyap dari peta publik.`)) {
            return;
        }

        try {
            await assetService.deleteAsset(id);
            setAllAssets(allAssets.filter(a => a.id !== id));
            setAlertMsg({ message: `Aset "${assetName}" berhasil dihapus dari sistem.`, type: "success" });
            setTimeout(() => setAlertMsg(null), 4000);
        } catch (err) {
            setAlertMsg({ message: "Gagal menghapus aset. Silakan coba lagi.", type: "danger" });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#f4f7fb] min-h-screen p-4 md:p-8">
                <PageHeader title="Moderasi Aset Spasial" subtitle="Menyiapkan data geospasial..." />
                <LoadingState message="Mengumpulkan koordinat aset seluruh OPD..." />
            </div>
        );
    }

    return (
        <div className="bg-[#f4f7fb] min-h-screen font-sans text-black p-4 md:p-6 lg:p-8 pb-20">
            <PageHeader
                title="Moderasi Aset Spasial"
                subtitle="Kontrol penuh untuk memantau, memverifikasi, dan menghapus titik GeoTagging dari seluruh Instansi/OPD."
            />

            {alertMsg && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${alertMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    {alertMsg.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
                    <span className="text-sm font-semibold">{alertMsg.message}</span>
                </div>
            )}

            {/* --- ACTION BAR & FILTERS --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                {/* Search Input */}
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama aset..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative flex-1 sm:w-64">
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

                    <div className="relative flex-1 sm:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071bc] appearance-none"
                        >
                            <option value="">Kategori Asset</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- INFO SUMMARY --- */}
            <div className="mb-4 px-2 flex justify-between items-center text-sm font-bold text-gray-500">
                <span>
                    Menampilkan <span className="text-[#0071bc]">{filteredAssets.length}</span> dari {allAssets.length} Aset Terdaftar
                </span>
            </div>

            {/* --- FULL WIDTH TABLE --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-225">
                        <thead className="bg-slate-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-5">Nama Aset & Foto</th>
                                <th className="px-6 py-5">Pemilik (OPD)</th>
                                <th className="px-6 py-5">Kategori</th>
                                <th className="px-6 py-5">Koordinat (Lat, Lng)</th>
                                <th className="px-6 py-5">Tgl Register</th>
                                <th className="px-6 py-5 text-center">Aksi Moderasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets.length > 0 ? filteredAssets.map((a) => (
                                <tr key={a.id} className="hover:bg-blue-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {a.image_url ? (
                                                <img src={a.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                                    <Layers size={16} />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-[#0071bc] transition-colors truncate max-w-62.5">
                                                    {a.name}
                                                </span>
                                                <span className="text-[10px] font-medium text-gray-400 truncate max-w-62.5">
                                                    ID: #{a.id} • {a.district?.name || "Titik Bebas"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-slate-400" />
                                            <span className="font-bold text-slate-700">{a.owner?.name || "Tidak Diketahui"}</span>
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
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 bg-slate-50/50">
                                        {Number(a.lat).toFixed(5)}, {Number(a.lng).toFixed(5)}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                        {new Date(a.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            {/* [REFACTOR] Tombol Detail untuk Admin */}
                                            <button
                                                onClick={() => setSelectedAsset(a)}
                                                className="inline-flex items-center justify-center p-2 border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-[#0071bc] rounded-xl transition-all shadow-sm active:scale-95"
                                                title="Lihat Detail Aset"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(a.id, a.name, a.owner?.name)}
                                                className="inline-flex items-center justify-center p-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                title="Hapus Paksa Aset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
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

            {/* [REFACTOR] Menampilkan Modal Detail */}
            {selectedAsset && (
                <AssetDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                />
            )}
        </div>
    );
}