"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Globe, 
  BarChart2, 
  Eye, 
  Menu, 
  X,
  LogOut 
} from "lucide-react";

// Integrasi Auth Store
import { useAuthStore } from "@/src/app/store/useAuthStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. Tambahkan state isMounted untuk mencegah Hydration Mismatch [cite: 574]
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu

  // Ambil state dan action dari Auth Store 
  const { logout, isLoading } = useAuthStore();

  // 2. Gunakan useEffect untuk menandai bahwa komponen telah terpasang di client [cite: 575]
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Data Pemerintah", href: "/data-pemerintah", icon: Building2 },
    { name: "Data Non Pemerintah", href: "/data-non-pemerintah", icon: Globe },
    { name: "Manajemen Akun", href: "/akun-management", icon: BarChart2 },
    { name: "Monitoring OPD", href: "/monitoring-opd", icon: Eye },
    { name: "Data Quality", href: "/data-quality", icon: Globe },
  ];

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem Admin?");
    if (confirmLogout) {
      try {
        // Menjalankan penghapusan token di BE & FE [cite: 866, 946]
        await logout(); 
        // Redirect ke halaman login [cite: 579]
        router.push("/login"); 
      } catch (error) {
        console.error("Logout Gagal:", error);
        alert("Gagal melakukan logout, silakan coba lagi.");
      }
    }
  };

  // 3. Jangan render apapun (atau render skeleton) sebelum mounted di client 
  if (!isMounted) {
    return null; 
  }

  return (
    <>
      {/* Tombol Hamburger untuk Mobile [cite: 154] */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-[#144272] text-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay saat Sidebar terbuka di Mobile [cite: 155] */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Utama [cite: 156] */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-gradient-to-b from-[#144272] to-[#0A2647] text-white z-[58] shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto
        w-[260px] flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo & Branding [cite: 157] */}
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <div className="mb-4 relative w-24 h-20">
            <Image src="/logo-mimika.png" alt="Logo Mimika" fill className="object-contain" priority />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-center">Mimika DataHub</h1>
          <p className="text-[11px] text-blue-200 mt-1 uppercase text-center font-light italic">
            Admin Panel
          </p>
        </div>

        {/* Menu Navigasi [cite: 158] */}
        <nav className="flex-1 p-4 space-y-1.5 text-sm font-medium mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-[#ef4444] text-white shadow-lg" : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Section Bawah: Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            )}
            <span>{isLoading ? "Memproses..." : "Logout Admin"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}