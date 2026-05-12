"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Menu, 
  X,
  LogOut,
  Search,
  User as UserIcon,
  ChevronDown,
  Building2,
  Globe,
  BarChart2,
  Eye
} from "lucide-react";

import { useAuthStore } from "@/src/app/store/useAuthStore";

export default function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { profile, fetchProfile, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Data Pemerintah", href: "/data-pemerintah", icon: Building2 },
    { name: "Data Non Pemerintah", href: "/data-non-pemerintah", icon: Globe },
    { name: "Manajemen Akun", href: "/akun-management", icon: BarChart2 },
    { name: "Monitoring OPD", href: "/monitoring-opd", icon: Eye },
    { name: "Data Quality", href: "/data-quality", icon: Globe },
  ];

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "AG";
  };

  const handleLogout = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (confirmLogout) {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("Gagal Logout:", error);
        alert("Terjadi kesalahan saat logout.");
      }
    }
  };

  return (
    <header className="w-full flex flex-col z-[60] sticky top-0 shadow-md font-sans">
      {/* --- BARIS ATAS (Putih) --- */}
      <div className="bg-white px-4 md:px-8 py-3 flex items-center justify-between border-b border-gray-200 text-black">
        
        {/* Kiri: Logo & Branding */}
        <div className="flex items-center gap-4">
          <Image src="/logo-mimika.png" alt="Logo Mimika" width={50} height={15} className="object-contain" priority />
          <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
          <h1 className="text-lg md:text-xl font-bold text-[#004b87] tracking-wide hidden sm:block">
            Mimika DataHub
          </h1>
        </div>

        {/* Kanan: Search & Profile Dropdown */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Profil Section with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white border-2 transition-all focus:outline-none 
                ${isProfileOpen ? 'border-[#0071bc] shadow-md ring-4 ring-[#0071bc]/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#002244] to-[#0071bc] rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner">
                {getInitials(profile?.full_name || "Agith")}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[12px] font-bold text-[#002244] truncate max-w-[120px]">
                  {profile?.full_name || "Agith"}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  {profile?.role || "Member"}
                </span>
              </div>
              <ChevronDown 
                size={14} 
                className={`ml-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#0071bc]' : 'text-gray-400'}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                {/* Header Dropdown */}
                <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Masuk Sebagai</p>
                  <p className="text-sm font-black text-[#002244] truncate">{profile?.username || "Admin"}</p>
                </div>
                
                {/* Body Dropdown */}
                <div className="p-2 space-y-1">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-bold group"
                  >
                    <div className="p-1.5 bg-red-50 rounded-md group-hover:bg-red-100 transition-colors">
                      <LogOut size={16} />
                    </div>
                    {isLoading ? "Sedang Keluar..." : "Logout dari Sistem"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Hamburger (Mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#004b87] p-2 rounded-lg hover:bg-gray-100 border border-transparent active:border-gray-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- BARIS BAWAH (Biru - Navigasi) --- */}
      <div className="bg-[#004b87] text-white hidden md:flex items-center justify-between px-4 md:px-8">
        <nav className="flex items-center">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
                  ${isActive ? "bg-[#005a96] border-b-2 border-white shadow-inner" : "hover:bg-[#005a96] border-b-2 border-transparent"}
                `}
              >
                <item.icon size={14} className={isActive ? "text-white" : "text-blue-200"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- MENU DROPDOWN (Mobile) --- */}
      {isOpen && (
        <div className="md:hidden bg-[#0071bc] text-white flex flex-col absolute top-full left-0 w-full shadow-2xl border-t border-[#005a96] animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                    ${pathname === item.href ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
                  `}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </nav>
        </div>
      )}
    </header>
  );
}