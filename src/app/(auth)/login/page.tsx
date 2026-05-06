"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  AlertCircle
} from "lucide-react";

// Integrasi Service dan Store
import { authService } from "./../../services/auth.service";
import { useAuthStore } from "./../../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  // State untuk form input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Solusi Hydration: Pastikan komponen sudah "mounted" di client sebelum interaksi storage/browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handler Login terintegrasi ke Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Panggil service login (mengirim FormData ke Backend)
      const data = await authService.login(username, password);
      
      // 2. Simpan data ke Zustand Store (Global State)
      setAuth(data.access_token, data.role, username);
      
      // 3. Redirect berdasarkan Role dari Backend
      if (data.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Menampilkan pesan error dari Backend
      setErrorMsg(err.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  // Jangan render konten interaktif/form secara penuh sebelum mounted untuk mencegah hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-white" />; // Placeholder putih saat loading awal
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      
      {/* --- KIRI: VISUAL BRANDING (HIDDEN ON MOBILE) --- */}
      <div className="hidden md:flex md:w-1/2 lg:w-[60%] relative bg-slate-900 overflow-hidden">
        <Image 
          src="/mimika.jpg" 
          alt="Mimika Landscape"
          fill
          className="object-cover opacity-40 grayscale-[20%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/90 to-slate-950"></div>
        
        <div className="relative z-10 w-full h-full p-16 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
              <ArrowLeft className="text-white" size={20} />
            </div>
            <span className="text-white font-bold text-sm tracking-widest uppercase">Kembali ke Beranda</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-[1000] text-white leading-[0.9] tracking-tighter">
              Kelola Data <br />
              <span className="text-blue-400">Kabupaten Mimika.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">
              Masuk untuk mengakses dasbor sektoral, mengelola dataset, dan memantau statistik pembangunan daerah secara *real-time*.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>© 2026 Mimika DataHub</span>
            <span>•</span>
            <span>Diskominfo Mimika</span>
          </div>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* --- KANAN: FORM LOGIN --- */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-slate-50/50">
        <div className="w-full max-w-md space-y-10">
          
          <div className="space-y-3">
            <div className="md:hidden flex justify-center mb-8">
               <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  <Image src="/logo-mimika.png" alt="Logo" width={32} height={32} />
                  <span className="font-black tracking-tighter text-slate-900">MIMIKA DATAHUB</span>
               </div>
            </div>
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-500 font-medium">Silakan masukkan akun resmi Anda untuk melanjutkan ke sistem.</p>
          </div>

          {/* Menampilkan Pesan Error dari Backend */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-800 text-sm font-bold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email/Username Field */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username / Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nama@mimika.go.id"
                    className="w-full bg-white border border-slate-200 py-4 pl-14 pr-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Kata Sandi</label>
                  <a href="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Lupa Sandi?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 py-4 pl-14 pr-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-all" />
              <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Ingat perangkat ini</label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  MASUK KE DASHBOARD <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
            <p className="text-slate-400 text-sm font-medium">Belum memiliki akses? <a href="#" className="text-blue-600 font-bold hover:underline">Hubungi Admin IT</a></p>
            
            <div className="flex gap-4 items-center">
               <div className="h-[1px] w-12 bg-slate-200"></div>
               <LayoutDashboard size={16} className="text-slate-300" />
               <div className="h-[1px] w-12 bg-slate-200"></div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
              Dikelola oleh Bidang Statistik & Persandian <br /> Diskominfo Kabupaten Mimika
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}