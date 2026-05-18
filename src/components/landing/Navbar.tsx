"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Menu,
    X,
    ChevronDown,
    Building2,
    Users2
} from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Logika deteksi scroll untuk efek sticky/shadow
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Logika tutup dropdown saat klik di luar area menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
            } border-b border-gray-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* --- LOGO & BRANDING --- */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative w-11 h-11 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo-mimika.png"
                                alt="Logo Mimika"
                                fill
                                sizes="44px"
                                className="object-contain"
                            />
                        </div>
                        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-bold text-black tracking-tight leading-none">
                                Mimika <span className="text-[#0071bc]">DataHub</span>
                            </span>
                        </div>
                    </Link>

                    {/* --- DESKTOP MENU --- */}
                    <div className="hidden md:flex items-center gap-8 text-[12px] font-black uppercase tracking-widest text-[#002244]">

                        <Link href="/explorer" className="hover:text-[#0071bc] transition-colors flex items-center gap-2">
                            GIS Peta
                        </Link>

                        {/* Dropdown Data & Resources */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-1.5 hover:text-[#0071bc] transition-colors uppercase font-black"
                            >
                                Resources <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="p-2">
                                        <Link
                                            href="/public-data-pemerintah"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-[#0071bc]">
                                                <Building2 size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-[#002244]">Data Pemerintah</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Statistik Sektoral</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/public-data-non-pemerintah"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600">
                                                <Users2 size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-[#002244]">Data Mitra</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Non-Pemerintah</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/login" className="bg-[#0071bc] text-white px-6 py-2.5 rounded-sm hover:bg-[#005a96] transition-all shadow-md active:scale-95">
                            MASUK
                        </Link>
                    </div>

                    {/* --- MOBILE TOGGLE --- */}
                    <button
                        className="md:hidden p-2 text-[#002244]"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU DRAWER --- */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4 absolute w-full shadow-2xl z-50 font-black text-[#002244] text-[13px] uppercase tracking-widest animate-in slide-in-from-top">
                    <Link href="/explorer" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50">Geospatial</Link>
                    <Link href="/public-data-pemerintah" onClick={() => setIsMenuOpen(false)} className="block p-2 border-b border-gray-50 text-[#0071bc]">Data Pemerintah</Link>
                    <Link href="/login" className="block w-full bg-[#0071bc] text-white text-center py-4 rounded-sm">Portal Masuk</Link>
                </div>
            )}
        </nav>
    );
}