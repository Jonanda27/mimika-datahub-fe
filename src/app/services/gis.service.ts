// src/app/services/gis.service.ts
import { API_BASE_URL } from "../lib/config";
import { SpatialStatResponse, DistrictDrilldownResponse } from "../types/gis";

// [REFACTOR] Import dipindahkan ke domain spesifik masing-masing
import { MOCK_INDICATOR_DETAILS, MOCK_SPATIAL_STATS } from "../lib/mocks/mockIndicators";
import { MOCK_DISTRICT_DRILLDOWN } from "../lib/mocks/mockDistricts";

/**
 * Konfigurasi Sakelar Mock (Fase 5: Indirection)
 * Memungkinkan Frontend berjalan tanpa bergantung pada Backend API.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_EXPLORER === "true";

/**
 * Helper: Simulasi Latensi Jaringan (Best Practice Simulasi BE)
 */
const simulateDelay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Array statis 18 Distrik Mimika untuk memfasilitasi pembuatan struktur master data
const ALL_DISTRICTS = [
    "Mimika Baru", "Kuala Kencana", "Tembagapura", "Wania", "Iwaka",
    "Kwamki Narama", "Mimika Timur", "Mimika Tengah", "Mimika Barat",
    "Agimuga", "Jila", "Jita", "Mimika Timur Jauh", "Mimika Barat Jauh",
    "Mimika Barat Tengah", "Amar", "Hoya", "Alama"
];

/**
 * Service untuk menangani pengambilan data spasial/GIS.
 */
export const gisService = {
    /**
     * Mengambil data statistik distribusi dataset per distrik.
     * Digunakan untuk pewarnaan peta tematik (Choropleth standar).
     */
    fetchGisStats: async (categoryId?: number, year?: number): Promise<SpatialStatResponse[]> => {
        if (USE_MOCK) {
            await simulateDelay(600);
            // Mengambil data spasial realistis dari mock file Anda
            return MOCK_SPATIAL_STATS;
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
     * TAHAP 3: Action Logic: Fetch Indicator Data (Choropleth Engine)
     */
    fetchIndicatorData: async (indicatorKey: string): Promise<any> => {
        if (USE_MOCK) {
            await simulateDelay(600);
            const data = MOCK_INDICATOR_DETAILS[indicatorKey];

            if (!data) {
                throw new Error(`Data simulasi untuk indikator '${indicatorKey}' tidak ditemukan.`);
            }

            return data;
        }

        try {
            const token = localStorage.getItem("auth_token");
            const url = `${API_BASE_URL}/v1/gis/indicator/${indicatorKey}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data indikator: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error fetching indicator data for ${indicatorKey}:`, error);
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
     */
    fetchDistrictDrilldown: async (districtId: number): Promise<DistrictDrilldownResponse> => {
        if (USE_MOCK) {
            await simulateDelay(800);

            // Mengambil profil mendetail langsung dari MOCK_DISTRICT_DRILLDOWN
            if (MOCK_DISTRICT_DRILLDOWN && MOCK_DISTRICT_DRILLDOWN[districtId]) {
                return MOCK_DISTRICT_DRILLDOWN[districtId];
            }

            // Fallback Data Simulasi jika ID distrik tidak ada di dalam Mock
            return {
                district_id: districtId,
                district_name: ALL_DISTRICTS[districtId - 1] || `Distrik Simulasi ${districtId}`,
                profile: {
                    id: districtId,
                    luas_wilayah: null,
                    jumlah_penduduk: null,
                    deskripsi: "Data kewilayahan belum diregistrasikan. Silakan hubungi admin GIS Bappeda.",
                    batas_wilayah: "-",
                },
                categories: [
                    { category_id: 1, name: "Kesehatan", total: Math.floor(Math.random() * 50) },
                    { category_id: 2, name: "Ekonomi", total: Math.floor(Math.random() * 80) },
                    { category_id: 3, name: "Infrastruktur", total: Math.floor(Math.random() * 40) },
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
     * Mengambil daftar seluruh distrik dari Master Bappeda (Digunakan di Halaman Manajemen Wilayah)
     */
    fetchDistricts: async (): Promise<any[]> => {
        if (USE_MOCK) {
            await simulateDelay(600);

            // Generate list 18 Distrik O(N) dan injeksikan profile dari MOCK_DISTRICT_DRILLDOWN
            return ALL_DISTRICTS.map((name, index) => {
                const id = index + 1;
                const mockData = MOCK_DISTRICT_DRILLDOWN[id];

                return {
                    id,
                    name,
                    // Jika ada di mock, pakai profilnya. Jika tidak, set ke null (Mensimulasikan data belum diisi)
                    profile: mockData ? mockData.profile : {
                        luas_wilayah: null,
                        jumlah_penduduk: null,
                        deskripsi: null,
                        batas_wilayah: null
                    }
                };
            });
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
            await simulateDelay(800);

            // Simulasikan struktur data profile yang berhasil di-update dari DB
            return {
                id: districtId,
                luas_wilayah: payload.luas_wilayah,
                jumlah_penduduk: payload.jumlah_penduduk,
                deskripsi: payload.deskripsi,
                batas_wilayah: payload.batas_wilayah || "-"
            };
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