"use client";

import { useEffect } from "react";
import { 
  Database, CloudUpload, Building, Star, Clock, 
  Flame, TrendingUp, Activity, AlertTriangle, Building2, Users 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";
import LoadingState from "@/components/ui/LoadingState";

// Integrasi Store
import { useStatsStore } from "@/src/app/store/useStatsStore";

// --- Internal Reusable Components ---
const AlertCard = ({ title, desc }: { title: string, desc: string }) => (
  <div className="bg-[#fff5f6] border-l-[3px] border-[#ef4444] rounded-xl p-4 mb-4 last:mb-0 shadow-sm transition-all hover:shadow-md">
    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
      <AlertTriangle size={16} className="text-[#f59e0b] fill-[#fef3c7]" /> 
      {title}
    </h4>
    <p className="text-xs text-gray-600">{desc}</p>
  </div>
);

const OpdStatusRow = ({ opdName, terkirim, target, status }: { opdName: string, terkirim: number, target: number, status: string }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl group">
    <div>
      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1e61d0] transition-colors">{opdName}</h4>
      <p className="text-[11px] text-gray-500 mt-1">Progres: {terkirim}/{target} Dataset</p>
    </div>
    <StatusBadge status={status === "Lengkap" ? "Lengkap" : "Kurang"} />
  </div>
);

export default function ManagerDashboardPage() {
  const { dashboardData, fetchMainStats, isLoading } = useStatsStore();

  // Fetch Data dari API saat komponen dimuat
  useEffect(() => {
    fetchMainStats();
  }, [fetchMainStats]);

  if (isLoading || !dashboardData) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        {/* Wrapper Container disamakan */}
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader title="Dashboard" subtitle="Memuat ringkasan data..." />
          <LoadingState message="Menyiapkan statistik Mimika DataHub..." />
        </div>
      </div>
    );
  }

  // Mapping data trend untuk Recharts (Bulan 1-12 ke Nama)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const formattedTrendData = dashboardData.quality_trend.map(item => ({
    name: monthNames[item.bulan - 1],
    score: item.skor
  }));

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      {/* Wrapper Container disamakan (max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8) */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <PageHeader 
          title="Dashboard Utama" 
          subtitle="Selamat datang di Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika" 
        />

        {/* 2. SUMMARY CARDS - Responsive Grid */}
        {/* Menggunakan grid-cols-2 untuk mobile (atas 2 bawah 2) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard 
            label="Total Dataset" 
            value={dashboardData.cards.total_dataset} 
            icon={<Database className="w-4 h-4 md:w-[22px] md:h-[22px]" />} 
            iconBg="bg-[#7e57c2]" 
          />
          <StatCard 
            label="Sumber Data" 
            value={dashboardData.cards.total_sumber} 
            icon={<Building className="w-4 h-4 md:w-[22px] md:h-[22px]" />} 
            iconBg="bg-[#29b6f6]" 
          />
          <StatCard 
            label="User Aktif" 
            value={dashboardData.cards.user_aktif} 
            icon={<Users className="w-4 h-4 md:w-[22px] md:h-[22px]" />} 
            iconBg="bg-[#ec407a]" 
          />
          <StatCard 
            label="Rata-rata Kualitas" 
            value={dashboardData.cards.rata_rata_kualitas} 
            icon={<Star className="w-4 h-4 md:w-[22px] md:h-[22px]" fill="currentColor" />} 
            iconBg="bg-[#66bb6a]" 
            valueColor="text-[#66bb6a]" 
          />
        </div>

        {/* 3. DATA LISTS - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Dataset Terbaru - DIBATASI 2 DATA */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-7">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-gray-700 shrink-0" /> Dataset Terbaru
              </h3>
              <span className="text-[10px] md:text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter shrink-0">Lihat semua →</span>
            </div>
            <div className="space-y-5">
              {dashboardData.recent.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between items-center group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="max-w-[70%]">
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors truncate">{item.title}</h4>
                    <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 font-medium">Tahun {item.year} • {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className="bg-[#ef4444] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-md shadow-red-100 shrink-0">Baru</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Populer - DIBATASI 2 DATA */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-7">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                <Flame size={18} className="text-gray-700 shrink-0" /> Dataset Populer
              </h3>
              <span className="text-[10px] md:text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter shrink-0">Lihat semua →</span>
            </div>
            <div className="space-y-5">
              {dashboardData.popular.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between items-center group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="max-w-[80%]">
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors truncate">{item.title}</h4>
                    <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 font-medium">{item.total_rows} Record • {item.quality_score}% Kualitas</p>
                  </div>
                  <TrendingUp size={16} className="md:w-[18px] md:h-[18px] text-[#ef4444] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. GRAFIK & ALERT - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Tren Kualitas Data */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-7 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-gray-700 shrink-0" /> Tren Kualitas Data per Bulan
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
                 <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skor Kualitas (%)</span>
              </div>
            </div>
            <div className="h-[250px] md:h-[280px] w-full -ml-4 sm:ml-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedTrendData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                    formatter={(v) => [`${v}%`, "Skor"]} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} 
                    activeDot={{ r: 6, stroke: '#fca5a5', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peringatan Kualitas */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-7">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#ef4444] shrink-0" /> Notifikasi Kualitas
              </h3>
              <span className="text-[10px] md:text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter shrink-0">Kelola →</span>
            </div>
            <div className="space-y-4">
              {dashboardData.popular.filter(d => d.quality_score < 80).length > 0 ? (
                  dashboardData.popular.filter(d => d.quality_score < 80).map(d => (
                      <AlertCard key={d.id} title={d.title} desc={`Skor Kualitas terdeteksi rendah: ${d.quality_score}%`} />
                  ))
              ) : (
                  <p className="text-xs text-gray-400 italic text-center py-10">Tidak ada peringatan kualitas saat ini.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-6 md:mt-8 text-center text-gray-400 text-[9px] md:text-[10px] font-medium tracking-widest uppercase pb-4">
          © 2026 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
        </footer>
      </div>
    </div>
  );
}