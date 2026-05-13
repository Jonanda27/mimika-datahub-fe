"use client";

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  MapPin, 
  Calendar, 
  AlignLeft, 
  CheckSquare, 
  ToggleLeft,
  GripHorizontal,
  Send,
  Loader2,
  ClipboardList,
  Type,
  Info,
  ChevronRight
} from 'lucide-react';

// Import Store
import { useSurveyStore } from '@/src/app/store/useSurveyStore';

export default function SurveyBuilder({ onDataChange }: { onDataChange: () => void }) {
  const { createSurvey, isLoading } = useSurveyStore();

  const [activeId, setActiveId] = useState<string | number>('header'); 
  const [formData, setFormData] = useState({
    name: 'Isi Judul Survey', 
    location: '', 
    startDate: '', 
    endDate: '', 
    description: ''
  });
  
  const [questions, setQuestions] = useState([
    { id: Date.now(), text: '', type: 'text', required: false }
  ]);

  // --- Handlers ---
  const addQuestion = (currentIndex: number) => {
    const newId = Date.now();
    const newQuestion = { id: newId, text: '', type: 'text', required: false };
    const newQuestions = [...questions];
    newQuestions.splice(currentIndex + 1, 0, newQuestion);
    setQuestions(newQuestions);
    setActiveId(newId);
  };

  const duplicateQuestion = (index: number) => {
    const newId = Date.now();
    const qToCopy = questions[index];
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, { ...qToCopy, id: newId });
    setQuestions(newQuestions);
    setActiveId(newId);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) return alert("Survey minimal harus memiliki 1 pertanyaan.");
    setQuestions(questions.filter(q => q.id !== id));
    if (activeId === id) setActiveId('header');
  };

  const handleQuestionChange = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.some(q => !q.text.trim())) return alert('Harap isi semua teks pertanyaan.');

    const payload = {
      title: formData.name,
      description: formData.description,
      is_active: true,
      location: formData.location,
      start_date: formData.startDate,
      end_date: formData.endDate,
      questions: questions.map(({ text, type, required }) => ({ text, type, required }))
    };

    try {
      await createSurvey(payload);
      alert(`✅ Survey "${formData.name}" berhasil dipublikasikan!`);
      onDataChange();
      setFormData({ name: 'Survey Tanpa Judul', location: '', startDate: '', endDate: '', description: '' });
      setQuestions([{ id: Date.now(), text: '', type: 'text', required: false }]);
      setActiveId('header');
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-2 text-black space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 leading-tight">Survey Builder</h3>
            <p className="text-xs text-gray-400 font-bold tracking-widest">Rancang Instrumen Pengumpulan Data</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full md:w-auto bg-[#0f3460] hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {isLoading ? 'Memproses...' : 'Publikasikan Survey'}
        </button>
      </div>

      <div className="space-y-6 pb-20">
        
        {/* 2. IDENTITAS SURVEY CARD */}
        {/* PERBAIKAN: Menambahkan overflow-hidden agar garis tidak tembus rounded corner */}
        <div 
          onClick={() => setActiveId('header')}
          className={`group relative bg-white rounded-[32px] shadow-sm border transition-all duration-300 overflow-hidden ${activeId === 'header' ? 'ring-2 ring-blue-500 border-transparent shadow-xl' : 'border-gray-100 hover:border-blue-200'}`}
        >
          {/* Garis Aksen Kiri */}
          <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${activeId === 'header' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Type size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Informasi Utama</span>
            </div>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full text-2xl font-black text-gray-800 border-b-2 border-transparent focus:border-blue-100 focus:bg-blue-50/30 outline-none pb-2 mb-4 rounded-xl transition-all placeholder:text-gray-300" 
              placeholder="Masukkan Judul Survey..."
            />
            <textarea 
              rows={2} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full text-sm font-medium text-gray-500 border-none focus:ring-0 outline-none resize-none placeholder:text-gray-300" 
              placeholder="Tambahkan deskripsi atau tujuan survey di sini..."
            ></textarea>
          </div>
        </div>

        {/* 3. METADATA CARD (LOKASI & PERIODE) */}
        {/* PERBAIKAN: Menambahkan overflow-hidden agar garis tidak tembus rounded corner */}
        <div 
          onClick={() => setActiveId('meta')}
          className={`group relative bg-white rounded-[32px] shadow-sm border transition-all duration-300 overflow-hidden ${activeId === 'meta' ? 'ring-2 ring-blue-500 border-transparent shadow-xl' : 'border-gray-100 hover:border-blue-200'} p-8`}
        >
          {/* Garis Aksen Kiri */}
          <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${activeId === 'meta' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="flex items-center gap-2 mb-8 text-blue-600">
            <Info size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Target & Waktu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin size={12} className="text-blue-500" /> Lokasi Target
              </label>
              <input 
                type="text" value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 focus:border-blue-200 focus:bg-white outline-none p-4 rounded-2xl text-sm font-bold transition-all" 
                placeholder="Misal: Distrik Mimika Baru" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Calendar size={12} className="text-blue-500" /> Tanggal Mulai
              </label>
              <input 
                type="date" value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 focus:border-blue-200 focus:bg-white outline-none p-4 rounded-2xl text-sm font-bold transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Calendar size={12} className="text-blue-500" /> Tanggal Selesai
              </label>
              <input 
                type="date" value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 focus:border-blue-200 focus:bg-white outline-none p-4 rounded-2xl text-sm font-bold transition-all" 
              />
            </div>
          </div>
        </div>

        {/* 4. QUESTIONS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Daftar Pertanyaan</h4>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100">{questions.length} Total Soal</span>
          </div>

          {questions.map((q, index) => {
            const isActive = activeId === q.id;
            return (
              /* PERBAIKAN: Menambahkan overflow-hidden agar garis tidak tembus rounded corner */
              <div 
                key={q.id} 
                onClick={() => setActiveId(q.id)}
                className={`group relative bg-white rounded-[32px] shadow-sm border transition-all duration-300 overflow-hidden ${isActive ? 'ring-2 ring-blue-500 border-transparent shadow-2xl' : 'border-gray-100 hover:border-blue-100'} p-8`}
              >
                {/* Garis Aksen Kiri */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-100'}`}></div>

                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0f3460] text-white text-[10px] font-black px-2.5 py-1 rounded-lg">SOAL {index + 1}</span>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Teks Pertanyaan</label>
                    </div>
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={e => handleQuestionChange(q.id, 'text', e.target.value)} 
                      placeholder="Masukkan Pertanyaan..." 
                      className="w-full bg-gray-50 border border-gray-100 focus:border-blue-200 focus:bg-white outline-none p-4 rounded-2xl transition-all text-base font-bold" 
                      autoFocus={isActive}
                    />
                  </div>

                  <div className="w-full lg:w-72 shrink-0 space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tipe Jawaban</label>
                    <div className="relative group/select">
                      <select 
                        value={q.type} 
                        onChange={e => handleQuestionChange(q.id, 'type', e.target.value)} 
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none cursor-pointer text-sm font-bold text-gray-700 transition-all focus:border-blue-200 appearance-none"
                      >
                        <option value="text">Teks Singkat</option>
                        <option value="textarea">Paragraf / Teks Panjang</option>
                        <option value="rating">Skala Linier (1-5)</option>
                        <option value="yesno">Pilihan Ya / Tidak</option>
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* PREVIEW BOX */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-dashed border-gray-200 mb-8 flex flex-col justify-center min-h-[80px]">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Preview Konten Jawaban</p>
                  <div className="animate-in fade-in duration-300">
                    {q.type === 'text' && <div className="h-1.5 w-1/2 bg-gray-200 rounded-full"></div>}
                    {q.type === 'textarea' && <div className="space-y-2"><div className="h-1.5 w-full bg-gray-200 rounded-full"></div><div className="h-1.5 w-3/4 bg-gray-200 rounded-full"></div></div>}
                    {q.type === 'yesno' && (
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-gray-200"></div><span className="text-xs font-bold text-gray-300 uppercase">Ya</span></div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-gray-200"></div><span className="text-xs font-bold text-gray-300 uppercase">Tidak</span></div>
                      </div>
                    )}
                    {q.type === 'rating' && (
                      <div className="flex gap-3">
                        {[1,2,3,4,5].map(n => <div key={n} className="w-9 h-9 rounded-xl border-2 border-gray-100 flex items-center justify-center text-xs font-bold text-gray-300">{n}</div>)}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIVE CARD ACTIONS */}
                {isActive && (
                  <div className="pt-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => duplicateQuestion(index)} className="flex items-center gap-2 px-5 py-2.5 hover:bg-gray-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 transition-all">
                        <Copy size={14} /> Duplikasi
                      </button>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="flex items-center gap-2 px-5 py-2.5 hover:bg-red-50 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-500 transition-all">
                        <Trash2 size={14} /> Hapus Soal
                      </button>
                    </div>

                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-700 transition-colors">Wajib diisi</span>
                        <div className="relative inline-block w-11 h-6">
                          <input type="checkbox" checked={q.required} onChange={(e) => handleQuestionChange(q.id, 'required', e.target.checked)} className="peer sr-only" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300 shadow-inner"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm"></div>
                        </div>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => addQuestion(index)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Plus size={14} /> Tambah Soal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}