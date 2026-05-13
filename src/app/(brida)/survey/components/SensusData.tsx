"use client";

import { useEffect, useState } from 'react';

export default function SensusData() {
  const [sensusData, setSensusData] = useState<any[]>([]);
  const [filterYear, setFilterYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const surveys = JSON.parse(localStorage.getItem('brida_surveys') || '[]');
      const generatedSurveys = surveys.filter((s: any) => s.generated).map((s: any) => ({
        id: s.id,
        name: s.name,
        year: new Date(s.generatedDate).getFullYear().toString(),
        type: 'Survey Mandiri',
        records: s.totalResponses,
        quality: 85 + Math.floor(Math.random() * 10)
      }));

      const defaultSensus = [
        { id: 'd1', name: "Sensus Penduduk Lokal Mimika 2024", year: "2024", type: "Sensus", records: 125000, quality: 92 },
        { id: 'd2', name: "Pendataan Potensi Desa (Podes) 2024", year: "2024", type: "Sensus", records: 185, quality: 94 },
        { id: 'd3', name: "Data UMKM Binaan BRIDA 2025", year: "2025", type: "Pendataan", records: 1245, quality: 88 }
      ];

      setSensusData([...generatedSurveys, ...defaultSensus]);
    }
  }, []);

  const filteredData = sensusData.filter(d => {
    const matchName = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = filterYear === 'all' || d.year === filterYear;
    return matchName && matchYear;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-[#0f3460]">
          <i className="fas fa-database text-gray-400"></i> Repositori Sensus Lokal
        </h3>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Cari dataset..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0f3460]"
          />
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-[#0f3460]"
          >
            <option value="all">Semua Tahun</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-gray-200 text-[#0f3460]">
            <tr>
              <th className="p-4 font-semibold">Nama Dataset</th>
              <th className="p-4 font-semibold">Tahun</th>
              <th className="p-4 font-semibold">Jenis</th>
              <th className="p-4 font-semibold">Jumlah Record</th>
              <th className="p-4 font-semibold">Kualitas</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Dataset tidak ditemukan.</td>
              </tr>
            ) : (
              filteredData.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{d.name}</td>
                  <td className="p-4 text-gray-600">{d.year}</td>
                  <td className="p-4 text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs">{d.type}</span>
                  </td>
                  <td className="p-4 text-gray-600">{d.records.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-emerald-100">
                      {d.quality}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-[#e94560] hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                      <i className="fas fa-arrow-right"></i> Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}