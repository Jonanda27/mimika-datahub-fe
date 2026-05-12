"use client";

import { Search } from "lucide-react";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  withSearch?: boolean;
  onSearch?: (val: string) => void;
}

export default function PageHeader({ title, subtitle, withSearch, onSearch }: PageHeaderProps) {
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
        {/* Opacity diturunkan dari /90 & /80 menjadi /40 & /50 agar gambar lebih jelas */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e61d0]/40 to-[#0b3370]/50"></div>
      </div>

      {/* 2. Content Layer (Title & Subtitle) */}
      <div className="relative z-10 w-full md:w-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-md">{title}</h2>
        <p className="text-blue-100 text-[10px] md:text-xs tracking-wide font-medium max-w-[250px] md:max-w-none drop-shadow-md">{subtitle}</p>
      </div>

      {/* 3. Action Layer (Hanya Search) */}
      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-5 relative z-10 w-full md:w-auto">
        {withSearch && (
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Cari..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white w-full md:w-[200px] lg:w-[280px] text-sm transition-all shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}