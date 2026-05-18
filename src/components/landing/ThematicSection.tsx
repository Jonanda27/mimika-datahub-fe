"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import ThemeCard from "./ThemeCard";
import { useDatasetStore } from "@/src/app/store/useDatasetStore";

export default function ThematicSection() {
    // Mengambil data langsung dari store agar page.tsx tetap bersih
    const { datasetsByCategory, isCategoryLoading } = useDatasetStore();

    return (
        <section id="tematik" className="py-20 bg-white relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Header Section: Rata kiri-kanan responsif */}
                <div className="border-b-4 border-[#0071bc] pb-6 flex flex-col md:flex-row justify-between items-end gap-4 text-black">
                    <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002244] uppercase tracking-tight">
                            Fokus Tematik
                        </h2>
                        <p className="mt-4 text-gray-500 text-lg max-w-4xl font-light leading-relaxed">
                            Koleksi data terkurasi untuk mendukung perencanaan pembangunan Kabupaten Mimika melalui fokus tematik Satu Data Indonesia.
                        </p>
                    </div>

                    {isCategoryLoading && (
                        <div className="flex items-center gap-2 text-[#0071bc] font-bold mb-1">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="text-xs uppercase tracking-widest">Memuat Data...</span>
                        </div>
                    )}
                </div>

                {/* Grid Kartu: Responsive 1 (HP), 2 (Tablet), 5 (Desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {!isCategoryLoading &&
                        Object.entries(datasetsByCategory).map(([categoryName, group]) => {
                            const ds = group.datasets[0];
                            if (!ds) return null;

                            return (
                                <ThemeCard
                                    key={categoryName}
                                    title={ds.title || categoryName}
                                    description={ds.description || ""}
                                    year={ds.year || "-"}
                                    sourceName={ds.source_name || "-"}
                                    sourceType={ds.source_type_id || ""}
                                    profileLink={group.category_info.name || "Kategori"}
                                    imagePath={group.category_info.template_url || ""}
                                    bgImage={ds.image_url || ""}
                                />
                            );
                        })}
                </div>

            </div>
        </section>
    );
}