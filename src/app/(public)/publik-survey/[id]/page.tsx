"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Send, 
  ArrowLeft,
  Mail,
  ClipboardCheck,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// Service & Types
import { surveyService } from "@/src/app/services/survey.service"; 
import { SurveyDetailResponse } from "@/src/app/types/survey";

export default function PublicSurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params?.id ? parseInt(params.id as string, 10) : null;

  // States
  const [surveyData, setSurveyData] = useState<SurveyDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>("header");

  useEffect(() => {
    const loadSurvey = async () => {
      if (!surveyId || isNaN(surveyId)) {
        setError("Tautan survey tidak valid.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await surveyService.getSurveyDetail(surveyId);
        setSurveyData(data);
      } catch (err: any) {
        setError("Survey tidak ditemukan atau telah ditutup.");
      } finally {
        setIsLoading(false);
      }
    };
    loadSurvey();
  }, [surveyId]);

  const handleAnswerChange = (questionText: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionText]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyData?.survey) return;

    for (const q of surveyData.survey.questions) {
      if (q.required && (!answers[q.text] || answers[q.text].toString().trim() === "")) {
        alert(`Pertanyaan "${q.text}" wajib diisi.`);
        setFocusedId(q.text);
        document.getElementById(q.text)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await surveyService.submitResponse({
        survey_id: surveyId!,
        email: email.trim() || null,
        answers: answers,
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || "Gagal mengirim jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans">
        <Loader2 size={32} className="text-[#0f3460] animate-spin mb-4" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    );
  }

  if (error || !surveyData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 font-sans text-black">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
          <Link href="/publik-survey" className="flex items-center justify-center gap-2 bg-[#0f3460] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 flex flex-col items-center justify-center font-sans text-black">
        <div className="bg-white rounded-3xl shadow-xl border-t-[6px] border-t-emerald-500 p-8 md:p-12 max-w-2xl w-full text-center animate-in zoom-in-95 duration-500">
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">{surveyData.survey.title}</h1>
          <p className="text-slate-500 text-base mb-10 leading-relaxed">Terima kasih atas partisipasi Anda. Jawaban Anda telah kami terima dan akan diolah secara aman.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
             <button onClick={() => window.location.reload()} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Kirim Ulang
             </button>
             <Link href="/publik-survey" className="bg-[#0f3460] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <ClipboardCheck size={14} /> Survey Lainnya
             </Link>
          </div>
        </div>
      </div>
    );
  }

  const { survey } = surveyData;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4 font-sans text-black">
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
        <Link href="/publik-survey" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0f3460] font-bold text-[10px] uppercase tracking-widest transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
        </Link>
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Info size={12} /> Formulir Publik Resmi
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 pb-20">
        {/* Header Form */}
        <div 
          onClick={() => setFocusedId("header")}
          className={`relative bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden ${focusedId === "header" ? "ring-2 ring-blue-500 border-transparent shadow-md" : "border-slate-200"}`}
        >
          <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${focusedId === "header" ? "bg-blue-600" : "bg-slate-100"}`}></div>
          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{survey.title}</h1>
            <p className="text-slate-500 text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed mb-8">{survey.description}</p>
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-4 items-center">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                  <Info size={20} />
               </div>
               <div className="text-xs text-blue-900 leading-relaxed font-medium">
                  Informasi pengumpulan data ini dikelola secara resmi oleh  <b>BRIDA Mimika</b>. Jawaban Anda dilindungi secara anonim.
               </div>
            </div>
          </div>
        </div>

        {/* Identitas (Email) */}
        <div 
          onClick={() => setFocusedId("email")}
          className={`relative bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden ${focusedId === "email" ? "ring-2 ring-blue-500 border-transparent shadow-md" : "border-slate-200"}`}
        >
          <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${focusedId === "email" ? "bg-blue-600" : "bg-slate-100"}`}></div>
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={18} className="text-blue-500" />
              <label className="text-base font-medium text-slate-800  tracking-tight">Kontak Email</label>
            </div>
            <p className="text-[11px] text-slate-400 mb-6 font-medium">Gunakan email jika Anda ingin dihubungi kembali terkait hasil survey.</p>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedId("email")}
              className="w-full md:w-2/3 border-b-2 border-slate-100 focus:border-blue-600 focus:bg-slate-50/50 outline-none py-3 px-2 text-base font-bold transition-all bg-transparent placeholder:text-slate-200"
              placeholder="nama@email.com"
            />
          </div>
        </div>

        {/* Loop Pertanyaan */}
        {survey.questions.map((q, idx) => {
          const isActive = focusedId === q.text;
          return (
            <div 
              key={idx} 
              id={q.text}
              onClick={() => setFocusedId(q.text)}
              className={`relative bg-white rounded-3xl shadow-sm border transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${isActive ? "ring-2 ring-blue-500 border-transparent shadow-md" : "border-slate-200"}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${isActive ? "bg-blue-600" : "bg-slate-100"}`}></div>
              
              <div className="p-6 md:p-10">
                <div className="flex items-start gap-4 mb-8">
                  <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter shrink-0 mt-1">{idx + 1}</span>
                  {/* TEXT PERTANYAAN: Font size dikecilkan (text-base) dan font weight menjadi normal/medium */}
                  <label className="text-base md:text-lg font-medium text-slate-700 leading-snug">
                    {q.text} {q.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                  </label>
                </div>

                {/* RENDER BERDASARKAN TIPE */}
                <div className="pl-0 md:pl-10">
                  {q.type === 'text' && (
                    <input 
                      type="text" required={q.required}
                      value={answers[q.text] || ""}
                      onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                      onFocus={() => setFocusedId(q.text)}
                      className="w-full md:w-3/4 border-b-2 border-slate-100 focus:border-blue-600 focus:bg-slate-50/50 outline-none py-3 px-2 text-base font-bold transition-all bg-transparent placeholder:text-slate-200"
                      placeholder="Ketik jawaban Anda..."
                    />
                  )}

                  {q.type === 'textarea' && (
                    <textarea 
                      required={q.required}
                      value={answers[q.text] || ""}
                      onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                      onFocus={() => setFocusedId(q.text)}
                      className="w-full border-b-2 border-slate-100 focus:border-blue-600 focus:bg-slate-50/50 outline-none py-3 px-2 text-base font-bold transition-all bg-transparent resize-none placeholder:text-slate-200"
                      placeholder="Masukkan penjelasan lengkap..."
                      rows={3}
                    />
                  )}

                  {q.type === 'yesno' && (
                    <div className="flex flex-col gap-3 max-w-[120px]">
                      {["Ya", "Tidak"].map((opt) => (
                        <label key={opt} className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all ${answers[q.text] === opt ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"}`}>
                          <span className="text-xs font-bold uppercase tracking-widest">{opt}</span>
                          <input 
                            type="radio" name={q.text} value={opt}
                            checked={answers[q.text] === opt}
                            onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                            className="sr-only"
                            required={q.required}
                          />
                          {answers[q.text] === opt && <CheckCircle size={14} />}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'rating' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} className={`w-11 h-11 flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all shrink-0 ${answers[q.text] === num.toString() ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-105" : "bg-white border-slate-100 hover:border-slate-300 text-slate-500"}`}>
                            <span className="text-sm font-black">{num}</span>
                            <input 
                              type="radio" name={q.text} value={num.toString()}
                              checked={answers[q.text] === num.toString()}
                              onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                              className="sr-only"
                              required={q.required}
                            />
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-between max-w-[260px] text-[9px] font-bold uppercase tracking-widest text-slate-300 px-1">
                        <span>Buruk</span>
                        <span>Sangat Baik</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* SUBMIT SECTION */}
        <div className="pt-8 flex flex-col items-center gap-6">
          {submitError && (
            <div className="w-full p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3">
              <AlertCircle size={16} /> {submitError}
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#0f3460] hover:bg-slate-800 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
              {isSubmitting ? "Mengirim..." : "Kirim Tanggapan"}
            </button>
            
            <button 
              type="button" 
              onClick={() => confirm('Reset formulir?') && (setAnswers({}), setEmail(""), setFocusedId("header"))}
              className="text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Kosongkan Formulir
            </button>
          </div>
        </div>

        <div className="py-16 text-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] leading-relaxed">
              Masyarakat Mimika Membangun <br /> Bidang Statistik & Persandian BRIDA
            </p>
        </div>
      </form>
    </div>
  );
}