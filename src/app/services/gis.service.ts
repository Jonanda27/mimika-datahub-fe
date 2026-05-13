// src/app/services/gis.service.ts
import { API_BASE_URL } from "../lib/config";
import { SpatialStatResponse, DistrictDrilldownResponse } from "../types/gis";

/**
 * Service untuk menangani pengambilan data spasial/GIS.
 */
export const gisService = {
    /**
     * Mengambil data statistik distribusi dataset per distrik.
     * Digunakan untuk pewarnaan peta tematik (Choropleth).
     * @param categoryId - Filter berdasarkan ID Kategori (opsional)
     * @param year - Filter berdasarkan Tahun (opsional)
     */
    fetchGisStats: async (categoryId?: number, year?: number): Promise<SpatialStatResponse[]> => {
        try {
            const token = localStorage.getItem("auth_token");
            const queryParams = new URLSearchParams();

            if (categoryId) queryParams.append("category_id", categoryId.toString());
            if (year) queryParams.append("year", year.toString());

            const queryString = queryParams.toString();
            const url = `${API_BASE_URL}/v1/gis/stats${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data GIS: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching GIS stats:", error);
            throw error;
        }
    },

    /**
     * Mengambil detail statistik per distrik (total baris & kualitas).
     * Digunakan untuk kebutuhan Tooltip atau Pop-up pada peta.
     */
    fetchDetailedGisStats: async (categoryId?: number): Promise<any[]> => {
        try {
            const token = localStorage.getItem("auth_token");
            const queryParams = new URLSearchParams();

            if (categoryId) queryParams.append("category_id", categoryId.toString());

            const queryString = queryParams.toString();
            const url = `${API_BASE_URL}/v1/gis/stats/detail${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil detail GIS: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching detailed GIS stats:", error);
            throw error;
        }
    },

    /**
     * Action Logics: Drilldown Spasial
     * Mengambil data Drill-down spesifik untuk sebuah distrik.
     * Meliputi narasi profil wilayah statis dan kepadatan dataset per kategori.
     * Digunakan saat user mengklik poligon distrik di peta.
     * * @param districtId - ID dari Distrik yang diklik
     */
    fetchDistrictDrilldown: async (districtId: number): Promise<DistrictDrilldownResponse> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/gis/district/${districtId}/drilldown`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data Drilldown Distrik: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error fetching drilldown for district ${districtId}:`, error);
            throw error;
        }
    },

    // ==========================================
    // FASE 1: MANAJEMEN PROFIL WILAYAH (ADMIN)
    // ==========================================

    /**
     * Mengambil daftar seluruh distrik dari Master Bappeda
     */
    fetchDistricts: async (): Promise<any[]> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/gis/districts`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data master distrik: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching districts:", error);
            throw error;
        }
    },

    /**
     * Menyimpan atau mengupdate profil kewilayahan
     * @param districtId - ID dari Distrik yang akan diupdate
     * @param payload - Object berisi luas_wilayah, jumlah_penduduk, deskripsi
     */
    updateDistrictProfile: async (districtId: number, payload: any): Promise<any> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/gis/district/${districtId}/profile`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Gagal memperbarui profil distrik: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error updating profile for district ${districtId}:`, error);
            throw error;
        }
    }
};