// src/components/layout/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Menu,
  X,
  LogOut,
  Search, // Tambahan untuk bar pencarian seperti di gambar
  User as UserIcon, // Tambahan untuk ikon login/logout di kanan
  Building2,
  Globe,
  Eye,
  BarChart2,
  MapPin // Ikon untuk Manajemen Wilayah
} from "lucide-react";

// Integrasi Store
import { useAuthStore } from "@/src/app/store/useAuthStore";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu

  // Mengambil action logout dari Auth Store
  const { logout, isLoading } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Data Pemerintah", href: "/data-pemerintah", icon: Building2 },
    { name: "Data Non Pemerintah", href: "/data-non-pemerintah", icon: Globe },
    { name: "Manajemen Akun", href: "/akun-management", icon: BarChart2 },
    { name: "Monitoring OPD", href: "/monitoring-opd", icon: Eye },
    { name: "Data Quality", href: "/data-quality", icon: Globe },
    // Menu Baru: Manajemen Wilayah
    { name: "Manajemen Wilayah", href: "/manajemen-wilayah", icon: MapPin },
  ];

  // Handler untuk proses Logout
  const handleLogout = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (confirmLogout) {
      try {
        await logout(); // Menjalankan service logout (API & Local Cleanup)
        router.push("/login"); // Redirect ke halaman login
      } catch (error) {
        console.error("Gagal Logout:", error);
        alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
      }
    }
  };

  return (
    <header className="w-full flex flex-col z-60 sticky top-0 shadow-md font-sans">
      {/* --- BARIS ATAS (Putih) --- */}
      <div className="bg-white px-4 md:px-8 py-3 flex items-center justify-between border-b border-gray-200">

        {/* Kiri: Logo & Branding */}
        <div className="flex items-center gap-4">
          <Image src="/logo-mimika.png" alt="Logo Mimika" width={60} height={20} className="object-contain" priority />
          <div className="h-8 w-px bg-gray-400 hidden sm:block"></div>
          <h1 className="text-xl md:text-2xl font-bold text-[#004b87] tracking-wide hidden sm:block">
            Mimika DataHub
          </h1>
        </div>

        {/* Kanan: Search Bar & Hamburger Mobile */}
        <div className="flex items-center gap-4">
          {/* Kolom Pencarian (Desktop) */}
          <div className="hidden md:flex relative items-center border border-gray-300 rounded w-75 lg:w-112.5 focus-within:ring-1 focus-within:ring-[#0071bc]">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-1.5 focus:outline-none text-sm text-black bg-transparent"
            />
            <button className="px-3 hover:bg-gray-50 h-full flex items-center transition-colors">
              <Search size={18} className="text-gray-800 font-bold" />
            </button>
          </div>

          {/* Tombol Hamburger (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#004b87] p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- BARIS BAWAH (Biru - Navigasi) --- */}
      <div className="bg-[#0071bc] text-white hidden md:flex items-center justify-between px-4 md:px-8">

        {/* Kiri: Menu Navigasi */}
        <nav className="flex flex-wrap items-center">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 lg:px-5 py-3 text-[13px] lg:text-sm font-medium tracking-wide transition-colors flex items-center gap-2
                  ${isActive ? "bg-[#005a96] border-b-2 border-white" : "hover:bg-[#005a96] border-b-2 border-transparent"}
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Kanan: Tombol Profil/Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-[#005a96] transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <UserIcon size={18} />
          )}
          <span>{isLoading ? "Keluar..." : "Logout"}</span>
        </button>
      </div>

      {/* --- MENU DROPDOWN (Mobile) --- */}
      {isOpen && (
        <div className="md:hidden bg-[#0071bc] text-white flex flex-col absolute top-full left-0 w-full shadow-xl border-t border-[#005a96]">
          {/* Search Bar Mobile */}
          <div className="p-4 border-b border-[#005a96]">
            <div className="flex relative items-center border border-white/50 rounded overflow-hidden w-full bg-white/10 focus-within:bg-white/20">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/70"
              />
              <button className="px-3">
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Menu Links Mobile */}
          <nav className="flex flex-col max-h-[60vh] overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                      ${isActive ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96]"}
                    `}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-3 px-6 py-4 text-sm font-bold hover:bg-[#005a96] text-red-200 transition-colors w-full text-left"
            >
              <LogOut size={18} />
              {isLoading ? "Sedang Keluar..." : "Logout Sistem"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}