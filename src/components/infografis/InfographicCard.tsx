"use client";
import React from "react";
import Image from "next/image";
import { ZoomIn, Calendar } from "lucide-react";

interface CardProps {
    item: any;
    onClick: () => void;
}

export default function InfographicCard({ item, onClick }: CardProps) {
    return (
        <div
            className="group cursor-pointer bg-white border border-gray-200 hover:border-[#0071bc] transition-all duration-300"
            onClick={onClick}
        >
            <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Label Kategori - Sharp & Solid */}
                <div className="absolute top-0 right-0 bg-[#0071bc] text-white text-[9px] font-black uppercase px-3 py-1.5 tracking-wider">
                    {item.category}
                </div>
                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-[#002244]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white text-[#002244] p-3 shadow-xl">
                        <ZoomIn size={24} />
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase mb-2">
                    <Calendar size={12} className="text-[#0071bc]" /> {item.date}
                </div>
                <h3 className="text-[#002244] font-bold text-sm leading-snug group-hover:text-[#0071bc] transition-colors line-clamp-2">
                    {item.title}
                </h3>
            </div>
        </div>
    );
}