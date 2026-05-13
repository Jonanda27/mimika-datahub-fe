"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useSurveyStore } from "@/src/app/store/useSurveyStore"; // Sesuaikan path

export default function PublikSurveyPage() {
  const params = useParams();
  const surveyId = Number(params.id);

  const { 
    currentSurvey, 
    isLoading, 
    error, 
    fetchSurveyDetail, 
    submitResponse,
    clearCurrentSurvey 
  } = useSurveyStore();

  // State untuk form
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data survey saat halaman pertama kali dibuka
  useEffect(() => {
    if (surveyId) {
      fetchSurveyDetail(surveyId);
    }
    // Cleanup saat unmount
    return () => clearCurrentSurvey();
  }, [surveyId, fetchSurveyDetail, clearCurrentSurvey]);

  // Handler untuk mengubah jawaban
  const handleAnswerChange = (questionText: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionText]: value,
    }));
  };

  // Handler Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Validasi manual untuk pertanyaan yang 'required'
    const survey = currentSurvey?.survey;
    if (!survey) return;

    for (const q of survey.questions) {
      if (q.required && (!answers[q.text] || answers[q.text].toString().trim() === "")) {
        alert(`Pertanyaan "${q.text}" wajib diisi!`);
        return;
      }
    }

    // 2. Proses pengiriman
    setIsSubmitting(true);
    try {
      await submitResponse({
        survey_id: surveyId,
        email: email , // akan difilter di backend
        answers: answers
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Gagal mengirim jawaban. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER LOADING / ERROR STATE
  // ==========================================
  if (isLoading && !currentSurvey) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center font-sans">
        <Loader2 size={40} className="text-[#0f3460] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat formulir survey...</p>
      </div>
    );
  }

  if (error || !currentSurvey) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <AlertCircle size={50} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Survey Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">{error || "Survey yang Anda cari mungkin sudah ditutup atau dihapus."}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER SUCCESS STATE
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] py-12 px-4 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-t-8 border-t-[#0f3460] p-8 md:p-10 text-center animate-in zoom-in-95 duration-500">
            <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{currentSurvey.survey.title}</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Terima kasih, tanggapan Anda telah berhasil direkam. Data yang Anda kirimkan sangat berharga untuk pengembangan daerah.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#0f3460] font-bold hover:underline"
            >
              Kirim tanggapan lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER FORM SURVEY
  // ==========================================
  const survey = currentSurvey.survey;

  return (
    <div className="min-h-screen bg-[#f0f4f9] py-8 px-4 font-sans text-black">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 pb-20">
        
        {/* KARTU HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-t-8 border-t-[#0f3460] p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4 tracking-tight">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {survey.description}
            </p>
          )}
          <hr className="my-6 border-gray-200" />
          <div className="flex items-start gap-3 text-sm text-gray-500 bg-blue-50/50 p-4 rounded-lg">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <p>
              Jawaban Anda akan digunakan untuk keperluan pendataan <b>BRIDA Mimika</b>. 
              {survey.location ? ` Survey ini difokuskan untuk area ${survey.location}.` : ''}
            </p>
          </div>
        </div>

        {/* KARTU EMAIL (OPSIONAL/ANONIMITAS) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 focus-within:border-l-8 focus-within:border-l-[#4285f4] transition-all">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            Alamat Email <span className="text-gray-400 text-xs font-normal ml-1">(Opsional)</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Isi dengan email jika Anda bersedia dihubungi, atau biarkan kosong untuk mengirim secara anonim.
          </p>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Jawaban Anda"
            className="w-full md:w-1/2 bg-transparent border-b border-gray-300 focus:border-[#0f3460] focus:bg-gray-50 outline-none py-2 px-1 transition-colors"
          />
        </div>

        {/* KARTU PERTANYAAN (LOOPING) */}
        {survey.questions.map((q, index) => {
          const isAnswered = answers[q.text] !== undefined && answers[q.text] !== '';

          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 focus-within:border-l-8 focus-within:border-l-[#4285f4] transition-all"
            >
              <h3 className="text-base font-medium text-gray-800 mb-4 leading-relaxed">
                {q.text} 
                {q.required && <span className="text-red-500 ml-1" title="Wajib diisi">*</span>}
              </h3>

              {/* RENDER INPUT BERDASARKAN TIPE SOAL */}
              
              {/* Tipe: Jawaban Singkat */}
              {q.type === 'text' && (
                <input 
                  type="text" 
                  value={answers[q.text] || ''}
                  onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                  placeholder="Jawaban Anda"
                  className="w-full md:w-1/2 bg-transparent border-b border-gray-300 focus:border-[#0f3460] focus:bg-gray-50 outline-none py-2 px-1 transition-colors"
                  required={q.required}
                />
              )}

              {/* Tipe: Paragraf */}
              {q.type === 'textarea' && (
                <textarea 
                  rows={3}
                  value={answers[q.text] || ''}
                  onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                  placeholder="Jawaban Anda"
                  className="w-full bg-transparent border-b border-gray-300 focus:border-[#0f3460] focus:bg-gray-50 outline-none py-2 px-1 transition-colors resize-y"
                  required={q.required}
                />
              )}

              {/* Tipe: Ya/Tidak (Radio) */}
              {q.type === 'yesno' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name={`question_${index}`} 
                      value="Ya"
                      checked={answers[q.text] === 'Ya'}
                      onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                      className="w-4 h-4 text-[#0f3460] border-gray-300 focus:ring-[#0f3460]"
                      required={q.required}
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Ya</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name={`question_${index}`} 
                      value="Tidak"
                      checked={answers[q.text] === 'Tidak'}
                      onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                      className="w-4 h-4 text-[#0f3460] border-gray-300 focus:ring-[#0f3460]"
                      required={q.required}
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Tidak</span>
                  </label>
                </div>
              )}

              {/* Tipe: Skala Rating Linier (1-5) */}
              {q.type === 'rating' && (
                <div className="w-full overflow-x-auto pb-4">
                  <div className="flex items-center gap-2 sm:gap-6 min-w-max">
                    <span className="text-sm text-gray-500 font-medium">Sangat Buruk</span>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex flex-col items-center gap-2 cursor-pointer group p-2">
                        <span className="text-lg font-medium text-gray-600 group-hover:text-[#0f3460]">{num}</span>
                        <input 
                          type="radio" 
                          name={`question_${index}`} 
                          value={num.toString()}
                          checked={answers[q.text] === num.toString()}
                          onChange={(e) => handleAnswerChange(q.text, e.target.value)}
                          className="w-5 h-5 text-[#0f3460] border-gray-400 focus:ring-[#0f3460]"
                          required={q.required}
                        />
                      </label>
                    ))}
                    <span className="text-sm text-gray-500 font-medium">Sangat Baik</span>
                  </div>
                </div>
              )}

              {/* Peringatan error bawaan jika required tapi kosong (Optional visual helper) */}
              {q.required && isSubmitted && !isAnswered && (
                <div className="text-red-500 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle size={12} /> Pertanyaan ini wajib diisi
                </div>
              )}
            </div>
          );
        })}

        {/* ERROR SUBMIT ALERT */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{submitError}</p>
          </div>
        )}

        {/* FOOTER & TOMBOL SUBMIT */}
        <div className="flex items-center justify-between pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#0f3460] hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Mengirim...
              </>
            ) : (
              'Kirim Jawaban'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              if(confirm('Bersihkan seluruh form?')) {
                setAnswers({});
                setEmail('');
              }
            }}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Bersihkan formulir
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-10">
          Formulir ini dibuat dan dikelola melalui Mimika DataHub. Jangan pernah mengirimkan sandi melalui formulir.
        </p>
      </form>
    </div>
  );
}