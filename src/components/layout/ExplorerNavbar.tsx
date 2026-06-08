// src/components/layout/ExplorerNavbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    ChevronLeft,
    Share2,
    Check,
    UserIcon
} from "lucide-react";
import { useAuthStore } from "@/src/app/store/useAuthStore";
import { useExplorerStore } from "@/src/app/store/useExplorerStore";

/**
 * ExplorerNavbar - Komponen Navigasi Frameless
 * Menggunakan sudut siku tegas dan tata letak padat untuk memaksimalkan ruang fungsional.
 */
export default function ExplorerNavbar() {
    const { profile, isLoading } = useAuthStore();

    // [REFACTOR] Menyadap galleryState untuk kebutuhan Interaction Guard
    const {
        activeIndicator,
        activeBaseMap,
        openPanel,
        closePanelsToTheRight,
        clearPanels,
        resetMapData,
        galleryState
    } = useExplorerStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    // Penanda apakah Mode Teater sedang aktif
    const isTheaterMode = galleryState?.isOpen;

    const getInitials = (name: string) => {
        return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "U";
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        closePanelsToTheRight(-1);
        openPanel("hasil-pencarian", "Hasil Pencarian", { query: searchQuery });
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        clearPanels();
        resetMapData();
        setSearchQuery("");
    };

    const handleShareClick = async () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();

        if (activeIndicator) params.set("indicator", activeIndicator);
        if (activeBaseMap) params.set("basemap", activeBaseMap);

        const shareUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mimika DataHub - Eksplorasi Spasial',
                    text: `Lihat data spasial ${activeIndicator || 'Kabupaten Mimika'} di DataHub.`,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                console.log("Share cancelled or failed", err);
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Gagal menyalin tautan", err);
        }
    };

    return (
        // [REFACTOR] INTERACTION GUARD
        // Meredupkan dan mengunci seluruh Navbar saat Mode Teater aktif
        <nav className={`w-full h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 relative z-50 transition-all duration-300 ease-in-out
            ${isTheaterMode ? "opacity-40 pointer-events-none grayscale" : "opacity-100"}
        `}>

            {/* KIRI: Branding */}
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-all rounded-none"
                >
                    <div className="p-1.5 group-hover:bg-slate-100 transition-colors rounded-none">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Beranda</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                <button onClick={handleLogoClick} className="flex items-center gap-3 active:scale-95 transition-transform group rounded-none">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo-mimika.png"
                            alt="Logo Mimika"
                            fill
                            sizes="32px"
                            className="object-contain filter group-hover:brightness-110"
                        />
                    </div>
                    <div className="flex flex-col leading-none text-left">
                        <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">
                            Mimika <span className="text-teal-600">DataHub</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                            Eksplorasi Spasial
                        </span>
                    </div>
                </button>
            </div>

            {/* TENGAH: Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-12">
                <form onSubmit={handleSearchSubmit} className="w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari lokasi atau indikator sektoral..."
                        className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-12 pr-6 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all rounded-none"
                    />
                </form>
            </div>

            {/* KANAN: Single Tool & Profile */}
            <div className="flex items-center gap-3 md:gap-5">

                {/* UNITARY TOOL: Enhanced Share Button */}
                <button
                    onClick={handleShareClick}
                    className={`flex items-center gap-2 px-4 py-2 border transition-all active:scale-95 rounded-none ${isCopied
                        ? "bg-teal-50 border-teal-600 text-teal-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                        }`}
                    title="Bagikan tampilan peta saat ini"
                >
                    {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                    <span className="text-xs font-black uppercase tracking-widest hidden sm:block">
                        {isCopied ? "Tersalin" : "Bagikan"}
                    </span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* Profile */}
                <Link
                    href="/login"
                    className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-400 transition-all group rounded-none"
                >
                    {/* Avatar tetap bulat sempurna sebagai pengecualian elemen wajah/profil */}
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-black text-white group-hover:bg-teal-700 transition-colors">
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
                            {profile?.full_name || "Login"}
                        </span>
                        <span className="text-[8px] text-teal-600 font-bold uppercase tracking-widest">
                            {profile?.role || "Publik"}
                        </span>
                    </div>
                </Link>
            </div>

        </nav>
    );
}