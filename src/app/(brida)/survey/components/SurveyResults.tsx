"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from "recharts";
import { 
  Loader2, 
  ChevronDown, 
  Users, 
  BarChart3, 
  PieChart as PieIcon,
  MessageSquare,
  Mail,
  Info,
  ListFilter,
  FileSpreadsheet,
  Download
} from "lucide-react";
import { useSurveyStore } from "@/src/app/store/useSurveyStore";
import StatCard from "@/components/ui/StatCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function SurveyResults() {
  const { 
    surveys, 
    currentSurvey, 
    isLoading, 
    isExporting, 
    fetchSurveys, 
    fetchSurveyDetail,
    exportResults 
  } = useSurveyStore();
  
  const [selectedId, setSelectedId] = useState<number | string>("");
  const [activeCardTabs, setActiveCardTabs] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleSelectSurvey = (id: string) => {
    setSelectedId(id);
    if (id) {
      fetchSurveyDetail(Number(id));
      setActiveCardTabs({}); 
    }
  };

  // Fungsi Helper untuk memotong judul yang kepanjangan
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (!title) return "";
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  const processedQuestions = useMemo(() => {
    if (!currentSurvey) return [];
    const { survey, responses } = currentSurvey;
    
    return survey.questions.map((q) => {
      const counts: Record<string, number> = {};
      const individualAnswers: any[] = [];

      responses.forEach((res) => {
        const answer = res.answers[q.text];
        if (answer !== undefined && answer !== null && answer !== "") {
          counts[answer] = (counts[answer] || 0) + 1;
          individualAnswers.push({
            email: res.email || "Responden Anonim",
            value: answer,
            date: res.created_at
          });
        }
      });

      const chartData = Object.keys(counts).map((key) => ({
        name: key,
        value: counts[key],
      }));

      return {
        question: q.text,
        type: q.type,
        chartData,
        individualAnswers,
        totalAnswered: individualAnswers.length
      };
    });
  }, [currentSurvey]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-black">
      
      {/* 1. SELECTOR HEADER & EXPORT BUTTONS */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 leading-tight">Analisis Hasil</h3>
            <p className="text-xs text-gray-400 font-bold tracking-widest">Visualisasi Respon & Identitas</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Export Actions */}
          {selectedId && (
            <div className="flex gap-2 w-full md:w-auto order-2 md:order-1">
              <button
                onClick={() => exportResults(Number(selectedId), 'xlsx')}
                disabled={isExporting}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Excel
              </button>
              
              <button
                onClick={() => exportResults(Number(selectedId), 'csv')}
                disabled={isExporting}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={14} />
                CSV
              </button>
            </div>
          )}

          {/* Selector dengan Truncate Judul */}
          <div className="relative w-full md:w-80 group order-1 md:order-2">
            <select 
              value={selectedId}
              onChange={(e) => handleSelectSurvey(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 py-3.5 px-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 font-bold text-sm appearance-none cursor-pointer transition-all whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <option value="">Pilih Survey...</option>
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {/* Judul dipotong jika lebih dari 35 karakter */}
                  {truncateTitle(s.title, 35)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
        </div>
      </div>

      {!selectedId ? (
        <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <PieIcon size={64} className="mb-4 text-gray-100" />
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">Pilih Data untuk Memulai Analisis</p>
        </div>
      ) : isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Menyusun Laporan Real-time...</p>
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              label="Total Responden" 
              value={currentSurvey?.total_responses || 0} 
              icon={<Users size={20} />} 
              iconBg="bg-[#0f3460]"
              valueColor="text-[#0f3460]"
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {processedQuestions.map((item, idx) => {
              const currentTab = activeCardTabs[idx] || (item.type === 'text' || item.type === 'textarea' ? 'list' : 'stats');
              
              return (
                <div key={idx} className="group relative bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
                  
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-600 transition-all group-hover:w-2"></div>

                  <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#0f3460] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter"> {idx + 1}</span>
                        <h4 className="font-black text-gray-800 text-lg leading-snug">
                          {item.question}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Users size={12} className="text-blue-500" /> {item.totalAnswered} Partisipan
                        </div>
                      </div>
                    </div>

                    <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-fit self-start md:self-center border border-gray-200">
                      {(item.type === 'rating' || item.type === 'yesno') && (
                        <button 
                          onClick={() => setActiveCardTabs({...activeCardTabs, [idx]: 'stats'})}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentTab === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <BarChart3 size={14} /> Statistik
                        </button>
                      )}
                      <button 
                        onClick={() => setActiveCardTabs({...activeCardTabs, [idx]: 'list'})}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <ListFilter size={14} /> Detail Per Gmail
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    {item.totalAnswered > 0 ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {currentTab === 'stats' && (
                          <div className="py-6">
                            <ResponsiveContainer width="100%" height={320}>
                              <BarChart data={item.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip 
                                  cursor={{fill: '#f8fafc'}}
                                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={45}>
                                  {item.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {currentTab === 'list' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                            {item.individualAnswers.map((ans, i) => (
                              <div key={i} className="group/item p-5 bg-gray-50 border border-gray-100 rounded-3xl hover:border-blue-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                                      <Mail size={16} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="text-xs font-black text-gray-800 truncate leading-none mb-1">{ans.email}</span>
                                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID #{i + 1}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 group-hover/item:border-blue-50 shadow-inner">
                                  <p className="text-sm text-gray-700 font-bold leading-relaxed italic">
                                    <MessageSquare size={14} className="inline mr-2 text-blue-500 opacity-50" />
                                    "{ans.value}"
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-gray-300 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                        <Info size={40} className="mb-3 opacity-20" />
                        <p className="text-xs font-black uppercase tracking-[0.3em]">Belum Ada Partisipan</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}