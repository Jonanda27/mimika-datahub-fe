// src/app/services/atlas.service.ts
import { API_BASE_URL } from "../lib/config";
import { AtlasIndicatorResponse, AtlasIndicatorBrief } from "@/src/app/types/atlas";

/**
 * Service layer (Pure Fabrication) untuk menangani komunikasi data Atlas
 * antara Frontend dan API Backend.
 */
export const atlasService = {
    /**
     * Mengambil data spasial dan metadata narasi untuk indikator tertentu.
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
                // Ekstraksi pesan error dari Backend FastAPI jika tersedia
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Gagal mengambil data indikator atlas: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`[AtlasService] Error fetching indicator [${indicatorType}]:`, error);
            throw error; // Lempar ke store untuk ditangani (Controller)
        }
    },

    /**
     * Mengambil daftar seluruh indikator (headers) yang tersedia di database.
     * Berguna jika kita ingin membuat fitur pencarian/filter dinamis.
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
            console.error("[AtlasService] Error fetching indicator list:", error);
            throw error;
        }
    },

    /**
     * Mengambil metadata ringkas untuk inisialisasi awal.
     * Memberikan informasi dasar (judul, satuan, skema warna) tanpa menarik data spasial penuh.
     */
    fetchAllMetadata: async (): Promise<AtlasIndicatorBrief[]> => {
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
            console.error("[AtlasService] Error fetching all metadata:", error);
            throw error;
        }
    }
};