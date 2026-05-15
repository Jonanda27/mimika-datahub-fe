// src/app/services/gis.service.ts
import { API_BASE_URL } from "../lib/config";
import { SpatialStatResponse, DistrictDrilldownResponse } from "../types/gis";

/**
 * Konfigurasi Sakelar Mock (Fase 5: Indirection)
 * Memungkinkan Frontend berjalan tanpa bergantung pada Backend API.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_EXPLORER === "true";

/**
 * Helper: Simulasi Latensi Jaringan (Best Practice Simulasi BE)
 */
const simulateDelay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Service untuk menangani pengambilan data spasial/GIS.
 */
export const gisService = {
    /**
     * Mengambil data statistik distribusi dataset per distrik.
     * Digunakan untuk pewarnaan peta tematik (Choropleth).
     */
    fetchGisStats: async (categoryId?: number, year?: number): Promise<SpatialStatResponse[]> => {
        if (USE_MOCK) {
            await simulateDelay(600);
            // Data simulasi kepadatan dataset untuk 18 distrik
            return [
                { district_name: "Mimika Baru", total_dataset: 45, avg_quality: 88 },
                { district_name: "Kuala Kencana", total_dataset: 32, avg_quality: 90 },
                { district_name: "Wania", total_dataset: 28, avg_quality: 75 },
                { district_name: "Tembagapura", total_dataset: 15, avg_quality: 95 },
                { district_name: "Iwaka", total_dataset: 12, avg_quality: 60 },
                // ... distrik lainnya disimulasikan secara dinamis
            ] as SpatialStatResponse[];
        }

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
     * Mengambil detail statistik per distrik.
     */
    fetchDetailedGisStats: async (categoryId?: number): Promise<any[]> => {
        if (USE_MOCK) {
            await simulateDelay(1000);
            return [{ district_name: "Mock District", total_rows: 5000, avg_quality: 85 }];
        }

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
     * Action Logics: Drilldown Spasial (GFW Paradigm)
     * Mengambil data profil wilayah dan kepadatan sektoral.
     */
    fetchDistrictDrilldown: async (districtId: number): Promise<DistrictDrilldownResponse> => {
        if (USE_MOCK) {
            await simulateDelay(1200);
            // Mock Data Patuh pada Interface Fase 1
            return {
                district_id: districtId,
                district_name: "Distrik Mimika Baru (Simulasi)",
                profile: {
                    id: districtId,
                    luas_wilayah: 2216,
                    jumlah_penduduk: 142000,
                    deskripsi: "Distrik Mimika Baru merupakan pusat pertumbuhan ekonomi dan pemerintahan di Kabupaten Mimika. Wilayah ini memiliki tingkat densitas data tertinggi dengan fokus pada sektor jasa dan perdagangan.",
                    batas_wilayah: "Utara: Distrik Iwaka, Selatan: Laut Arafuru",
                },
                categories: [
                    { category_id: 1, name: "Kesehatan", total: 12 },
                    { category_id: 2, name: "Pendidikan", total: 8 },
                    { category_id: 3, name: "Infrastruktur", total: 15 },
                ],
                last_updated: new Date().toISOString()
            } as DistrictDrilldownResponse;
        }

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

    /**
     * Mengambil daftar seluruh distrik dari Master Bappeda
     */
    fetchDistricts: async (): Promise<any[]> => {
        if (USE_MOCK) {
            return [{ id: 1, name: "Mimika Baru" }, { id: 2, name: "Kuala Kencana" }];
        }

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
     */
    updateDistrictProfile: async (districtId: number, payload: any): Promise<any> => {
        if (USE_MOCK) {
            await simulateDelay(500);
            return { status: "success", message: "Profil berhasil diperbarui (Simulasi)" };
        }

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