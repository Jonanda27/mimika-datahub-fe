"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  MapPin
} from "lucide-react";
import { surveyService } from "@/src/app/services/survey.service";

export default function PublicSurveyListPage() {
  // Kita menggunakan tipe any sementara atau menyesuaikan dengan JSON backend
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        setIsLoading(true);
        // Hit API GET /v1/surveys/list
        const data = await surveyService.getAllSurveys();
        
        // PERBAIKAN: Backend mengirimkan "status": "active", bukan is_active: true
        const activeSurveys = data.filter((s: any) => s.status === "active" || s.is_active === true);
        
        setSurveys(activeSurveys);
      } catch (err: any) {
        setError("Gagal memuat daftar survey. Silakan coba beberapa saat lagi.");
      } finally {
        setIsLoading(false);
      }
    };
    loadSurveys();
  }, []);

  // Filter tambahan untuk kolom pencarian
  const filteredSurveys = surveys.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper format tanggal (Indonesia)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-slate-900">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat katalog survey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Hero Section */}
      <div className="bg-[#0f3460] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Portal Survey Publik</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Partisipasi Anda membantu kami dalam merumuskan kebijakan pembangunan Kabupaten Mimika yang lebih baik.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 mb-10 flex items-center gap-3">
          <div className="pl-4 text-slate-400">
            <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Cari judul atau deskripsi survey..."
            className="w-full py-3 outline-none text-slate-700 font-medium bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* State Error */}
        {error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center shadow-sm">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-800 font-bold text-lg">{error}</p>
          </div>
        ) 
        /* State Data Tersedia */
        : filteredSurveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                
                {/* Ikon Card */}
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:bg-[#0f3460] group-hover:text-white transition-colors">
                  <ClipboardList size={24} />
                </div>
                
                {/* 1. Judul */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3.5rem] leading-snug">
                  {survey.title}
                </h3>
                
                {/* 2. Deskripsi */}
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {survey.description || "Mari berpartisipasi memberikan masukan melalui survey ini."}
                </p>

                {/* 3 & 4. Lokasi dan Tanggal */}
                <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" /> 
                    <span className="leading-relaxed">{survey.location || "Seluruh Wilayah (Umum)"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Calendar size={16} className="text-blue-500 shrink-0" /> 
                    <span>Dibuat: {formatDate(survey.created_at)}</span>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <Link 
                  href={`/publik-survey/${survey.id}`}
                  className="w-full bg-[#f4f7fb] text-[#0f3460] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-[#0f3460] group-hover:text-white transition-all shadow-sm"
                >
                  Isi Survey Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        ) 
        /* State Data Kosong (Setelah di-filter) */
        : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <ClipboardList size={64} className="mx-auto mb-4 text-slate-300" />
             <p className="text-lg font-bold text-slate-700 mb-1">Tidak Ada Survey</p>
             <p className="text-slate-500">Belum ada survey aktif yang tersedia saat ini atau pencarian tidak ditemukan.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 text-center text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-auto">
        © 2026 Mimika DataHub • BRIDA Kabupaten Mimika
      </footer>
    </div>
  );
}