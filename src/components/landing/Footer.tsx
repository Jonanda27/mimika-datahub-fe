"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
    name: string;
    href: string;
    external?: boolean;
}

// --- SUB-COMPONENT: FOOTER COLUMN ---
function FooterColumn({ title, links }: { title: string, links: FooterLink[] }) {
    return (
        <div>
            <h4 className="text-blue-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {title}
            </h4>
            <ul className="space-y-3">
                {links.map((link, i) => (
                    <li key={i}>
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white text-[13px] transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                href={link.href}
                                className="text-gray-400 hover:text-white text-[13px] transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        )}
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
                                    <Image src="/logo-govdatahub.svg" alt="Logo GovDataHub" fill sizes="40px" className="object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">GovDataHub</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Pusat data dan analitik geospasial terintegrasi Pemerintah Daerah. Mewujudkan transparansi informasi pembangunan daerah yang akurat dan akuntabel.
                            </p>
                        </div>

                        {/* Kolom 2: Lembaga */}
                        <FooterColumn
                            title="LEMBAGA"
                            links={[
                                { name: "Tentang GovDataHub", href: "/about" },
                                { name: "Dasar Hukum & Regulasi", href: "/about" },
                                { name: "Badan Perencanaan Daerah (Bappeda)", href: "#" },
                                { name: "Portal Masuk Petugas", href: "/login" },
                            ]}
                        />

                        {/* Kolom 3: Navigasi Data */}
                        <FooterColumn
                            title="NAVIGASI DATA"
                            links={[
                                { name: "Data Sektoral Pemerintah", href: "/public-data-pemerintah" },
                                { name: "Data Mitra Non-Pemerintah", href: "/public-data-non-pemerintah" },
                                { name: "WebGIS Peta Tematik", href: "/explorer" },
                                { name: "Atlas Indikator Pembangunan", href: "/atlas" },
                                { name: "Galeri Infografis", href: "/infografis" },
                                { name: "Partisipasi Survei BRIDA", href: "/publik-survey" },
                            ]}
                        />

                        {/* Kolom 4: Bantuan & Panduan */}
                        <FooterColumn
                            title="BANTUAN"
                            links={[
                                { name: "Panduan Sistem", href: "/about" },
                                { name: "Satu Data Indonesia", href: "https://data.go.id", external: true },
                                { name: "Kontak Administrator", href: "mailto:bappeda@pemda.go.id", external: true },
                            ]}
                        />
                    </div>

                    {/* BOTTOM BAR: Copyright & Legal */}
                    <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-500 gap-6 uppercase tracking-[0.2em]">
                        <p>© 2026 GOVDATAHUB. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-6">
                            <Link href="/about" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                            <Link href="/about" className="hover:text-white transition-colors">Ketentuan Layanan</Link>
                            <Link href="/explorer" className="hover:text-white transition-colors">Sitemap Peta</Link>
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
