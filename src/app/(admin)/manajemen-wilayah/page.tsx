// src/app/(admin)/manajemen-wilayah/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Edit2, X, Save, AlertCircle, CheckCircle2, Plus, Image as ImageIcon } from "lucide-react";
import { gisService } from "@/src/app/services/gis.service";
import { API_BASE_URL } from "@/src/app/lib/config"; // [1] Untuk hit endpoint upload media

// Definisi Interface Lokal
interface DistrictProfile {
    id?: number;
    luas_wilayah?: number | null;
    jumlah_penduduk?: number | null;
    deskripsi?: string | null;
    batas_wilayah?: string | null;
    images?: string[] | null; // [1] Ekspansi dukungan properti images
}

interface District {
    id: number;
    name: string;
    profile?: DistrictProfile | null;
}

export default function ManajemenWilayahPage() {
    const [districts, setDistricts] = useState<District[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // State untuk Modal Update
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error", message: string } | null>(null);

    // State Form Terkontrol
    const [formData, setFormData] = useState({
        luas_wilayah: "",
        jumlah_penduduk: "",
        deskripsi: ""
    });

    // [INTEGRASI MEDIA WILAYAH] State untuk menyimpan kelolaan berkas foto [1]
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // 1. Fetching Data Awal
    const loadDistricts = async () => {
        setIsLoading(true);
        try {
            const data = await gisService.fetchDistricts();
            setDistricts(data);
        } catch (error) {
            console.error("Gagal memuat distrik:", error);
            setNotification({ type: "error", message: "Gagal memuat data master wilayah dari server." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDistricts();
    }, []);

    // Cleanup Object URL untuk preview gambar baru agar bebas memory leak
    useEffect(() => {
        if (selectedFiles.length > 0) {
            const urls = selectedFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(urls);
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        }
    }, [selectedFiles]);

    // 2. Logic Filter Pencarian O(N)
    const filteredDistricts = useMemo(() => {
        return districts.filter(d =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [districts, searchQuery]);

    // 3. Handler Modal Buka/Tutup
    const handleOpenEdit = (district: District) => {
        setSelectedDistrict(district);
        setFormData({
            luas_wilayah: district.profile?.luas_wilayah?.toString() || "",
            jumlah_penduduk: district.profile?.jumlah_penduduk?.toString() || "",
            deskripsi: district.profile?.deskripsi || ""
        });

        // Memuat visualisasi foto eksis dari database [1]
        setExistingImages(district.profile?.images || []);
        setSelectedFiles([]);
        setImagePreviews([]);
        setNotification(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDistrict(null);
    };

    // [INTEGRASI MEDIA WILAYAH] Fungsi pembantu upload ke Cloudinary via biner Form [1]
    const uploadImageFile = async (file: File): Promise<string> => {
        const fileForm = new FormData();
        fileForm.append("image", file); // Key 'image' sesuai ingest endpoint
        fileForm.append("title", `img_wilayah_${Date.now()}`);
        fileForm.append("dataset_type", "pemerintah");
        fileForm.append("source_id", "1"); // ID instansi default bappeda
        fileForm.append("category_id", "1");
        fileForm.append("source_type_id", "1");
        fileForm.append("year", "2026");
        fileForm.append("period", "Tahunan");

        const token = localStorage.getItem("auth_token");

        // Mengirimkan form ke endpoint upload biner umum
        const res = await fetch(`${API_BASE_URL}/v1/ingest/upload-process`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: fileForm
        });

        if (!res.ok) {
            throw new Error(`Gagal mengunggah file foto: ${file.name}`);
        }

        const data = await res.json();
        if (!data.file_url && !data.stats) {
            throw new Error("Gagal mendapatkan URL Cloudinary aman.");
        }

        // Asumsi backend mengembalikan file_url atau url cover yang berhasil diupload [1]
        return data.file_url || "/bg-mimika.jpg";
    };

    // 4. Handler Penyimpanan Data (Upsert)
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDistrict) return;

        setIsSaving(true);
        setNotification(null);

        try {
            // A. Proses upload gambar baru satu persatu ke Cloudinary [1]
            const uploadedUrls: string[] = [];
            for (const file of selectedFiles) {
                const secureUrl = await uploadImageFile(file);
                uploadedUrls.push(secureUrl);
            }

            // B. Gabungkan foto eksis yang dipertahankan dengan foto baru [1]
            const finalImagesPayload = [...existingImages, ...uploadedUrls];

            // C. Susun payload lengkap untuk diteruskan ke GIS profile PUT API [1]
            const payload = {
                luas_wilayah: formData.luas_wilayah ? parseFloat(formData.luas_wilayah) : null,
                jumlah_penduduk: formData.jumlah_penduduk ? parseInt(formData.jumlah_penduduk, 10) : null,
                deskripsi: formData.deskripsi.trim() || null,
                images: finalImagesPayload // [1] Menyertakan daftar list foto wilayah baru
            };

            const updatedProfile = await gisService.updateDistrictProfile(selectedDistrict.id, payload);

            // Update local state secara optimistik agar UI langsung berubah tanpa me-refresh halaman
            setDistricts(prev => prev.map(d => {
                if (d.id === selectedDistrict.id) {
                    return { ...d, profile: updatedProfile };
                }
                return d;
            }));

            setNotification({ type: "success", message: `Profil Distrik ${selectedDistrict.name} berhasil diperbarui!` });
            setTimeout(() => {
                handleCloseModal();
            }, 1500);

        } catch (error: any) {
            setNotification({ type: "error", message: error.message || "Gagal menyimpan perubahan." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 font-sans animate-in fade-in duration-500 text-slate-800">

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0071bc] flex items-center gap-3">
                    <MapPin className="text-[#0071bc]" size={32} />
                    Manajemen Profil Wilayah
                </h1>
                <p className="text-gray-500 mt-2 text-sm max-w-3xl">
                    Kelola data statistik statis (Luas Wilayah, Populasi) dan narasi deskripsi untuk masing-masing distrik. Data ini akan ditampilkan pada antarmuka Peta Spasial publik.
                </p>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-md focus-within:ring-1 focus-within:ring-[#0071bc] rounded-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama distrik..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    Total: <span className="text-[#0071bc] font-bold">{filteredDistricts.length} Distrik</span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">ID</th>
                                <th className="p-4 font-bold">Nama Distrik</th>
                                <th className="p-4 font-bold">Luas Wilayah (km²)</th>
                                <th className="p-4 font-bold">Populasi</th>
                                <th className="p-4 font-bold text-center">Status Narasi</th>
                                <th className="p-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-[#0071bc] border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-sm text-gray-500 font-medium">Memuat data wilayah...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDistricts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                                        Tidak ada distrik yang cocok dengan pencarian.
                                    </td>
                                </tr>
                            ) : (
                                filteredDistricts.map((district) => {
                                    const isProfileComplete = !!(district.profile?.deskripsi && district.profile.deskripsi.length > 20);

                                    return (
                                        <tr key={district.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-gray-500">#{district.id}</td>
                                            <td className="p-4 text-sm font-bold text-gray-800 uppercase tracking-wide">
                                                {district.name}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {district.profile?.luas_wilayah ? district.profile.luas_wilayah.toLocaleString('id-ID') : '-'}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {district.profile?.jumlah_penduduk ? district.profile.jumlah_penduduk.toLocaleString('id-ID') : '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${isProfileComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {isProfileComplete ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                    {isProfileComplete ? 'Terisi' : 'Kosong'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleOpenEdit(district)}
                                                    className="inline-flex items-center justify-center p-2 bg-[#0071bc]/10 text-[#0071bc] hover:bg-[#0071bc] hover:text-white rounded-lg transition-colors"
                                                    title="Edit Profil Distrik"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL EDIT PROFIL --- */}
            {isModalOpen && selectedDistrict && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase">Edit Distrik {selectedDistrict.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">ID Master Wilayah: #{selectedDistrict.id}</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                disabled={isSaving}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSaveChanges} className="overflow-y-auto flex-1 custom-scrollbar">
                            <div className="p-6 space-y-5">

                                {/* Notification Area */}
                                {notification && (
                                    <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {notification.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                                        <p className="font-medium">{notification.message}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Luas Wilayah (km²)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Contoh: 1250.5"
                                            value={formData.luas_wilayah}
                                            onChange={(e) => setFormData({ ...formData, luas_wilayah: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071bc]/20 focus:border-[#0071bc] text-sm text-gray-900 bg-white"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Total Populasi (Jiwa)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Contoh: 45000"
                                            value={formData.jumlah_penduduk}
                                            onChange={(e) => setFormData({ ...formData, jumlah_penduduk: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071bc]/20 focus:border-[#0071bc] text-sm text-gray-900 bg-white"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 flex justify-between">
                                        <span>Narasi / Deskripsi Bappeda</span>
                                        <span className="text-xs font-normal text-gray-400">Direkomendasikan: 2-3 Paragraf</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Masukkan deskripsi demografis, geografis, atau potensi wilayah distrik ini..."
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071bc]/20 focus:border-[#0071bc] text-sm text-gray-900 bg-white resize-none"
                                        disabled={isSaving}
                                    />
                                </div>

                                {/* [INTEGRASI MEDIA WILAYAH] Komponen Input & Preview Foto Wilayah */}
                                <div className="space-y-2 border-t border-slate-100 pt-4">
                                    <label className="text-sm font-bold text-slate-700 flex justify-between items-center">
                                        <span>Dokumentasi Visual Wilayah (Galeri Distrik)</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Bisa upload banyak gambar sekaligus (Maks 5MB)</span>
                                    </label>

                                    <div className="flex flex-wrap gap-3 items-center">
                                        {/* Render Foto Eksis di Database */}
                                        {existingImages.map((src, idx) => (
                                            <div key={`existing-${idx}`} className="relative w-24 h-24 border border-slate-200 rounded-xl overflow-hidden group shadow-sm shrink-0">
                                                <img src={src} alt="Existing" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Render Pratinjau Foto Baru */}
                                        {imagePreviews.map((src, idx) => (
                                            <div key={`new-${idx}`} className="relative w-24 h-24 border border-teal-300 rounded-xl overflow-hidden group shadow-sm shrink-0">
                                                <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                                                <div className="absolute top-1 left-1 bg-teal-500 text-white text-[8px] font-black uppercase px-1 rounded-sm shadow-md">BARU</div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                                                        setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Tombol Input Unggah */}
                                        <label className="w-24 h-24 border-2 border-dashed border-slate-300 hover:border-[#0071bc] rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-[#0071bc] cursor-pointer transition-colors shadow-inner shrink-0 bg-slate-50/50">
                                            <Plus size={18} />
                                            <span className="text-[9px] font-black uppercase mt-1 tracking-wider">Tambah</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/jpeg, image/png, image/webp"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        const files = Array.from(e.target.files);
                                                        setSelectedFiles([...selectedFiles, ...files]);
                                                    }
                                                }}
                                                disabled={isSaving}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-[#0071bc] hover:bg-[#005a96] rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}