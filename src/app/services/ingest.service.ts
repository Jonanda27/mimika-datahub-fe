// src/app/services/ingest.service.ts
import { API_BASE_URL } from "../lib/config";
import { UploadRequest, UploadResponse } from "../types/ingest";

export const ingestService = {
  async uploadProcess(data: UploadRequest): Promise<UploadResponse> {
    const formData = new FormData();

    // Data Text
    formData.append("title", data.title);
    formData.append("dataset_type", data.dataset_type);
    formData.append("source_id", data.source_id.toString());
    formData.append("category_id", data.category_id.toString());
    formData.append("source_type_id", data.source_type_id.toString());
    formData.append("year", data.year.toString());
    formData.append("period", data.period);

    if (data.description) {
      formData.append("description", data.description);
    }

    // ==========================================
    // INTERVENSI GIS: Injeksi district_id
    // ==========================================
    if (data.district_id !== undefined && data.district_id !== null) {
      formData.append("district_id", data.district_id.toString());
    }

    // Data Files
    formData.append("file", data.file);      // File Excel/CSV/PDF/Doc
    formData.append("image", data.image);    // File Gambar Cover Dataset

    const response = await fetch(`${API_BASE_URL}/v1/ingest/upload-process`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
        // Catatan: Jangan set Content-Type ke multipart/form-data secara manual, 
        // biarkan browser yang menanganinya agar boundary boundary file di-generate dengan benar.
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Gagal memproses upload data");
    }

    return response.json();
  }
};