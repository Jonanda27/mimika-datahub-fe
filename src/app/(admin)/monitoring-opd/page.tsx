"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, Filter, Download, 
  Info, CheckCircle, AlertTriangle, XCircle, 
  Activity, Users, Send, X, Bell 
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingState from "@/components/ui/LoadingState";

// Integrasi Store & Types
import { useMonitoringStore } from "@/src/app/store/useMonitoringStore";
import { MonitoringTableData } from "@/src/app/types/monitoring";

export default function MonitoringOpdPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // --- Store States & Actions ---
  const { summaryData, fetchSummary, sendReminder, isLoading, error } = useMonitoringStore();

  // --- Local UI States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOpd, setSelectedOpd] = useState<MonitoringTableData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchSummary();
  }, [fetchSummary]);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    if (!summaryData) return [];
    return summaryData.table_data.filter(o => {
      const matchesSearch = o.opd_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, summaryData]);

  // --- Chart Data Mapping ---
  const pieData = useMemo(() => {
    if (!summaryData) return [];
    return [
      { name: 'Lengkap', value: summaryData.pie_chart.Lengkap, color: '#10b981' },
      { name: 'Kurang', value: summaryData.pie_chart.Kurang, color: '#f59e0b' },
      { name: 'Belum Kirim', value: summaryData.pie_chart["Belum Kirim"], color: '#ef4444' },
    ];
  }, [summaryData]);

  // --- Handlers ---
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = "No,OPD,Username,Email,Terkirim,Status,Kualitas Rerata,Terakhir Kirim\n";
    const rows = filteredData.map((o, i) => 
      `${i+1},${o.opd_name},${o.username},${o.email},${o.upload_count},${o.status},${o.avg_quality}%,${o.last_submit || '-'}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring_opd_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendReminder = async (userId: number) => {
    if (confirm("Kirim notifikasi pengingat ke OPD ini?")) {
      await sendReminder(userId);
    }
  };

  if (!isMounted || (isLoading && !summaryData)) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        <div className="max-w-350 mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader title="Monitoring OPD" subtitle="Menghubungkan ke profil kepatuhan..." />
            <LoadingState message="Menyiapkan sistem monitoring..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="text-center bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-red-100 w-full max-w-md">
           <XCircle className="text-red-500 mx-auto mb-4" size={48} />
           <h3 className="text-lg font-bold text-gray-800">Gagal Memuat Data</h3>
           <p className="text-gray-500 mb-6 text-sm">{error}</p>
           <button onClick={() => fetchSummary()} className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      {/* WRAPPER UTAMA */}
      <div className="w-full max-w-350 mx-auto p-4 md:p-6 lg:p-8 overflow-x-hidden">
        
        <PageHeader 
            title="Monitoring OPD" 
            subtitle="Pantau kepatuhan dan status pengiriman data dari seluruh OPD Kabupaten Mimika" 
        />

        {/* STATS GRID */}
        {/* Responsive: 2 kolom di HP (2 atas 2 bawah), 4 kolom di Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            <StatCard label="Total OPD" value={summaryData?.cards.total_opd || 0} icon={<Users className="w-4 h-4 md:w-5 md:h-5" />} iconBg="bg-blue-600" />
            <StatCard label="Lengkap" value={summaryData?.cards.lengkap || 0} icon={<CheckCircle className="w-4 h-4 md:w-5 md:h-5" />} iconBg="bg-emerald-500" />
            <StatCard label="Kurang" value={summaryData?.cards.kurang || 0} icon={<AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />} iconBg="bg-amber-500" />
            <StatCard label="Belum Kirim" value={summaryData?.cards.belum_kirim || 0} icon={<XCircle className="w-4 h-4 md:w-5 md:h-5" />} iconBg="bg-red-500" />
        </div>

        {/* CHARTS SECTION */}
        {/* Responsive: 1 kolom di layar < LG, 2 kolom sejajar di layar >= LG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Pie Chart */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Activity size={18} className="text-blue-500 shrink-0" /> Status Pengiriman Data (Bulan Ini)
                </h3>
                <div className="h-62.5 md:h-70">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Activity size={18} className="text-red-500 shrink-0" /> Tren Kepatuhan OPD (% Lengkap)
                </h3>
                <div className="h-62.5 md:h-70 -ml-4 sm:ml-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={summaryData?.line_chart || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={(v) => `${v}%`} width={40} />
                        <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                        <Line type="monotone" dataKey="persentase" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{r: 6}} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* FILTER & DATA TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* TOOLBAR */}
            <div className="p-4 md:p-5 border-b border-gray-50 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                
                <div className="flex flex-col sm:flex-row flex-1 w-full gap-3">
                    {/* Input Search */}
                    <div className="relative flex-1 w-full lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari nama OPD..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Select Filter */}
                    <select 
                        className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="Lengkap">Lengkap</option>
                        <option value="Kurang">Kurang</option>
                        <option value="Belum Kirim">Belum Kirim</option>
                    </select>
                </div>

                {/* Export Button */}
                <button onClick={handleExportCSV} className="w-full lg:w-auto flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all">
                    <Download size={16} /> EXPORT CSV
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-200">
                    <thead className="bg-gray-50/50 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 sm:py-5">Nama OPD / Instansi</th>
                            <th className="px-4 sm:px-6 py-4 sm:py-5">Terakhir Kirim</th>
                            <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">Status Kepatuhan</th>
                            <th className="px-4 sm:px-6 py-4 sm:py-5">Progres Dataset</th>
                            <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.length > 0 ? filteredData.map((o) => (
                        <tr key={o.user_id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 group-hover:text-[#1e61d0] transition-colors whitespace-normal min-w-50">
                                {o.opd_name}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-400 font-medium text-xs sm:text-sm">
                                {o.last_submit ? new Date(o.last_submit).toLocaleDateString('id-ID') : '-'}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                <StatusBadge status={o.status as any} />
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center gap-3 w-32 sm:w-auto">
                                    <div className="w-16 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${o.upload_count >= 12 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                            style={{ width: `${Math.min((o.upload_count / 12) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black text-gray-400">{o.progress}</span>
                                </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                <div className="flex justify-center gap-1 sm:gap-2">
                                    <button 
                                        onClick={() => handleSendReminder(o.user_id)} 
                                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all"
                                        title="Kirim Reminder"
                                    >
                                        <Bell size={16} className="sm:w-4.5 sm:h-4.5" />
                                    </button>
                                    <button 
                                        onClick={() => setSelectedOpd(o)} 
                                        className="p-1.5 sm:p-2 text-blue-500 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all"
                                        title="Detail Profil"
                                    >
                                        <Info size={16} className="sm:w-4.5 sm:h-4.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="py-16 sm:py-20 text-center text-gray-400 italic text-sm">
                                    Tidak ada data OPD yang cocok dengan filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-6 md:mt-10 text-center text-gray-400 text-[9px] sm:text-[10px] font-medium tracking-widest uppercase pb-6 px-4">
            © 2026 Mimika DataHub - Sistem Monitoring Kepatuhan Pengiriman Data
        </footer>

      </div>

      {/* MODAL DETAIL */}
      {selectedOpd && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe] shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <Activity size={18} className="text-blue-500" /> Detail Profil OPD
              </h3>
              <button onClick={() => setSelectedOpd(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 text-center">
                 <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Instansi</p>
                 <h4 className="text-base sm:text-lg font-black text-gray-800 leading-tight">{selectedOpd.opd_name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-center">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                  <div><StatusBadge status={selectedOpd.status as any} /></div>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-center">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rerata Kualitas</p>
                  <p className="text-xl sm:text-2xl font-black text-blue-600">{selectedOpd.avg_quality}%</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                <DetailRow label="Username" value={`@${selectedOpd.username}`} />
                <DetailRow label="Kontak Email" value={selectedOpd.email} />
                <DetailRow label="Dataset Bulan Ini" value={`${selectedOpd.upload_count} Dataset`} />
                <DetailRow label="Terakhir Submit" value={selectedOpd.last_submit ? new Date(selectedOpd.last_submit).toLocaleDateString('id-ID') : "Belum pernah"} />
              </div>

              <button 
                onClick={() => { handleSendReminder(selectedOpd.user_id); setSelectedOpd(null); }}
                className="w-full bg-[#ef4444] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg sm:shadow-xl shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-600 transition-all active:scale-95"
              >
                <Send size={16} /> Kirim Pesan Reminder
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

// --- Local Helper Component ---
function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200/50 pb-2.5 last:border-0 last:pb-0">
      <span className="text-gray-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-tighter w-1/3">{label}:</span>
      <span className="text-gray-800 font-black text-[11px] sm:text-xs truncate max-w-37.5 sm:max-w-50 text-right">{value}</span>
    </div>
  );
}