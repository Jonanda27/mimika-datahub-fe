// components/layout/PageHeader.tsx
import { Search, Bell } from "lucide-react";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  withSearch?: boolean;
  onSearch?: (val: string) => void;
}

export default function PageHeader({ title, subtitle, withSearch, onSearch }: PageHeaderProps) {
  return (
    <div className="rounded-2xl p-7 mb-8 text-white flex justify-between items-center shadow-md relative overflow-hidden min-h-[140px]">
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/background-papua.jpg" 
          alt="Background Papua"
          fill
          priority
          className="object-cover object-center grayscale-[20%]"
        />
        {/* Overlay Gradient agar teks tetap mudah dibaca di atas gambar */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e61d0]/90 to-[#0b3370]/80"></div>
      </div>

      {/* 2. Content Layer (Title & Subtitle) */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1 drop-shadow-md">{title}</h2>
        <p className="text-blue-100 text-xs tracking-wide font-medium">{subtitle}</p>
      </div>

      {/* 3. Action Layer (Search & Notifications) */}
      <div className="flex items-center gap-5 relative z-10">
        {withSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Cari..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white w-[280px] text-sm transition-all"
            />
          </div>
        )}
        <div className="relative cursor-pointer bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-black/30 transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="w-10 h-10 bg-[#ef4444] rounded-full flex items-center justify-center font-bold text-sm shadow-md cursor-pointer border border-red-400 hover:scale-105 transition-transform">
          AD
        </div>
      </div>
    </div>
  );
}