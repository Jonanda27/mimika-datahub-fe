// src/services/auth.service.ts
import { API_BASE_URL } from "../lib/config";
import { LoginResponse } from "../types/auth";

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Endpoint: http://localhost:8000/api/v1/auth/login
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      body: formData, // Menggunakan form-data sesuai kebutuhan FastAPI 
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Mengambil detail error dari HTTPException backend 
      throw new Error(errorData.detail || "Gagal melakukan login");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  }
};