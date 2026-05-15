"use client";

import { useEffect } from "react";
import { Search, Bell, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/src/app/store/useAuthStore";
import { UserProfile } from "@/src/app/types/auth";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  withSearch?: boolean;
  onSearch?: (val: string) => void;
}

export default function PageHeader({ title, subtitle, withSearch, onSearch }: PageHeaderProps) {
  // Integrasi Store Auth untuk data profil real-time
  const { profile, fetchProfile, isLoading } = useAuthStore();

  useEffect(() => {
    // Ambil data profil jika belum ada di store untuk menjaga persistensi komponen
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // Fungsi helper untuk inisial nama dengan handling null-safety
  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "U";
  };

  return (
    <div className="rounded-2xl p-5 md:p-7 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-md relative overflow-hidden min-h-[140px] gap-5">

      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-papua.jpg"
          alt="Background Papua"
          fill
          priority
          className="object-cover object-center grayscale-[20%]"
        />
        {/* Menggunakan bg-linear-to-r (Update HEAD) dengan opasitas dari (Update origin/fix) agar gambar lebih jelas */}
        <div className="absolute inset-0 bg-linear-to-r from-[#1e61d0]/50 to-[#0b3370]/60"></div>
      </div>

      {/* 2. Content Layer (Title & Subtitle) */}
      <div className="relative z-10 w-full md:w-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-md">{title}</h2>
        {/* Menggunakan canonical class max-w-62.5 (250px) */}
        <p className="text-blue-100 text-[10px] md:text-xs tracking-wide font-medium max-w-62.5 md:max-w-none drop-shadow-md">
          {subtitle}
        </p>
      </div>

      {/* 3. Action Layer (Search, Notifications & Profile) */}
      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-5 relative z-10 w-full md:w-auto">

        {/* Search Input - Menggabungkan styling canonical dari HEAD dan visual dari origin/fix */}
        {withSearch && (
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              type="text"
              placeholder="Cari..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white w-full md:w-50 lg:w-70 text-sm transition-all shadow-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification Bell */}
          <div className="relative cursor-pointer bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-black/30 transition shrink-0">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3 group cursor-pointer bg-white/5 hover:bg-white/10 p-1 pr-3 rounded-full transition-all border border-white/5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ef4444] rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md border border-red-400 group-hover:scale-105 transition-transform shrink-0">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : profile ? (
                getInitials((profile as UserProfile).full_name)
              ) : (
                <UserIcon size={16} />
              )}
            </div>

            {/* Nama User (Hanya tampil di Desktop/iPad Landscape) */}
            <div className="hidden lg:flex flex-col items-start leading-tight">
              <span className="text-[11px] font-bold text-white truncate max-w-[100px]">
                {profile?.full_name || "Guest"}
              </span>
              <span className="text-[9px] text-blue-200 uppercase font-black tracking-tighter">
                {profile?.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}