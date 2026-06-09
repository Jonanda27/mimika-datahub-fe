// src/app/services/user.service.ts
import { API_BASE_URL } from "../lib/config";
import { User, UserCreate, UserUpdate, DeleteUserResponse } from "../types/user";

export const userService = {
  /**
   * Helper untuk mendapatkan header otorisasi standar
   */
  getHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  },

  /**
   * Mengambil daftar semua akun user dari backend
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/v1/users/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Gagal mengambil data user");
    return response.json();
  },

  /**
   * Mengajukan pembuatan user baru beserta parameter source_id (OPD) [1]
   */
  async createUser(data: UserCreate): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/v1/users/`, {
      method: "POST",
      headers: this.getHeaders(),
      // Serialisasi data secara aman mengirimkan field source_id ke FastAPI schemas [1]
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Gagal membuat user baru");
    }
    return response.json();
  },

  /**
   * Memperbarui profil pengguna (Dapat memutasi source_id penautan OPD) [1]
   */
  async updateUser(userId: number, data: UserUpdate): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      // Mendukung pengiriman update data instansi OPD yang direvisi [1]
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Gagal mengupdate user");
    }
    return response.json();
  },

  /**
   * Menghapus user secara permanen
   */
  async deleteUser(userId: number): Promise<DeleteUserResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Gagal menghapus user");
    }
    return response.json();
  }
};