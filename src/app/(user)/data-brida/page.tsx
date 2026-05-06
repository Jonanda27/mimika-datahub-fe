"use client";

import { useState, useEffect } from "react";
import { 
  Plus, List, BarChart3, Database, 
  MapPin, Calendar, Save, Eye, 
  DownloadCloud, RotateCcw, Star, Search,
  Activity, Users
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";

// Data Dummy untuk Grafik Hasil Survey
const surveyResultData = [
  { name: 'Sangat Puas', score: 65 },
  { name: 'Puas', score: 25 },
  { name: 'Cukup', score: 7 },
  { name: 'Kurang', score: 3 },
];

export default function DataBridaPage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi Loading Data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Data BRIDA" subtitle="Menyiapkan modul survey..." />
        <LoadingState message="Menghubungkan ke sistem pengumpulan data BRIDA..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER BANNER - Menggunakan Komponen Global */}
      <PageHeader 
        title="Data BRIDA" 
        subtitle="Survey Builder | Pengumpulan Data Mandiri | Sensus Lokal" 
        withSearch 
      />

      {/* 2. STATISTIC CARDS - Menggunakan Komponen Global */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Survey" 
          value="2" 
          icon={<List size={22} />} 
          iconBg="bg-blue-600" 
        />
        <StatCard 
          label="Survey Aktif" 
          value="1" 
          icon={<Activity size={22} />} 
          iconBg="bg-[#ec407a]" 
        />
        <StatCard 
          label="Total Responden" 
          value="684" 
          icon={<Users size={22} />} 
          iconBg="bg-[#f59e0b]" 
        />
        <StatCard 
          label="Dataset Terbentuk" 
          value="1" 
          icon={<Database size={22} />} 
          iconBg="bg-emerald-500" 
        />
      </div>

      {/* 3. TAB NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton 
          active={activeTab === 'builder'} 
          onClick={() => setActiveTab("builder")} 
          icon={<Plus size={16} />} 
          label="Survey Builder" 
        />
        <TabButton 
          active={activeTab === 'daftar'} 
          onClick={() => setActiveTab("daftar")} 
          icon={<List size={16} />} 
          label="Daftar Survey" 
        />
        <TabButton 
          active={activeTab === 'hasil'} 
          onClick={() => setActiveTab("hasil")} 
          icon={<BarChart3 size={16} />} 
          label="Hasil Survey" 
        />
        <TabButton 
          active={activeTab === 'sensus'} 
          onClick={() => setActiveTab("sensus")} 
          icon={<Database size={16} />} 
          label="Data Sensus Lokal" 
        />
      </div>

      {/* 4. CONTENT AREA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
        
        {/* --- TAB: SURVEY BUILDER --- */}
        {activeTab === "builder" && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Plus size={18} className="text-[#ef4444]" /> Buat Instrumen Survey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Survey *</label>
                <input type="text" placeholder="Contoh: Survey Kepuasan Layanan Publik 2025" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Lokasi Cakupan</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Mimika Baru, Mimika Timur, dll" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Mulai</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="date" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Selesai</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="date" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tujuan & Deskripsi</label>
              <textarea rows={3} placeholder="Jelaskan tujuan survey..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"></textarea>
            </div>
            <div className="flex justify-between items-center border-t border-gray-50 pt-6">
              <button className="bg-[#0f2a50] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#1a3a63] transition-all shadow-lg shadow-blue-100">
                <Plus size={14} /> Tambah Pertanyaan
              </button>
              <button className="bg-[#10b981] text-white px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all active:scale-95">
                <Save size={18} /> Simpan Instrumen
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: DAFTAR SURVEY --- */}
        {activeTab === "daftar" && (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
              <List size={18} className="text-[#ef4444]" /> Survey Tersedia
            </h3>
            <div className="space-y-4">
              {[
                { title: "Survey Kepuasan Layanan Publik 2025", location: "Mimika Baru", questions: "1", respondents: "450", period: "Feb 2025", status: "Selesai", statusColor: "bg-gray-100 text-gray-600 border-gray-200" },
                { title: "Survey Kesejahteraan Masyarakat", location: "Seluruh Mimika", questions: "2", respondents: "234", period: "Mar 2025", status: "Aktif", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-gray-100 rounded-3xl hover:shadow-xl hover:border-blue-100 transition-all gap-4 group bg-gray-50/30">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{item.location} • {item.questions} Pertanyaan • {item.respondents} Responden</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-tighter">Periode: {item.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${item.statusColor}`}>{item.status}</span>
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm"><Eye size={14}/> Preview</button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0f2a50] text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-blue-50"><Database size={14}/> Generate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: HASIL SURVEY --- */}
        {activeTab === "hasil" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                 <BarChart3 size={18} className="text-[#ef4444]" /> Analitik Pengumpulan Data
               </h3>
               <select className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Survey Kepuasan Layanan 2025</option>
               </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="h-[300px] w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={surveyResultData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="score" name="Jawaban (%)" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Metadata Survey</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Responden:</span><span className="font-bold text-gray-800">450</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Periode:</span><span className="font-bold text-gray-800 text-right">Feb 2025</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Validasi:</span><span className="font-bold text-emerald-600">98.2%</span></div>
                  </div>
                </div>
                <button className="w-full bg-[#10b981] text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50">
                  <DownloadCloud size={16} /> EXPORT CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: DATA SENSUS LOKAL --- */}
        {activeTab === "sensus" && (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Database size={18} className="text-[#ef4444]" /> Database Sensus BRIDA
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Cari nama dataset..." className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" />
              </div>
              <button className="bg-[#ef4444] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-50">Filter</button>
              <button className="bg-slate-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-600 transition-all shadow-lg shadow-slate-50"><RotateCcw size={14}/> Reset</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-4">Nama Dataset</th>
                    <th className="px-4 py-4 text-center">Tahun</th>
                    <th className="px-4 py-4 text-center">Record</th>
                    <th className="px-4 py-4 text-center">Skor Kualitas</th>
                    <th className="px-4 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { name: "Sensus Penduduk Lokal Mimika 2024", year: "2024", record: "125,000", quality: "92%" },
                    { name: "Pendataan Potensi Desa (Podes) 2024", year: "2024", record: "185", quality: "94%" },
                    { name: "Data UMKM Binaan BRIDA 2025", year: "2025", record: "1,245", quality: "88%" }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-4 font-bold text-gray-800 group-hover:text-blue-600 transition-colors whitespace-normal max-w-xs">{item.name}</td>
                      <td className="px-4 py-4 text-center text-gray-500 font-medium">{item.year}</td>
                      <td className="px-4 py-4 text-center text-gray-400 font-black">{item.record}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">{item.quality}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                          <Eye size={14}/> DETAIL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Badan Riset dan Inovasi Daerah (BRIDA)
      </footer>
    </div>
  );
}

// --- Internal Helper Component ---

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 ${
        active 
          ? 'bg-[#ef4444] text-white shadow-xl shadow-red-100 border border-[#ef4444]' 
          : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
      }`}
    >
      {icon}
      <span className="uppercase tracking-tighter">{label}</span>
    </button>
  );
}