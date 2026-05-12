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
  Search,
  ChevronDown,
  UserCircle
} from "lucide-react";

export default function PublicTopBar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false);
  const resourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    return <div className="w-full h-[110px] bg-white"></div>;
  }

  return (
    <header className="w-full flex flex-col z-[100] sticky top-0 shadow-md font-sans">
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

        {/* Kanan: Search & Mobile Toggle */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex relative items-center border border-gray-300 rounded w-[250px] lg:w-[400px] focus-within:ring-1 focus-within:ring-[#0071bc]">
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full px-3 py-1.5 focus:outline-none text-sm bg-transparent"
              autoComplete="off"
            />
            <button className="px-3 text-gray-500" type="button">
              <Search size={16} />
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-[#004b87] p-2 rounded-lg hover:bg-gray-100" 
            type="button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- BARIS BAWAH (Biru - Navigasi) --- */}
      <div className="bg-[#004b87] text-white hidden md:flex items-center justify-between px-4 md:px-8">
        <nav className="flex items-center h-full">
          {/* HOME */}
          <Link 
            href="/" 
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/" ? "bg-[#005a96] border-b-2 border-white" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Home size={14} /> HOME
          </Link>

          {/* DATA & RESOURCES (DROPDOWN TANPA IKON DALAM) */}
          <div className="relative h-full" ref={resourceRef}>
            <button 
              onClick={() => setIsResourceOpen(!isResourceOpen)}
              className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 h-full
                ${isResourceOpen ? "bg-[#005a96]" : "hover:bg-[#005a96]"}
                ${pathname.includes("data") ? "border-b-2 border-white" : "border-b-2 border-transparent"}
              `}
              type="button"
            >
              DATA & RESOURCES <ChevronDown size={14} className={`transition-transform ${isResourceOpen ? 'rotate-180' : ''}`} />
            </button>

            {isResourceOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl py-2 animate-in fade-in zoom-in-95 duration-100 text-black">
                <Link 
                  href="/data-pemerintah" 
                  onClick={() => setIsResourceOpen(false)}
                  className="flex flex-col px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-sm font-bold">Data Pemerintah</span>
                  <span className="text-[10px] text-gray-500 font-medium">Statistik Sektoral OPD</span>
                </Link>
                <Link 
                  href="/data-non-pemerintah" 
                  onClick={() => setIsResourceOpen(false)}
                  className="flex flex-col px-4 py-2 hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-sm font-bold">Data Non-Pemerintah</span>
                  <span className="text-[10px] text-gray-500 font-medium">Mitra & Publik</span>
                </Link>
              </div>
            )}
          </div>

          {/* ATLAS */}
          <Link 
            href="/atlas" 
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/atlas" ? "bg-[#005a96] border-b-2 border-white" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Globe size={14} /> ATLAS
          </Link>

          {/* ABOUT */}
          <Link 
            href="/about" 
            className={`px-5 py-3 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2
              ${pathname === "/about" ? "bg-[#005a96] border-b-2 border-white" : "hover:bg-[#005a96] border-b-2 border-transparent"}
            `}
          >
            <Info size={14} /> ABOUT
          </Link>
        </nav>

        {/* LOGIN */}
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-5 py-3 hover:bg-[#005a96] transition-colors text-[13px] font-medium tracking-wide"
        >
          <UserCircle size={16} /> Login
        </Link>
      </div>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-[#0071bc] text-white flex flex-col absolute top-full left-0 w-full shadow-xl border-t border-[#005a96] animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3">
                <Home size={18} /> HOME
              </Link>
              <Link href="/data-pemerintah" onClick={() => setIsOpen(false)} className="px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3">
                DATA PEMERINTAH
              </Link>
              <Link href="/data-non-pemerintah" onClick={() => setIsOpen(false)} className="px-6 py-4 text-sm font-medium border-b border-[#005a96] flex items-center gap-3">
                DATA NON-PEMERINTAH
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="px-6 py-4 text-sm font-bold bg-[#ef4444] flex items-center gap-3">
                <UserCircle size={18} /> LOGIN SISTEM
              </Link>
            </nav>
        </div>
      )}
    </header>
  );
}