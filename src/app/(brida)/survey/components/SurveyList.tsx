"use client";

import { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  HelpCircle, 
  Users, 
  Eye, 
  Database,
  Loader2,
  AlertCircle,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSurveyStore } from '@/src/app/store/useSurveyStore';
import { API_BASE_URL } from '@/src/app/lib/config';
import Link from 'next/link';

export default function SurveyList() {
  const { surveys, isLoading, error, fetchSurveys } = useSurveyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<number | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleGenerateDataset = async (id: number) => {
    try {
      setIsGenerating(id);
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch(`${API_BASE_URL}/v1/surveys/generate-dataset/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Gagal meng-generate dataset.");
      }

      alert('✅ Dataset berhasil digenerate dan dipublikasikan ke Katalog Utama!');
      fetchSurveys(); 
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memproses dataset.");
    } finally {
      setIsGenerating(null);
    }
  };

  const filteredSurveys = surveys.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="font-bold uppercase tracking-widest text-[10px]">Sinkronisasi data server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl flex flex-col items-center gap-4 border border-red-100 text-center animate-in zoom-in-95">
        <AlertCircle size={40} />
        <div>
          <p className="font-black text-lg">Gagal Memuat Data</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
        <button onClick={() => fetchSurveys()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-transform active:scale-95">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 leading-tight">Manajemen Survey</h3>
            <p className="text-xs text-gray-400 font-bold tracking-widest">Daftar Instrumen Aktif & Selesai</p>
          </div>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari judul atau lokasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      {/* GRID LIST */}
      <div className="grid gap-4">
        {filteredSurveys.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
            <ClipboardList size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">Tidak ada data survey yang ditemukan.</p>
          </div>
        ) : (
          filteredSurveys.map((survey: any) => (
            <div key={survey.id} className="group relative bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden">
              
              {/* Aksen Border Kiri */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${(survey.status === 'active' || survey.is_active) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

              {/* Info Utama */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                   <h4 className="font-black text-gray-800 text-xl group-hover:text-blue-600 transition-colors">{survey.title}</h4>
                   <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border ${
                    (survey.status === 'active' || survey.is_active) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                   }`}>
                    {(survey.status === 'active' || survey.is_active) ? 'Aktif' : 'Selesai'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <MapPin size={14} className="text-blue-500" />
                    {survey.location || 'Seluruh Wilayah Mimika'}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <HelpCircle size={14} className="text-blue-500" />
                    {survey.questions?.length || 0} Pertanyaan
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] bg-gray-50 w-fit px-3 py-1.5 rounded-lg">
                  <Calendar size={12} />
                  {formatDate(survey.start_date)} — {formatDate(survey.end_date)}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                <Link 
                  href={`/publik-survey/${survey.id}`}
                  target="_blank"
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest px-6 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-blue-200 text-gray-700 transition-all active:scale-95 shadow-sm"
                >
                  <Eye size={16} /> Preview
                </Link>

                {/* <button 
                  onClick={() => handleGenerateDataset(survey.id)}
                  disabled={isGenerating === survey.id}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 ${
                    isGenerating === survey.id 
                      ? 'bg-blue-900 text-white cursor-wait opacity-70' 
                      : 'bg-[#0f3460] text-white hover:bg-slate-800 shadow-blue-900/10'
                  }`}
                >
                  {isGenerating === survey.id ? (
                    <><Loader2 size={16} className="animate-spin" /> Sedang Proses</>
                  ) : (
                    <><Database size={16} /> Generate Dataset</>
                  )}
                </button> */}
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}