"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Building2, Globe, LineChart, 
  Upload, BarChart2, Eye, Menu, X 
} from "lucide-react";

export default function ManagerSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu

  const menuItems = [
    { name: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Data Pemerintah", href: "/manager/data-pemerintah", icon: Building2 },
    { name: "Data Non Pemerintah", href: "/manager/data-non-pemerintah", icon: Globe },
    { name: "Data BRIDA", href: "/manager/data-brida", icon: LineChart },
    { name: "Upload Data", href: "/manager/upload-data", icon: Upload },
    { name: "Data Quality", href: "/manager/data-quality", icon: BarChart2 },
    { name: "Monitoring OPD", href: "/manager/monitoring-opd", icon: Eye },
  ];

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
        w-[260px]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <div className="mb-4 relative w-24 h-20">
            <Image src="/logo-mimika.png" alt="Logo Mimika" fill className="object-contain" priority />
          </div>
          <h1 className="text-xl font-bold tracking-wide">Mimika DataHub</h1>
          <p className="text-[11px] text-blue-200 mt-1 uppercase text-center font-light">Pusat Data Terintegrasi</p>
        </div>

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
      </aside>
    </>
  );
}