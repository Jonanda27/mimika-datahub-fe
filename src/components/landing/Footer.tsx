"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- SUB-COMPONENT: FOOTER COLUMN ---
function FooterColumn({ title, links }: { title: string, links: string[] }) {
    return (
        <div>
            <h4 className="text-blue-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {title}
            </h4>
            <ul className="space-y-3">
                {links.map((l, i) => (
                    <li key={i}>
                        <a href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors font-medium">
                            {l}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <>
            <footer className="bg-[#333333] text-white pt-16 pb-8 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* GRID UTAMA */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-10">

                        {/* Kolom 1: Branding */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative w-10 h-10 bg-white p-1 rounded-sm shadow-inner">
                                    <Image src="/logo-mimika.png" alt="Logo Mimika" fill sizes="40px" className="object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">Mimika DataHub</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Pusat data terintegrasi Kabupaten Mimika, Papua Tengah. Mewujudkan transparansi informasi pembangunan daerah yang akurat dan akuntabel.
                            </p>
                        </div>

                        {/* Kolom 2, 3, 4: Link Navigasi */}
                        <FooterColumn
                            title="LEMBAGA"
                            links={["Informasi Umum", "Struktur Organisasi", "Dasar Hukum", "Kontak Kami"]}
                        />
                        <FooterColumn
                            title="NAVIGASI"
                            links={["Katalog Data", "Metadata", "Microdata", "Publikasi Statistik"]}
                        />
                        <FooterColumn
                            title="BANTUAN"
                            links={["Panduan Pengguna", "Dokumentasi API", "FAQ", "Lapor Bug"]}
                        />
                    </div>

                    {/* BOTTOM BAR: Copyright & Legal */}
                    <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-500 gap-6 uppercase tracking-[0.2em]">
                        <p>© 2026 PEMERINTAH KABUPATEN MIMIKA. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
                            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* GLOBAL CUSTOM SCROLLBAR (Khusus untuk dropdown dan modal) */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
        </>
    );
}