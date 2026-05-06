"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, Bell, Filter, Download, 
  Info, CheckCircle, AlertTriangle, XCircle, 
  Activity, Users, Send, X 
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";
import LoadingState from "@/components/ui/LoadingState";

// --- Types ---
interface OpdPerformance {
  opd_name: string;
  datasets_sent: number;
  datasets_required: number;
  last_submit: string | null;
  status: StatusType;
  quality_avg: number;
  contact: string;
  phone: string;
}

export default function MonitoringOpdPage() {
  // --- States ---
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOpd, setSelectedOpd] = useState<OpdPerformance | null>(null);

  // --- Data Dummy ---
  const [opdData] = useState<OpdPerformance[]>([
    { opd_name: "Bappeda", datasets_sent: 12, datasets_required: 12, last_submit: "2025-03-01", status: "Lengkap", quality_avg: 88, contact: "bappeda@mimikakab.go.id", phone: "0821-1234-5678" },
    { opd_name: "Dinas Kesehatan", datasets_sent: 10, datasets_required: 12, last_submit: "2025-03-08", status: "Kurang", quality_avg: 75, contact: "dinkes@mimikakab.go.id", phone: "0821-1234-5679" },
    { opd_name: "Dinas Pendidikan", datasets_sent: 10, datasets_required: 12, last_submit: "2025-03-10", status: "Kurang", quality_avg: 82, contact: "disdik@mimikakab.go.id", phone: "0821-1234-5680" },
    { opd_name: "Dinas PU", datasets_sent: 7, datasets_required: 12, last_submit: "2025-03-15", status: "Kurang", quality_avg: 68, contact: "dinaspu@mimikakab.go.id", phone: "0821-1234-5681" },
    { opd_name: "Dinas Sosial", datasets_sent: 0, datasets_required: 12, last_submit: null, status: "Belum Kirim", quality_avg: 0, contact: "dinsos@mimikakab.go.id", phone: "0821-1234-5682" },
    { opd_name: "Dinas Perhubungan", datasets_sent: 10, datasets_required: 12, last_submit: "2025-03-14", status: "Kurang", quality_avg: 81, contact: "dishub@mimikakab.go.id", phone: "0821-1234-5683" },
    { opd_name: "Dinas Kependudukan", datasets_sent: 12, datasets_required: 12, last_submit: "2025-03-04", status: "Lengkap", quality_avg: 92, contact: "dukcapil@mimikakab.go.id", phone: "0821-1234-5686" },
  ]);

  // Simulasi Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return opdData.filter(o => {
      const matchesSearch = o.opd_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, opdData]);

  // --- Stats Calculation ---
  const summaryStats = useMemo(() => ({
    total: opdData.length,
    lengkap: opdData.filter(o => o.status === 'Lengkap').length,
    kurang: opdData.filter(o => o.status === 'Kurang').length,
    belum: opdData.filter(o => o.status === 'Belum Kirim').length,
  }), [opdData]);

  // --- Chart Data ---
  const pieData = [
    { name: 'Lengkap', value: summaryStats.lengkap, color: '#10b981' },
    { name: 'Kurang', value: summaryStats.kurang, color: '#f59e0b' },
    { name: 'Belum Kirim', value: summaryStats.belum, color: '#ef4444' },
  ];

  const trendData = [
    { name: 'Okt', score: 68 }, { name: 'Nov', score: 72 }, { name: 'Des', score: 70 },
    { name: 'Jan', score: 75 }, { name: 'Feb', score: 78 }, { name: 'Mar', score: 82 },
  ];

  const handleExportCSV = () => {
    const headers = "No,OPD,Terkirim,Target,Status,Terakhir Kirim\n";
    const rows = filteredData.map((o, i) => 
      `${i+1},${o.opd_name},${o.datasets_sent},${o.datasets_required},${o.status},${o.last_submit || '-'}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring_opd_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans">
        <PageHeader title="Monitoring OPD" subtitle="Menghubungkan ke profil kepatuhan..." />
        <LoadingState message="Menganalisis data pengiriman seluruh OPD..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen p-6 font-sans animate-in fade-in duration-500">
      {/* 1. HEADER BANNER - Global Component */}
      <PageHeader 
        title="Monitoring OPD" 
        subtitle="Pantau kepatuhan dan status pengiriman data dari seluruh OPD Kabupaten Mimika" 
      />

      {/* 2. STATS GRID - Global Component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total OPD" value={summaryStats.total} icon={<Users size={22} />} iconBg="bg-blue-600" />
        <StatCard label="Lengkap" value={summaryStats.lengkap} icon={<CheckCircle size={22} />} iconBg="bg-emerald-500" />
        <StatCard label="Kurang / Telat" value={summaryStats.kurang} icon={<AlertTriangle size={22} />} iconBg="bg-amber-500" />
        <StatCard label="Belum Kirim" value={summaryStats.belum} icon={<XCircle size={22} />} iconBg="bg-red-500" />
      </div>

      {/* 3. CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" /> Status Pengiriman Data (Bulan Ini)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" /> Tren Kepatuhan OPD (6 Bulan)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex flex-wrap gap-4 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama OPD..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Lengkap">Lengkap</option>
            <option value="Kurang">Kurang</option>
            <option value="Belum Kirim">Belum Kirim</option>
          </select>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button onClick={() => alert("🔔 Reminder massal dikirim!")} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#ef4444] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-100 active:scale-95 transition-all">
            <Send size={16} /> REMINDER
          </button>
          <button onClick={handleExportCSV} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-100 active:scale-95 transition-all">
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* 5. TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-black">Nama OPD</th>
                <th className="px-6 py-4 font-black">Terakhir Kirim</th>
                <th className="px-6 py-4 text-center font-black">Status</th>
                <th className="px-6 py-4 font-black">Progres Wajib</th>
                <th className="px-6 py-4 text-center font-black">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((o, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors">{o.opd_name}</td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{o.last_submit ? new Date(o.last_submit).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${(o.datasets_sent / o.datasets_required) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-400">{o.datasets_sent}/{o.datasets_required}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => alert(`🔔 Reminder dikirim ke ${o.opd_name}`)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Bell size={18} />
                      </button>
                      <button onClick={() => setSelectedOpd(o)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <Info size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. DETAIL MODAL */}
      {selectedOpd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Detail Profil OPD
              </h3>
              <button onClick={() => setSelectedOpd(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-4 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Instansi</p>
                 <h4 className="text-lg font-black text-gray-800">{selectedOpd.opd_name}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status Saat Ini</p>
                  <StatusBadge status={selectedOpd.status} />
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rerata Kualitas</p>
                  <p className="text-2xl font-black text-blue-600">{selectedOpd.quality_avg}%</p>
                </div>
              </div>
              <div className="space-y-4 text-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <DetailRow label="Kontak Email" value={selectedOpd.contact} />
                <DetailRow label="No. Telepon" value={selectedOpd.phone} />
                <DetailRow label="Dataset Terkirim" value={`${selectedOpd.datasets_sent} dari ${selectedOpd.datasets_required}`} />
                <DetailRow label="Terakhir Submit" value={selectedOpd.last_submit || "Belum pernah"} />
              </div>
              <button 
                onClick={() => { alert(`Reminder terkirim ke ${selectedOpd.opd_name}`); setSelectedOpd(null); }}
                className="w-full bg-[#ef4444] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-600 transition-all active:scale-95"
              >
                <Send size={16} /> Kirim Pesan Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase">
        © 2026 Mimika DataHub - Sistem Monitoring Kepatuhan Pengiriman Data
      </footer>
    </div>
  );
}

// --- Local Helper Component ---
function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
      <span className="text-gray-400 font-bold uppercase text-[10px] tracking-tighter">{label}:</span>
      <span className="text-gray-800 font-black text-xs">{value}</span>
    </div>
  );
}