// src/app/services/atlas.service.ts
import { API_BASE_URL } from "../lib/config";
import { AtlasIndicatorResponse } from "../types/atlas"; // Kita asumsikan interface ditambahkan di types/gis

/**
 * Service untuk menangani pengambilan data agregat khusus Atlas (Scrollytelling).
 */
export const atlasService = {
    /**
     * Mengambil data spasial dan metadata untuk indikator tertentu.
     * Digunakan untuk merender Peta Choropleth di halaman Atlas.
     * @param indicatorType - Key indikator (contoh: 'stunting', 'pdrb', 'jumlah_penduduk')
     */
    fetchIndicatorData: async (indicatorType: string): Promise<AtlasIndicatorResponse> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/atlas/indicators/${indicatorType}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Gagal mengambil data indikator atlas: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error fetching atlas indicator [${indicatorType}]:`, error);
            throw error;
        }
    },

    /**
     * Mengambil daftar seluruh indikator (headers) yang tersedia di database.
     */
    fetchAvailableIndicators: async (): Promise<string[]> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/atlas/indicators/list`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil daftar indikator: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching indicator list:", error);
            throw error;
        }
    },

    /**
     * Mengambil metadata ringkas untuk inisialisasi awal.
     */
    fetchAllMetadata: async (): Promise<any[]> => {
        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/atlas/indicators/meta/all`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil metadata atlas: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching all metadata:", error);
            throw error;
        }
    }
};