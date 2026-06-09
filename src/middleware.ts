// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Fungsi utilitas untuk men-decode payload JWT di Edge Runtime
 * Menggantikan ketergantungan pada cookie 'user_role' yang rentan dimanipulasi.
 */
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Pemisahan Logis Rute (Admin vs User)
  const adminRoutes = [
    '/admin-dashboard',
    '/akun-management',
    '/manajemen-wilayah',
    '/monitoring-opd',
    '/data-quality'
  ];

  const protectedRoutes = [
    '/dashboard',
    '/upload-data',
    '/data-brida',
    '/data-pemerintah',
    '/data-non-pemerintah',
    ...adminRoutes
  ];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 2. Gateway Utama: Tolak akses jika tidak ada token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Ekstraksi Role Super Aman (Dari dalam JWT Payload)
  let userRole = 'user';
  if (token) {
    const decoded = decodeJwtPayload(token);
    // Asumsi: Backend FastAPI Anda menyematkan role di key 'role' atau 'user_role'
    userRole = decoded?.role || decoded?.user_role || 'user';
  }

  // 4. RBAC Guard: Jika User Biasa mencoba memaksa masuk URL Admin, tendang kembali!
  if (isAdminRoute && token && userRole !== 'admin' && userRole !== 'brida') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. Smart Redirect: User yang sudah login mencoba akses halaman login
  if (pathname === '/login' && token) {
    const targetUrl = (userRole === 'admin' || userRole === 'brida')
      ? '/admin-dashboard'
      : '/dashboard';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

// Konfigurasi Matcher (Pastikan semua rute terlindungi terdaftar di sini)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin-dashboard/:path*',
    '/upload-data/:path*',
    '/data-brida/:path*',
    '/data-pemerintah/:path*',
    '/data-non-pemerintah/:path*',
    '/akun-management/:path*',
    '/monitoring-opd/:path*',
    '/data-quality/:path*',
    '/manajemen-wilayah/:path*',
    '/login',
  ],
};