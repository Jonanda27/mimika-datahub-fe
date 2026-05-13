"use client";

import { useEffect, useState } from 'react';

export default function SurveyResults() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allSurveys = JSON.parse(localStorage.getItem('brida_surveys') || '[]');
      // Hanya tampilkan yang sudah punya responden
      setSurveys(allSurveys.filter((s: any) => s.totalResponses > 0));
    }
  }, []);

  const activeSurvey = surveys.find(s => s.id.toString() === selectedSurveyId);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-[#0f3460]">
          <i className="fas fa-chart-pie text-gray-400"></i> Hasil Pengumpulan Data
        </h3>
        <select 
          value={selectedSurveyId} 
          onChange={(e) => setSelectedSurveyId(e.target.value)}
          className="p-2 border border-gray-200 rounded-xl w-full md:w-64 outline-none focus:ring-2 focus:ring-[#0f3460] bg-white"
        >
          <option value="">Pilih Survey...</option>
          {surveys.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.totalResponses} responden)</option>
          ))}
        </select>
      </div>

      {!activeSurvey ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <i className="fas fa-chart-bar text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">Pilih survey di atas untuk melihat analitik hasil pengumpulan data.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0f3460] text-white p-6 rounded-xl flex flex-wrap justify-between items-center shadow-md shadow-blue-900/20">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Responden</p>
              <h4 className="text-3xl font-bold">{activeSurvey.totalResponses} <span className="text-lg font-normal">Orang</span></h4>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-blue-200 text-sm mb-1">Periode Pelaksanaan</p>
              <p className="font-medium">{activeSurvey.startDate || '-'} s/d {activeSurvey.endDate || '-'}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 font-medium">Pertanyaan</th>
                  <th className="p-4 font-medium w-64">Rata-rata / Distribusi</th>
                </tr>
              </thead>
              <tbody>
                {activeSurvey.questions.map((q: any, idx: number) => {
                  const randomValue = Math.floor(Math.random() * 40) + 40; // Mock data
                  return (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 text-gray-800">{q.text} <span className="text-xs text-gray-400 block mt-1">Tipe: {q.type}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#e94560] h-2.5 rounded-full" style={{ width: `${randomValue}%` }}></div>
                          </div>
                          <span className="font-medium text-gray-700 w-10">{randomValue}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-right">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all">
              <i className="fas fa-file-excel text-green-600 mr-2"></i> Export CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}