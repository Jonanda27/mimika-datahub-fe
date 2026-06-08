"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Info,
  Menu,
  X,
  ChevronDown,
  Globe2
} from "lucide-react";

export default function PublicTopBar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isResourceOpen, setIsResourceOpen] = useState(false); // Dropdown data & resource state
  const resourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourceRef.current && !resourceRef.current.contains(event.target as Node)) {
        setIsResourceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-27.5-white"></div>;
  }

  return (
    <header className="w-full flex flex-col z-100 sticky top-0 shadow-md font-sans">
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

        {/* Kanan: Login & Hamburger Menu (Mobile & iPad Portrait) */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Tombol Login Mobile (Di luar hamburger, kiri hamburger) */}
          <Link
            href="/login"
            className="px-4 py-1.5 bg-[#0071bc] text-white rounded-md text-sm font-bold tracking-wide hover:bg-[#005a96] transition-colors shadow-sm"
          >
            Masuk
          </Link>

          {/* Tombol Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#004b87] p-1.5 rounded-lg hover:bg-gray-100 border border-transparent active:border-gray-200 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- BARIS BAWAH (Biru - Navigasi Desktop & iPad Landscape) --- */}
      <div className="bg-[#004b87] text-white hidden md:flex items-center justify-between px-4 md:px-8">
        <nav className="flex items-center h-full">
          {/* HOME */}
          <Link
            href="/"
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/" ? "bg-[#005a96] border-b-2 border-white shadow-inner" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Home size={14} className={pathname === "/" ? "text-white" : "text-blue-200"} /> HOME
          </Link>

          {/* DATA & RESOURCES (DROPDOWN) */}
          <div className="relative h-full" ref={resourceRef}>
            <button
              onClick={() => setIsResourceOpen(!isResourceOpen)}
              className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 h-full
                ${isResourceOpen ? "bg-[#005a96]" : "hover:bg-[#005a96]"}
                ${pathname.includes("data") ? "border-b-2 border-white shadow-inner" : "border-b-2 border-transparent"}
              `}
              type="button"
            >
              DATA & RESOURCES <ChevronDown size={14} className={`transition-transform duration-200 ${isResourceOpen ? 'rotate-180 text-white' : 'text-blue-200'}`} />
            </button>

            {isResourceOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl py-2 animate-in fade-in zoom-in-95 duration-100 text-black">
                <Link
                  href="/public-data-pemerintah"
                  onClick={() => setIsResourceOpen(false)}
                  className="flex flex-col px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-sm font-bold text-[#002244]">Data Pemerintah</span>
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Statistik Sektoral OPD</span>
                </Link>
                <Link
                  href="/public-data-non-pemerintah"
                  onClick={() => setIsResourceOpen(false)}
                  className="flex flex-col px-4 py-2 hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-sm font-bold text-[#002244]">Data Non-Pemerintah</span>
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Mitra & Publik</span>
                </Link>
              </div>
            )}
          </div>

          {/* ATLAS */}
          <Link
            href="/atlas"
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/atlas" ? "bg-[#005a96] border-b-2 border-white shadow-inner" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Globe size={14} className={pathname === "/atlas" ? "text-white" : "text-blue-200"} /> ATLAS
          </Link>

          {/* SURVEY */}
          <Link
            href="/publik-survey"
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/publik-survey" ? "bg-[#005a96] border-b-2 border-white shadow-inner" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Globe2 size={14} className={pathname === "/publik-survey" ? "text-white" : "text-blue-200"} /> SURVEY
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/about" ? "bg-[#005a96] border-b-2 border-white shadow-inner" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Info size={14} className={pathname === "/about" ? "text-white" : "text-blue-200"} /> ABOUT
          </Link>
        </nav>

        {/* LOGIN DESKTOP */}
        <Link
          href="/login"
          className="flex items-center px-5 py-3 hover:bg-[#005a96] transition-colors text-[13px] font-bold tracking-wide"
        >
          Masuk
        </Link>
      </div>

      {/* --- MENU DROPDOWN (Mobile & iPad Portrait) --- */}
      {isOpen && (
        <div className="md:hidden bg-[#0071bc] text-white flex flex-col absolute top-full left-0 w-full shadow-2xl border-t border-[#005a96] animate-in slide-in-from-top duration-200 z-50">
          <nav className="flex flex-col">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname === "/" ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <Home size={18} /> HOME
            </Link>

            <Link
              href="/public-data-pemerintah"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname === "/public-data-pemerintah" ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <div className="w-4.5"></div> {/* Spacer pengganti icon */}
              DATA PEMERINTAH
            </Link>

            <Link
              href="/public-data-non-pemerintah"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname === "/public-data-non-pemerintah" ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <div className="w-4.5"></div> {/* Spacer pengganti icon */}
              DATA NON-PEMERINTAH
            </Link>

            <Link
              href="/atlas"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname === "/atlas" ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <Globe size={18} /> ATLAS
            </Link>

            <Link
              href="/publik-survey"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname.startsWith("/publik-survey") ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <Globe2 size={18} /> SURVEY
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3
                ${pathname === "/about" ? "bg-[#005a96] font-bold" : "hover:bg-[#005a96] text-blue-100"}
              `}
            >
              <Info size={18} /> ABOUT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}