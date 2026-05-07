// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookies
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Daftar rute yang harus diproteksi (Halaman Admin & User)
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/upload-data') ||
    pathname.startsWith('/data-brida') ||
    pathname.startsWith('/data-pemerintah') ||
    pathname.startsWith('/data-non-pemerintah') ||
    pathname.startsWith('/akun-management') ||
    pathname.startsWith('/monitoring-opd') ||
    pathname.startsWith('/data-quality');

  // 1. Jika mencoba akses halaman internal tapi tidak ada token, tendang ke /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika sudah login tapi mencoba akses halaman login lagi, arahkan ke dashboard
  if (pathname === '/login' && token) {
    const role = request.cookies.get('user_role')?.value;
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin-dashboard' : '/dashboard', request.url)
    );
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware hanya berjalan pada rute tertentu saja
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
    '/login',
  ],
};