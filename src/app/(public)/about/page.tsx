"use client";

import React from "react";
import { 
  BookOpen, 
  Database, 
  ShieldCheck, 
  Users2, 
  Target, 
  BarChart, 
  Map, 
  CheckCircle2,
  Building2
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 font-sans text-gray-800 pb-24">
      {/* --- PAGE HEADER --- */}
      <header className="bg-[#002244] py-16 lg:py-20 border-b-4 border-[#0071bc]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Tentang Mimika DataHub
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Sistem Informasi dan Manajemen Data Terpadu Kabupaten Mimika guna mewujudkan kebijakan pembangunan berbasis fakta (Evidence-Based Policy).
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-16">
          
          {/* --- SECTION 1: LATAR BELAKANG --- */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-[#0071bc] rounded-lg">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#002244]">Latar Belakang</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px] md:text-base">
              <p>
                Pembangunan <strong>Mimika DataHub</strong> didorong oleh amanat <strong>Undang-Undang No. 14 Tahun 2008</strong> tentang Keterbukaan Informasi Publik dan <strong>Peraturan Presiden No. 39 Tahun 2019</strong> tentang Satu Data Indonesia.
              </p>
              <p>
                Kabupaten Mimika menyadari perlunya sebuah platform terpusat yang dikoordinasikan oleh BAPPEDA untuk mengintegrasikan data sektoral dari berbagai Organisasi Perangkat Daerah (OPD). Platform ini dibangun untuk memastikan data yang dikumpulkan akurat, mutakhir, terpadu, serta dapat diakses dengan mudah oleh publik maupun para pembuat kebijakan.
              </p>
            </div>
          </section>

          {/* --- DIVIDER --- */}
          <hr className="border-gray-100" />

          {/* --- SECTION 2: TUJUAN UTAMA --- */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-[#0071bc] rounded-lg">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#002244]">Tujuan Utama</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalItem 
                icon={Database} 
                title="Integrasi Data" 
                desc="Menyediakan portal terpusat untuk seluruh data statistik sektoral dan geospasial Kabupaten Mimika." 
              />
              <GoalItem 
                icon={ShieldCheck} 
                title="Standardisasi & Kualitas" 
                desc="Memastikan data akurat, mutakhir, dan dapat dipertanggungjawabkan sesuai prinsip Satu Data Indonesia." 
              />
              <GoalItem 
                icon={Users2} 
                title="Aksesibilitas Publik" 
                desc="Memberikan kemudahan bagi masyarakat, akademisi, dan swasta dalam mendapatkan data resmi." 
              />
              <GoalItem 
                icon={Target} 
                title="Dukungan Kebijakan" 
                desc="Menyediakan dasar yang kuat bagi perencanaan, evaluasi, dan pengambilan keputusan." 
              />
            </div>
          </section>

          {/* --- DIVIDER --- */}
          <hr className="border-gray-100" />

          {/* --- SECTION 3: FITUR UNGGULAN --- */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-[#0071bc] rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#002244]">Fitur Unggulan</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <FeatureItem 
                icon={Database}
                title="Katalog Data Terpusat"
                desc="Pencarian data yang terstruktur berdasarkan kategori tematik, instansi (OPD), maupun format data (seperti CSV, Excel, dan API)."
              />
              <FeatureItem 
                icon={BarChart}
                title="Dashboard Analitik & Visualisasi"
                desc="Representasi visual dari indikator makro pembangunan berupa grafik interaktif dan statistik ringkas untuk kemudahan analisis."
              />
              <FeatureItem 
                icon={ShieldCheck}
                title="Sistem Tata Kelola & Verifikasi"
                desc="Alur kerja terstruktur yang menghubungkan Produsen Data (OPD) dengan Walidata guna menjamin validitas dan integritas informasi."
              />
              <FeatureItem 
                icon={Map}
                title="Integrasi Geospasial (WebGIS)"
                desc="Pemetaan visual berbasis lokasi untuk memantau sebaran infrastruktur dan kondisi sosial ekonomi di seluruh distrik Kabupaten Mimika."
              />
            </div>
          </section>

          {/* --- DIVIDER --- */}
          <hr className="border-gray-100" />

          {/* --- SECTION 4: MANFAAT SISTEM --- */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-[#0071bc] rounded-lg">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#002244]">Manfaat Sistem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 md:p-8 rounded-xl border border-gray-100">
              <div>
                <div className="flex items-center gap-2 text-[#004b87] font-bold text-lg mb-4">
                  <Building2 size={20} /> Bagi Pemerintah Daerah
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <BenefitListItem text="Efisiensi pengumpulan dan penyebaran data antar instansi." />
                  <BenefitListItem text="Perencanaan program pembangunan yang lebih tepat sasaran." />
                  <BenefitListItem text="Monitoring evaluasi kinerja OPD yang terukur secara real-time." />
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-4">
                  <Users2 size={20} /> Bagi Masyarakat & Publik
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <BenefitListItem text="Akses transparan terhadap hasil dan target pembangunan daerah." />
                  <BenefitListItem text="Penyediaan sumber referensi yang valid untuk penelitian dan pendidikan." />
                  <BenefitListItem text="Membuka peluang kolaborasi dan inovasi bersama sektor swasta." />
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

// --- SUB-COMPONENTS ---

function GoalItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
      <div className="shrink-0 mt-1">
        <Icon size={20} className="text-[#0071bc]" />
      </div>
      <div>
        <h3 className="font-bold text-[#002244] mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0071bc]">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function BenefitListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 size={16} className="text-gray-400 shrink-0 mt-0.5" />
      <span className="leading-relaxed">{text}</span>
    </li>
  );
}