// src/services/ingest.service.ts
import { API_BASE_URL } from "../lib/config";
import { UploadRequest, UploadResponse } from "../types/ingest";

export const ingestService = {
  async uploadProcess(data: UploadRequest): Promise<UploadResponse> {
    const formData = new FormData();
    
    formData.append("title", data.title);
    formData.append("dataset_type", data.dataset_type); // Mapping baru
    formData.append("source_id", data.source_id.toString());
    formData.append("category_id", data.category_id.toString());
    formData.append("source_type_id", data.source_type_id.toString()); // Mapping baru
    formData.append("year", data.year.toString());
    formData.append("period", data.period);
    
    if (data.description) {
      formData.append("description", data.description);
    }
    
    formData.append("file", data.file);

    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/v1/ingest/upload-process`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Gagal memproses upload data");
    }

    return response.json();
  }
};