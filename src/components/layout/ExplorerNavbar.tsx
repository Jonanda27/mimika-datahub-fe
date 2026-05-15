// src/components/layout/ExplorerNavbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Settings,
    HelpCircle,
    User as UserIcon,
    ChevronLeft,
    Share2
} from "lucide-react";
import { useAuthStore } from "@/src/app/store/useAuthStore";

/**
 * ExplorerNavbar - Komponen Navigasi Immersive
 * Menggunakan teknik Glassmorphism (backdrop-blur) agar menyatu dengan peta.
 * Didesain khusus untuk layout fullscreen tanpa batas.
 */
export default function ExplorerNavbar() {
    const { profile, isLoading } = useAuthStore();

    const getInitials = (name: string) => {
        return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "U";
    };

    return (
        <nav className="w-full h-16 px-6 flex items-center justify-between bg-slate-900/40 backdrop-blur-md border-b border-white/10 shadow-2xl relative">

            {/* BAGIAN KIRI: Branding & Back Button */}
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-white/70 hover:text-white transition-all"
                >
                    <div className="p-1.5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Kembali</span>
                </Link>

                <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

                <Link href="/explorer" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo-mimika.png"
                            alt="Logo Mimika"
                            fill
                            className="object-contain filter drop-shadow-md"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-white tracking-tighter uppercase">
                            Mimika <span className="text-blue-400">DataHub</span>
                        </span>
                        <span className="text-[9px] text-white/50 font-bold tracking-[0.2em] uppercase">
                            Spatial Explorer
                        </span>
                    </div>
                </Link>
            </div>

            {/* BAGIAN TENGAH: Search Bar (Floating Style) */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-12">
                <div className="w-full relative group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Cari lokasi, koordinat, atau indikator sektoral..."
                        className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/20 transition-all backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* BAGIAN KANAN: Tools & Profile */}
            <div className="flex items-center gap-3 md:gap-5">

                {/* Action Buttons (Ghost Style) */}
                <div className="flex items-center gap-1 md:gap-2">
                    <button className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all title-tooltip" title="Bantuan">
                        <HelpCircle size={20} />
                    </button>
                    <button className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Bagikan Tampilan">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Pengaturan Lapisan">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

                {/* User Profile Avatar */}
                <Link
                    href="/login"
                    className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 rounded-full bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-black text-white shadow-lg group-hover:scale-105 transition-transform">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : profile ? (
                            getInitials(profile.full_name)
                        ) : (
                            <UserIcon size={14} />
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[10px] font-black text-white uppercase tracking-tight line-clamp-1 max-w-20">
                            {profile?.full_name || "Guest User"}
                        </span>
                        <span className="text-[8px] text-blue-300 font-bold uppercase tracking-widest">
                            {profile?.role || "Portal Access"}
                        </span>
                    </div>
                </Link>
            </div>

        </nav>
    );
}