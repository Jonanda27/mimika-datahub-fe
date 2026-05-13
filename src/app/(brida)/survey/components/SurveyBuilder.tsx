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
  Loader2
} from 'lucide-react';

// Import Store (Sesuaikan path dengan struktur folder Anda)
import { useSurveyStore } from '@/src/app/store/useSurveyStore';

export default function SurveyBuilder({ onDataChange }: { onDataChange: () => void }) {
  // Panggil fungsi createSurvey dan status isLoading dari global store
  const { createSurvey, isLoading } = useSurveyStore();

  const [activeId, setActiveId] = useState<string | number>('header'); 
  const [formData, setFormData] = useState({
    name: 'Survey Tanpa Judul', 
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
    const newQuestion = { ...qToCopy, id: newId };
    
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    
    setQuestions(newQuestions);
    setActiveId(newId);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) {
      alert("Survey minimal harus memiliki 1 pertanyaan.");
      return;
    }
    const filtered = questions.filter(q => q.id !== id);
    setQuestions(filtered);
    if (activeId === id) setActiveId('header');
  };

  const handleQuestionChange = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  // --- SUBMIT KE BACKEND ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.some(q => !q.text.trim())) {
      alert('Terdapat pertanyaan yang masih kosong. Harap isi atau hapus pertanyaan tersebut.');
      return;
    }

    // Susun payload yang akan dikirim ke Backend
    const payload = {
      title: formData.name,
      description: formData.description,
      is_active: true,
      // Field tambahan (Sesuaikan dengan schema Backend FastAPI Anda)
      location: formData.location,
      start_date: formData.startDate,
      end_date: formData.endDate,
      questions: questions.map(({ text, type, required }) => ({ 
        text, 
        type, 
        required 
      }))
    };

    try {
      // Panggil API lewat Zustand Store
      await createSurvey(payload);
      
      alert(`✅ Survey "${formData.name}" berhasil dibuat!`);
      
      // Trigger update UI agar tabel list berubah
      window.dispatchEvent(new Event('surveyDataChanged'));
      onDataChange();
      
      // Reset Form ke awal
      setFormData({ name: 'Survey Tanpa Judul', location: '', startDate: '', endDate: '', description: '' });
      setQuestions([{ id: Date.now(), text: '', type: 'text', required: false }]);
      setActiveId('header');

    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menyimpan survey.");
    }
  };

  // --- Komponen Pembantu UI ---
  const inputStyle = "w-full bg-transparent border-b border-gray-300 focus:border-[#0f3460] outline-none py-2 transition-colors focus:bg-gray-50 px-2 rounded-t-md";

  return (
    <div className="animate-in fade-in duration-300 max-w-3xl mx-auto py-4">
      
      {/* Tombol Simpan (Fixed Bottom/Top) */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Buat Survey Baru
        </h3>
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="bg-[#0f3460] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-blue-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {isLoading ? 'Menyimpan...' : 'Simpan & Publikasi'}
        </button>
      </div>

      <div className="space-y-4 pb-20">
        
        {/* ======================================= */}
        {/* 1. KARTU HEADER (Judul & Deskripsi)     */}
        {/* ======================================= */}
        <div 
          onClick={() => setActiveId('header')}
          className={`relative bg-white rounded-xl shadow-sm border ${activeId === 'header' ? 'border-l-8 border-[#0f3460]' : 'border-gray-200 border-t-8 border-t-[#0f3460]'} p-6 transition-all duration-200 overflow-hidden cursor-text`}
        >
          {activeId === 'header' && (
             <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#0f3460]"></div>
          )}
          
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full text-3xl sm:text-4xl font-normal text-gray-900 border-b border-transparent focus:border-gray-300 focus:bg-gray-50 outline-none pb-2 mb-4 rounded-t-md transition-all" 
            placeholder="Judul Formulir"
          />
          <textarea 
            rows={2} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full text-sm border-b border-transparent focus:border-gray-300 focus:bg-gray-50 outline-none pb-1 rounded-t-md transition-all resize-none" 
            placeholder="Deskripsi formulir"
          ></textarea>
        </div>

        {/* ======================================= */}
        {/* 2. KARTU METADATA (Lokasi & Waktu)      */}
        {/* ======================================= */}
        <div 
          onClick={() => setActiveId('meta')}
          className={`relative bg-white rounded-xl shadow-sm border ${activeId === 'meta' ? 'border-gray-300' : 'border-gray-200'} p-6 transition-all duration-200`}
        >
          {activeId === 'meta' && (
             <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#0f3460] rounded-l-xl"></div>
          )}
          
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Pengaturan Target (Opsional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14}/> Lokasi Target</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputStyle} placeholder="Kec. Mimika Baru" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={14}/> Mulai</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputStyle} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={14}/> Selesai</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* 3. KARTU PERTANYAAN                     */}
        {/* ======================================= */}
        {questions.map((q, index) => {
          const isActive = activeId === q.id;

          return (
            <div 
              key={q.id} 
              onClick={() => setActiveId(q.id)}
              className={`relative bg-white rounded-xl shadow-sm border transition-all duration-200 ${isActive ? 'border-gray-300 shadow-md ring-1 ring-gray-100' : 'border-gray-200 hover:border-gray-300'} p-6`}
            >
              {/* Highlight Kiri Aktif */}
              {isActive && (
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#4285f4] rounded-l-xl"></div>
              )}

              {/* Drag Handle Icon (Visual) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-300 cursor-grab opacity-0 hover:opacity-100 transition-opacity">
                <GripHorizontal size={20} />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Input Pertanyaan */}
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={q.text} 
                    onChange={e => handleQuestionChange(q.id, 'text', e.target.value)} 
                    placeholder="Pertanyaan" 
                    className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#0f3460] focus:bg-gray-100 outline-none px-4 py-3 sm:py-4 rounded-t-lg transition-colors text-base font-medium" 
                    autoFocus={isActive}
                  />
                </div>

                {/* Dropdown Tipe Pertanyaan */}
                <div className="w-full md:w-56 shrink-0">
                  <div className="relative border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0f3460]/20">
                    <select 
                      value={q.type} 
                      onChange={e => handleQuestionChange(q.id, 'type', e.target.value)} 
                      className="w-full p-3.5 appearance-none outline-none bg-transparent cursor-pointer text-sm font-medium text-gray-700"
                    >
                      <option value="text">Jawaban Singkat</option>
                      <option value="textarea">Paragraf</option>
                      <option value="rating">Skala Linier (1-5)</option>
                      <option value="yesno">Pilihan Ya / Tidak</option>
                    </select>
                    {/* Visualizer tipe soal */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      {q.type === 'text' && <AlignLeft size={18} />}
                      {q.type === 'textarea' && <AlignLeft size={18} />}
                      {q.type === 'rating' && <ToggleLeft size={18} />}
                      {q.type === 'yesno' && <CheckSquare size={18} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Jawaban */}
              <div className="pl-2 mb-6">
                {q.type === 'text' && <div className="border-b border-dotted border-gray-400 w-1/2 pb-1 text-sm text-gray-400">Teks jawaban singkat</div>}
                {q.type === 'textarea' && <div className="border-b border-dotted border-gray-400 w-full pb-1 mt-4 text-sm text-gray-400">Teks jawaban panjang</div>}
                {q.type === 'yesno' && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-gray-500"><div className="w-4 h-4 rounded-full border border-gray-400"></div> Ya</div>
                    <div className="flex items-center gap-2 text-gray-500"><div className="w-4 h-4 rounded-full border border-gray-400"></div> Tidak</div>
                  </div>
                )}
                {q.type === 'rating' && (
                  <div className="flex items-center gap-4 mt-2 text-gray-500">
                    <span>1</span>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => <div key={n} className="w-4 h-4 rounded-full border border-gray-400"></div>)}
                    </div>
                    <span>5</span>
                  </div>
                )}
              </div>

              {/* Action Footer (Hanya muncul jika aktif) */}
              {isActive && (
                <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-4 text-gray-500">
                  
                  <button type="button" onClick={() => duplicateQuestion(index)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Duplikasi">
                    <Copy size={20} />
                  </button>
                  <button type="button" onClick={() => removeQuestion(q.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title="Hapus">
                    <Trash2 size={20} />
                  </button>

                  <div className="w-px h-6 bg-gray-200 mx-2"></div>

                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    Wajib diisi
                    <div className="relative inline-block w-10 h-5">
                      <input 
                        type="checkbox" 
                        checked={q.required} 
                        onChange={(e) => handleQuestionChange(q.id, 'required', e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#0f3460] transition-colors"></div>
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  {/* Tombol Tambah Pertanyaan (Di dalam card saat aktif) */}
                  <div className="w-px h-6 bg-gray-200 mx-2"></div>
                  <button 
                    type="button" 
                    onClick={() => addQuestion(index)} 
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={18} /> Tambah Soal
                  </button>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}