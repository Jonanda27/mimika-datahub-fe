"use client";

import { useState, useEffect } from "react";
import { 
  Database, CloudUpload, Building, Star, Clock, 
  Flame, TrendingUp, Activity, AlertTriangle, Building2 
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

const OpdStatusRow = ({ opdName, date, status }: { opdName: string, date: string, status: StatusType }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl group">
    <div>
      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1e61d0] transition-colors">{opdName}</h4>
      <p className="text-[11px] text-gray-500 mt-1">Terakhir kirim: {date}</p>
    </div>
    <StatusBadge status={status} />
  </div>
);

// --- Chart Data ---
const chartData = [
  { name: 'Jan', score: 71 }, { name: 'Feb', score: 73 }, { name: 'Mar', score: 78 },
  { name: 'Apr', score: 75 }, { name: 'Mei', score: 80 }, { name: 'Jun', score: 82 },
  { name: 'Jul', score: 84 }, { name: 'Ags', score: 85 }, { name: 'Sep', score: 85 },
  { name: 'Okt', score: 86 }, { name: 'Nov', score: 87 }, { name: 'Des', score: 87 },
];

export default function ManagerDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi Loading Data Awal
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Dashboard" subtitle="Memuat ringkasan data..." />
        <LoadingState message="Menyiapkan statistik Mimika DataHub..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER BANNER - Menggunakan Komponen Global */}
      <PageHeader 
        title="Dashboard" 
        subtitle="Selamat datang di Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika" 
        withSearch 
      />

      {/* 2. SUMMARY CARDS - Menggunakan Komponen Global */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Dataset" value="12" icon={<Database size={22} />} iconBg="bg-[#7e57c2]" />
        <StatCard label="Sumber Data" value="7" icon={<CloudUpload size={22} />} iconBg="bg-[#ec407a]" />
        <StatCard label="OPD Aktif" value="8" icon={<Building size={22} />} iconBg="bg-[#29b6f6]" />
        <StatCard 
          label="Rata-rata Kualitas" value="87%" 
          icon={<Star size={22} fill="currentColor" />} iconBg="bg-[#66bb6a]" valueColor="text-[#66bb6a]" 
        />
      </div>

      {/* 3. DATA LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dataset Terbaru */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-gray-700" /> Dataset Terbaru
            </h3>
            <span className="text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter">Lihat semua →</span>
          </div>
          <div className="space-y-5">
            {[
              { title: "Jumlah Penduduk per Distrik 2025", src: "BPS Mimika", date: "15/3/2025" },
              { title: "Data Inflasi Bulanan Papua Tengah", src: "BPS Provinsi Papua Tengah", date: "14/3/2025" },
              { title: "Data Fasilitas Kesehatan per Distrik", src: "Dinas Kesehatan", date: "10/3/2025" },
              { title: "Data Tenaga Kesehatan Mimika", src: "Dinas Kesehatan", date: "8/3/2025" },
              { title: "Realisasi APBD Mimika 2025", src: "Bappeda Mimika", date: "5/3/2025" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{item.src} • {item.date}</p>
                </div>
                <span className="bg-[#ef4444] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg shadow-red-100">Baru</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset Populer */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Flame size={18} className="text-gray-700" /> Dataset Populer
            </h3>
            <span className="text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter">Lihat semua →</span>
          </div>
          <div className="space-y-5">
            {[
              { title: "RPJMD Mimika 2025-2029", src: "Bappeda Mimika", views: "567x" },
              { title: "RTRW Kabupaten Mimika", src: "BIG", views: "432x" },
              { title: "Angka Kemiskinan Kabupaten Mimika", src: "BPS Mimika", views: "423x" },
              { title: "Indeks Pembangunan Manusia (IPM)", src: "BPS Mimika", views: "378x" },
              { title: "Jumlah Penduduk per Distrik 2025", src: "BPS Mimika", views: "345x" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{item.src} • {item.views} diakses</p>
                </div>
                <TrendingUp size={18} className="text-[#ef4444]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GRAFIK & ALERT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tren Kualitas Data */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-7 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-gray-700" /> Tren Kualitas Data per Bulan
            </h3>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skor Kualitas (%)</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  formatter={(v) => [`${v}%`, "Skor"]} 
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ef4444" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} 
                  activeDot={{ r: 6, stroke: '#fca5a5', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peringatan Kualitas */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#ef4444]" /> Notifikasi Kualitas
            </h3>
            <span className="text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter">Kelola →</span>
          </div>
          <div className="space-y-4">
            <AlertCard title="Dinas Kesehatan" desc="Data Fasilitas Kesehatan - Skor Kualitas: 78%" />
            <AlertCard title="Dinas PU" desc="Data Jalan Kabupaten - Skor Kualitas: 75%" />
          </div>
        </div>
      </div>

      {/* 5. STATUS KIRIM OPD */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={18} className="text-gray-700" /> Kepatuhan Pengiriman OPD
          </h3>
          <span className="text-xs text-[#ef4444] font-bold cursor-pointer hover:underline uppercase tracking-tighter">Detail →</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="space-y-1">
            <OpdStatusRow opdName="Bappeda" date="01/03/2025" status="Lengkap" />
            <OpdStatusRow opdName="Dinas Kesehatan" date="08/03/2025" status="Kurang" />
            <OpdStatusRow opdName="Dinas Pendidikan" date="10/03/2025" status="Kurang" />
          </div>
          <div className="space-y-1">
            <OpdStatusRow opdName="Dinas PU" date="15/03/2025" status="Kurang" />
            <OpdStatusRow opdName="Dinas Sosial" date="Belum pernah" status="Belum Kirim" />
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2025 Mimika DataHub - Pusat Data Terintegrasi Kabupaten Mimika
      </footer>
    </div>
  );
}