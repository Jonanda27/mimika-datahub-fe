"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// DATA BERITA (Dipindah ke sini agar modular)
const NEWS_DATA = {
    featured: {
        id: 1,
        title: "Freeport Setor Tambahan Rp2,88 Triliun untuk Pemda di Papua Tengah dari Bagian Keuntungan Bersih 2025",
        date: "08 Mei 2026",
        category: "Ekonomi dan Pembangunan",
        excerpt: "PT Freeport Indonesia (PTFI) pada tanggal 8 April 2026 menyetorkan Rp2,88 triliun bagian keuntungan bersih tahun 2025 kepada Pemerintah Provinsi Papua Tengah termasuk delapan kabupaten di wilayahnya sebagai tambahan dari setoran sebesar Rp10,6 trilliun yang sudah dibayarkan sepanjang tahun 2025.",
        image: "/berita.jpeg",
        url: "https://beritamimika.com"
    },
    list: [
        {
            id: 2,
            title: "8 Pemuda Suku Kamoro Lulus IPN, Siap Kerja di Industri Perhotelan",
            date: "12 Mei 2026",
            category: "Ekonomi dan Pembangunan",
            image: "/berita2.jpeg",
            url: "https://beritamimika.com"
        },
        {
            id: 3,
            title: "Kadisperindag : Harga LPG 12 Kg di Outlet Harus Rp390 Ribu",
            date: "08 Mei 2026",
            category: "Ekonomi dan Pembangunan",
            image: "/berita3.jpeg",
            url: "https://beritamimika.com"
        },
        {
            id: 4,
            title: "Warga Mimika Masih Bandel, Mickey Mouse Akhirnya Turun ke Jalan",
            date: "02 Februari 2021",
            category: "Kesehatan",
            image: "/berita4.jpeg",
            url: "https://beritamimika.com"
        }
    ]
};

export default function NewsSection() {
    return (
        <section className="py-20 bg-[#f8fafc] border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER SECTION */}
                <div className="flex justify-between items-end mb-10 border-b-4 border-[#0071bc] pb-6">
                    <h2 className="text-3xl font-bold text-[#002244] uppercase tracking-tight">
                        Berita & Publikasi
                    </h2>
                    <a
                        href="https://beritamimika.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex text-[#0071bc] font-bold text-sm items-center gap-1 hover:text-[#002244] transition-colors uppercase tracking-widest"
                    >
                        Lihat Semua <ArrowRight size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* KOLOM KIRI: BERITA UTAMA (FEATURED) */}
                    <a
                        href={NEWS_DATA.featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lg:col-span-2 group flex flex-col"
                    >
                        <div className="relative w-full h-72 md:h-112.5 rounded-2xl overflow-hidden mb-6 shadow-sm">
                            <Image
                                src={NEWS_DATA.featured.image}
                                alt={NEWS_DATA.featured.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-[#0071bc] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                                {NEWS_DATA.featured.category}
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-3">
                            {NEWS_DATA.featured.date}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-[#002244] mb-4 group-hover:text-[#0071bc] transition-colors leading-tight">
                            {NEWS_DATA.featured.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 grow">
                            {NEWS_DATA.featured.excerpt}
                        </p>
                        <span className="text-[#0071bc] font-bold text-sm uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                            Baca Selengkapnya <ArrowRight size={16} />
                        </span>
                    </a>

                    {/* KOLOM KANAN: DAFTAR BERITA LAINNYA */}
                    <div className="flex flex-col gap-8 lg:border-l border-gray-200 lg:pl-10">
                        {NEWS_DATA.list.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-5 group items-start"
                            >
                                <div className="relative w-28 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1.5">
                                        {item.date} • {item.category}
                                    </p>
                                    <h4 className="text-sm font-bold text-[#002244] leading-snug group-hover:text-[#0071bc] transition-colors line-clamp-3">
                                        {item.title}
                                    </h4>
                                </div>
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}