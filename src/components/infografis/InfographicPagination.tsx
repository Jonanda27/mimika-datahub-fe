"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function InfographicPagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-gray-200 mt-12 gap-6">
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                Menampilkan <span className="text-[#002244]">{Math.min(itemsPerPage, totalItems)}</span> dari <span className="text-[#002244]">{totalItems}</span> Infografis
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 hover:bg-[#0071bc] hover:text-white disabled:opacity-30 transition-all"
                >
                    <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-10 h-10 text-xs font-black transition-all border ${currentPage === i + 1
                            ? "bg-[#002244] text-white border-[#002244]"
                            : "bg-white text-gray-400 border-gray-200 hover:border-[#0071bc] hover:text-[#0071bc]"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 hover:bg-[#0071bc] hover:text-white disabled:opacity-30 transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}