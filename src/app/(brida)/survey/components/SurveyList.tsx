"use client";

import { useEffect, useState } from 'react';

export default function SurveyList() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSurveys = () => {
    if (typeof window !== 'undefined') {
      setSurveys(JSON.parse(localStorage.getItem('brida_surveys') || '[]'));
    }
  };

  useEffect(() => {
    loadSurveys();
    window.addEventListener('surveyDataChanged', loadSurveys);
    return () => window.removeEventListener('surveyDataChanged', loadSurveys);
  }, []);

  const generateDataset = (id: number) => {
    const updatedSurveys = surveys.map(s => {
      if (s.id === id) {
        if (s.generated) {
          alert('Dataset sudah pernah digenerate.');
          return s;
        }
        const mockResponses = Math.floor(Math.random() * 500) + 100;
        return { ...s, totalResponses: mockResponses, generated: true, generatedDate: new Date().toISOString() };
      }
      return s;
    });
    
    localStorage.setItem('brida_surveys', JSON.stringify(updatedSurveys));
    setSurveys(updatedSurveys);
    window.dispatchEvent(new Event('surveyDataChanged'));
    alert('✅ Dataset berhasil digenerate!');
  };

  const filteredSurveys = surveys.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-[#0f3460]">
          <i className="fas fa-tasks text-gray-400"></i> Daftar Survey Tersedia
        </h3>
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Cari survey..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full md:w-64 text-sm focus:ring-2 focus:ring-[#0f3460] outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSurveys.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Tidak ada survey yang ditemukan.</p>
          </div>
        ) : (
          filteredSurveys.map((survey: any) => (
            <div key={survey.id} className="border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow bg-white">
              <div>
                <h4 className="font-semibold text-gray-900">{survey.name}</h4>
                <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-3">
                  <span><i className="fas fa-map-marker-alt text-gray-400"></i> {survey.location || 'Semua Wilayah'}</span>
                  <span><i className="fas fa-question-circle text-gray-400"></i> {survey.questions?.length || 0} Pertanyaan</span>
                  <span><i className="fas fa-users text-gray-400"></i> {survey.totalResponses || 0} Responden</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Periode: {survey.startDate || '-'} s/d {survey.endDate || '-'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                  survey.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {survey.status === 'active' ? 'Aktif' : 'Selesai'}
                </span>
                <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors text-gray-700">
                  <i className="fas fa-eye mr-1"></i> Preview
                </button>
                <button 
                  onClick={() => generateDataset(survey.id)}
                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                    survey.generated ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#0f3460] text-white hover:bg-slate-800'
                  }`}
                  disabled={survey.generated}
                >
                  <i className="fas fa-database mr-1"></i> {survey.generated ? 'Dataset Generated' : 'Generate Dataset'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}