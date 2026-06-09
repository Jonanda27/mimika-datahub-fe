// src/lib/config.ts

// Menggunakan environment variable untuk production, dengan fallback ke localhost untuk mode development (npm run dev)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";