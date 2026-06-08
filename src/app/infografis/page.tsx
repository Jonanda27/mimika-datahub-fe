"use client";
import React, { useState } from "react";
import Navbar from "@/src/components/landing/Navbar";
import Footer from "@/src/components/landing/Footer";
import InfographicCard from "@/src/components/infografis/InfographicCard";
import InfographicModal from "@/src/components/infografis/InfographicModal";
import InfographicPagination from "@/src/components/infografis/InfographicPagination";
import { Search, ChevronLeft } from "lucide-react";
import Link from "next/link";

// MOCK DATA (Ganti dengan API nanti)
const ALL_DATA = [
    // --- KATEGORI EKONOMI ---
    { id: 1, title: "Laporan Pertumbuhan Ekonomi", category: "Ekonomi", image: "/infografik/ekonomi/ekonomi-01.jpg", date: "18 Mei 2026" },
    { id: 2, title: "Analisis PDRB Perkapita", category: "Ekonomi", image: "/infografik/ekonomi/ekonomi-02.jpg", date: "15 Mei 2026" },
    { id: 3, title: "Statistik Investasi Daerah", category: "Ekonomi", image: "/infografik/ekonomi/ekonomi-03.jpg", date: "10 Mei 2026" },
    { id: 4, title: "Laju Inflasi Bulanan", category: "Ekonomi", image: "/infografik/ekonomi/ekonomi-04.jpg", date: "05 Mei 2026" },

    // --- KATEGORI KESEHATAN ---
    { id: 5, title: "Data Penurunan Stunting", category: "Kesehatan", image: "/infografik/kesehatan/kesehatan-01.jpg", date: "18 Mei 2026" },
    { id: 6, title: "Cakupan Imunisasi Anak", category: "Kesehatan", image: "/infografik/kesehatan/kesehatan-02.jpg", date: "12 Mei 2026" },
    { id: 7, title: "Sebaran Fasilitas Kesehatan", category: "Kesehatan", image: "/infografik/kesehatan/kesehatan-03.jpg", date: "08 Mei 2026" },
    { id: 8, title: "Statistik Imunisasi Nasional", category: "Kesehatan", image: "/infografik/kesehatan/kesehatan-04.jpg", date: "01 Mei 2026" },

    // --- KATEGORI SOSIAL ---
    { id: 9, title: "Piramida Penduduk Mimika", category: "Sosial", image: "/infografik/sosial/sosial-01.jpg", date: "18 Mei 2026" },
    { id: 10, title: "Tingkat Pengangguran Masyarakat", category: "Sosial", image: "/infografik/sosial/sosial-02.jpg", date: "14 Mei 2026" },
    { id: 11, title: "Bantuan Sosial Masyarakat", category: "Sosial", image: "/infografik/sosial/sosial-03.jpg", date: "10 Mei 2026" },
    { id: 12, title: "Index Pendidikan", category: "Sosial", image: "/infografik/sosial/sosial-04.jpg", date: "05 Mei 2026" },
];

const CATEGORIES = ["Semua", "Ekonomi", "Kesehatan", "Sosial"];

export default function InfografisPage() {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("Semua");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<any>(null);
    const itemsPerPage = 8;

    const filtered = ALL_DATA.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (cat === "Semua" || item.category === cat)
    );

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* HERO / SEARCH AREA */}
            <header className="bg-white border-b border-gray-200 pt-12 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#0071bc] font-bold text-[10px] uppercase tracking-[0.2em] mb-8 hover:underline">
                        <ChevronLeft size={14} /> Kembali ke Beranda
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-xl">
                            <h1 className="text-4xl font-black text-[#002244] uppercase tracking-tighter leading-none mb-4">
                                Pusat <span className="text-[#0071bc]">Visualisasi</span> Data
                            </h1>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                Eksplorasi ribuan data statistik sektoral Kabupaten Mimika dalam format visual yang ringkas, akurat, dan mudah dipahami.
                            </p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Cari infografik..."
                                className="w-full bg-slate-50 border border-gray-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-[#0071bc] transition-all"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* FILTER BAR */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map(c => (
                        <button
                            key={c}
                            onClick={() => { setCat(c); setPage(1); }}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all ${cat === c ? "bg-[#002244] text-white border-[#002244]" : "bg-white text-gray-500 border-gray-200 hover:border-[#0071bc]"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginated.map(item => (
                        <InfographicCard key={item.id} item={item} onClick={() => setSelected(item)} />
                    ))}
                </div>

                {/* PAGINATION */}
                <InfographicPagination
                    totalItems={filtered.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </main>

            <Footer />

            {/* MODAL */}
            {selected && <InfographicModal item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}