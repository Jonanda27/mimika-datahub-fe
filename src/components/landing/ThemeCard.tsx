"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface ThemeCardProps {
    title: string;
    description: string;
    year: number | string;
    sourceName: string;
    sourceType: number | string;
    profileLink: string;
    imagePath: string;
    bgImage?: string;
}

export default function ThemeCard({
    title,
    description,
    year,
    sourceName,
    sourceType,
    profileLink,
    imagePath,
    bgImage
}: ThemeCardProps) {
    return (
        <div className="flex flex-col bg-white border border-gray-200 h-full w-full hover:shadow-md transition-shadow duration-300 overflow-hidden">

            {/* --- BLOCK 1: TEMPLATE GAMBAR (Sesuai Desain Anda) --- */}
            <div className="h-64 w-full relative shrink-0">
                <div className="absolute inset-0 p-4">
                    <div className="relative w-full h-full">
                        <Image
                            src={bgImage || "/bg-mimika.jpg"}
                            alt={`Background ${title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 20vw"
                            className="object-cover z-0 rounded-lg"
                        />
                    </div>
                </div>
                <Image
                    src={imagePath || "/placeholder-icon.png"}
                    alt={`Ikon ${title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-contain z-10 p-4"
                />
            </div>

            {/* --- BLOCK 2: KONTEN TEKS (Typography Gaya World Bank) --- */}
            <div className="p-5 flex flex-col grow">
                <h3 className="text-[#002244] font-black text-[14px] uppercase tracking-tight mb-3">
                    {title}
                </h3>

                <p className="text-gray-700 text-[13px] leading-relaxed mb-6 font-medium line-clamp-3">
                    {description || "Deskripsi data tematik untuk kategori ini belum tersedia."}
                </p>

                {/* Blocking Data: Rata Kanan, Angka Besar */}
                <div className="mt-auto text-right flex flex-col items-end border-t border-transparent pt-2">
                    <span className="text-[#002244] text-4xl font-black leading-none mb-1 tracking-tighter">
                        {year || "-"}
                    </span>
                    <span className="text-[#0071bc] text-[10px] leading-tight font-bold uppercase tracking-wider max-w-[90%] text-right">
                        {sourceName} {sourceType ? `• ${sourceType}` : ""}
                    </span>
                </div>
            </div>

            {/* --- BLOCK 3: FOOTER LINK (Rata Tengah) --- */}
            <div className="border-t border-gray-200 py-3 bg-slate-50 flex justify-center mt-auto">
                <a
                    href="#"
                    className="flex items-center gap-1.5 text-[#0071bc] hover:text-[#004b87] text-[12px] font-black uppercase tracking-widest transition-all"
                >
                    {profileLink} profile <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}