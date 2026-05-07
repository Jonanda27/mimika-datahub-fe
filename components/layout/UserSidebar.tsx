"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Globe, 
  LineChart, 
  Upload, 
  BarChart2, 
  Eye, 
  Menu, 
  X,
  LogOut // Import ikon logout
} from "lucide-react";

// Integrasi Store
import { useAuthStore } from "@/src/app/store/useAuthStore";

export default function ManagerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu
  
  // Mengambil action logout dari Auth Store
  const { logout, isLoading } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Data", href: "/upload-data", icon: Upload },
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
    <>
      {/* Tombol Hamburger untuk Mobile */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-[#144272] text-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay saat Sidebar terbuka di Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Utama */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-gradient-to-b from-[#144272] to-[#0A2647] text-white z-[58] shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto
        w-[260px] flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <div className="mb-4 relative w-24 h-20">
            <Image src="/logo-mimika.png" alt="Logo Mimika" fill className="object-contain" priority />
          </div>
          <h1 className="text-xl font-bold tracking-wide">Mimika DataHub</h1>
          <p className="text-[11px] text-blue-200 mt-1 uppercase text-center font-light">Pusat Data Terintegrasi</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 text-sm font-medium mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsOpen(false)} // Tutup menu setelah klik di mobile
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

        {/* Bottom Section: Tombol Logout */}
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
            {isLoading ? "Sedang Keluar..." : "Keluar Sistem"}
          </button>
        </div>
      </aside>
    </>
  );
}