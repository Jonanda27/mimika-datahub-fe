// src/app/services/asset.service.ts

import { API_BASE_URL } from "../lib/config";

/**
 * Interface Payload untuk mengirim data aset baru (FormData).
 * Mengapa FormData? Karena kita mendukung upload file gambar fisik.
 */
export interface CreateAssetPayload {
    name: string;
    source_id: number;
    category_id: number;
    district_id: number | null;
    lat: number;
    lng: number;
    description: string;
    image: File | null;
    details: Record<string, string>; // Dynamic metadata (contoh: {"Kapasitas": "100", "Status": "Aktif"})
}

export const assetService = {
    /**
     * Helper internal untuk mengambil header otorisasi standar.
     */
    getAuthHeaders() {
        const token = localStorage.getItem("auth_token");
        return {
            "Authorization": `Bearer ${token}`
            // Jangan tambahkan "Content-Type": "application/json" jika mengirim FormData!
        };
    },

    /**
     * Mengambil daftar kategori aset (Master Data).
     * Contoh: Rumah Sakit, Puskesmas, Jembatan, dll.
     */
    async getAssetCategories() {
        const response = await fetch(`${API_BASE_URL}/v1/assets/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...this.getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data kategori aset");
        }
        return response.json();
    },

    /**
     * Mendaftarkan kategori aset baru ke dalam sistem.
     */
    async createAssetCategory(name: string, iconUrl?: string, color: string = "#0071bc") {
        const response = await fetch(`${API_BASE_URL}/v1/assets/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.getAuthHeaders()
            },
            body: JSON.stringify({ name, icon_url: iconUrl, color })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Gagal membuat kategori aset baru");
        }
        return response.json();
    },

    /**
     * Mendaftarkan Aset Fisik / Hasil GeoTagging baru.
     * Menggunakan FormData karena melibatkan file gambar.
     */
    async createAsset(payload: CreateAssetPayload) {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("source_id", payload.source_id.toString());
        formData.append("category_id", payload.category_id.toString());
        formData.append("lat", payload.lat.toString());
        formData.append("lng", payload.lng.toString());

        if (payload.district_id) formData.append("district_id", payload.district_id.toString());
        if (payload.description) formData.append("description", payload.description);
        if (payload.image) formData.append("image", payload.image);

        if (Object.keys(payload.details).length > 0) {
            formData.append("details", JSON.stringify(payload.details));
        }

        const response = await fetch(`${API_BASE_URL}/v1/assets/`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.detail || "Gagal menyimpan data aset ke server");
        }
        return response.json();
    },

    /**
     * [REFACTOR] Melakukan Update pada Aset yang sudah ada
     */
    async updateAsset(assetId: number, payload: CreateAssetPayload) {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("source_id", payload.source_id.toString());
        formData.append("category_id", payload.category_id.toString());
        formData.append("lat", payload.lat.toString());
        formData.append("lng", payload.lng.toString());

        if (payload.district_id) formData.append("district_id", payload.district_id.toString());
        if (payload.description) formData.append("description", payload.description);

        // Hanya append image jika user memilih foto baru
        if (payload.image) {
            formData.append("image", payload.image);
        }

        if (Object.keys(payload.details).length > 0) {
            formData.append("details", JSON.stringify(payload.details));
        }

        const response = await fetch(`${API_BASE_URL}/v1/assets/${assetId}`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.detail || "Gagal memperbarui data aset di server");
        }
        return response.json();
    },

    /**
     * Mengambil daftar aset yang pernah didaftarkan oleh OPD tersebut.
     */
    async getMyAssets() {
        const response = await fetch(`${API_BASE_URL}/v1/assets/my-assets`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...this.getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil riwayat aset Anda");
        }
        return response.json();
    },

    /**
     * Endpoint khusus untuk Admin (Melihat Semua Data)
     */
    async getAllAssets() {
        const response = await fetch(`${API_BASE_URL}/v1/assets/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...this.getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data seluruh aset untuk moderasi");
        }
        return response.json();
    },

    /**
     * Menghapus sebuah aset dari sistem berdasarkan ID-nya.
     */
    async deleteAsset(assetId: number) {
        const response = await fetch(`${API_BASE_URL}/v1/assets/${assetId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...this.getAuthHeaders()
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Gagal menghapus data aset");
        }
        return response.json();
    },

    /**
     * API UNTUK EXPLORER SPATIAL (FRONTEND PUBLIK).
     */
    async getPublicAssets() {
        const response = await fetch(`${API_BASE_URL}/v1/assets/public`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Gagal memuat koordinat aset spasial dari server");
        }
        return response.json();
    }
};