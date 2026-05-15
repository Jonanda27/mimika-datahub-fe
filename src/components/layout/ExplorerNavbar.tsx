// src/components/layout/ExplorerNavbar.tsx
"use client";

import React, { useState } from "react";
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
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * ExplorerNavbar - Komponen Navigasi Immersive (Light Mode)
 * Sekarang terhubung penuh dengan Global Store untuk interaksi aktual.
 */
export default function ExplorerNavbar() {
    const { profile, isLoading } = useAuthStore();

    // Menarik fungsi kontrol UI dari Store GIS
    const { openPanel, closePanelsToTheRight, clearPanels, resetMapData } = useExplorerStore();

    // Local state untuk menangani input pencarian
    const [searchQuery, setSearchQuery] = useState("");

    const getInitials = (name: string) => {
        return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "U";
    };

    // Handler untuk Pencarian Global (Search Bar)
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // Reset panel anak, lalu buka panel pencarian
        closePanelsToTheRight(-1);
        openPanel(
            "search-result",
            "Hasil Pencarian",
            { query: searchQuery } // Melempar data query ke panel hasil
        );
    };

    // Handler untuk Logo (Soft Reset)
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        clearPanels();
        resetMapData();
    };

    // Handler untuk Tombol Settings
    const handleSettingsClick = () => {
        closePanelsToTheRight(-1);
        openPanel("indicator-config", "Pengaturan Peta");
    };

    // Handler untuk Tombol Bagikan (Mock)
    const handleShareClick = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert("Tautan peta berhasil disalin ke clipboard!");
        });
    };

    return (
        <nav className="w-full h-16 px-6 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm relative z-50">

            {/* BAGIAN KIRI: Branding & Back Button */}
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-all"
                >
                    <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Beranda Utama</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                <a
                    href="#"
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 active:scale-95 transition-transform cursor-pointer"
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo-mimika.png"
                            alt="Logo Mimika"
                            fill
                            sizes="32px"
                            className="object-contain filter drop-shadow-sm"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">
                            Mimika <span className="text-teal-600">DataHub</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                            Spatial Explorer
                        </span>
                    </div>
                </a>
            </div>

            {/* BAGIAN TENGAH: Search Bar (Interactive) */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-12">
                <form onSubmit={handleSearchSubmit} className="w-full relative group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari lokasi, distrik, atau metrik sektoral (Tekan Enter)..."
                        className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-12 pr-6 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all shadow-inner"
                    />
                </form>
            </div>

            {/* BAGIAN KANAN: Tools & Profile */}
            <div className="flex items-center gap-3 md:gap-5">

                {/* Action Buttons */}
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={() => alert("Pusat Bantuan sedang dalam pengembangan.")}
                        className="p-2.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all title-tooltip"
                        title="Pusat Bantuan"
                    >
                        <HelpCircle size={20} />
                    </button>
                    <button
                        onClick={handleShareClick}
                        className="p-2.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                        title="Bagikan Tampilan Saat Ini"
                    >
                        <Share2 size={20} />
                    </button>
                    <button
                        onClick={handleSettingsClick}
                        className="p-2.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all active:scale-90"
                        title="Pengaturan Lapisan Peta"
                    >
                        <Settings size={20} />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* User Profile Avatar */}
                <Link
                    href="/login"
                    className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-teal-200 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center text-xs font-black text-white shadow-sm group-hover:scale-105 transition-transform">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : profile ? (
                            getInitials(profile.full_name)
                        ) : (
                            <UserIcon size={14} />
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight line-clamp-1 max-w-20">
                            {profile?.full_name || "Guest User"}
                        </span>
                        <span className="text-[8px] text-teal-600 font-bold uppercase tracking-widest">
                            {profile?.role || "Portal Access"}
                        </span>
                    </div>
                </Link>
            </div>

        </nav>
    );
}