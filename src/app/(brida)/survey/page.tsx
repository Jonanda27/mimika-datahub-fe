"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Activity, Users, Database } from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";

// Import Komponen Lokal
import SurveyBuilder from "./components/SurveyBuilder";
import SurveyList from "./components/SurveyList";
import SurveyResults from "./components/SurveyResults";
import SensusData from "./components/SensusData";

// Integrasi Store
import { useSurveyStore } from "@/src/app/store/useSurveyStore";

export default function DataBridaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  // Ambil data dan fungsi dari Survey Store termasuk surveyStats
  const {
    surveys,
    surveyStats,
    fetchSurveys,
    fetchSurveyStats,
    isLoading,
  } = useSurveyStore();

  useEffect(() => {
    setIsMounted(true);

    // Ambil data list survey dan statistik secara paralel saat halaman dibuka
    fetchSurveys();
    fetchSurveyStats();
  }, [fetchSurveys, fetchSurveyStats]);

  // Fungsi untuk refresh data (dipanggil setelah SurveyBuilder berhasil simpan data)
  const handleRefreshData = () => {
    fetchSurveys();
    fetchSurveyStats();
  };

  const tabs = [
    { id: "builder", label: "Survey Builder", icon: "fas fa-plus-circle" },
    { id: "list", label: "Daftar Survey", icon: "fas fa-list" },
    { id: "results", label: "Hasil Survey", icon: "fas fa-chart-bar" },
    { id: "sensus", label: "Data Sensus Lokal", icon: "fas fa-users" },
  ];

  // Konfigurasi data untuk StatCard (Menggunakan data dari API Stats)
  const statCardsData = [
    {
      label: "Total Survey",
      value: surveyStats?.total || 0,
      icon: <ClipboardList size={20} />,
      iconBg: "bg-[#e94560]",
      valueColor: "text-[#e94560]",
    },
    {
      label: "Survey Aktif",
      value: surveyStats?.active || 0,
      icon: <Activity size={20} />,
      iconBg: "bg-emerald-500",
      valueColor: "text-emerald-600",
    },
    {
      label: "Total Responden",
      value: surveyStats?.responses || 0,
      icon: <Users size={20} />,
      iconBg: "bg-blue-500",
      valueColor: "text-blue-600",
    },
    {
      label: "Dataset Terbentuk",
      value: surveyStats?.datasets || 0,
      icon: <Database size={20} />,
      iconBg: "bg-indigo-500",
      valueColor: "text-indigo-600",
    },
  ];

  if (!isMounted) {
    return <div className="bg-[#f4f7fb] min-h-screen"></div>;
  }

  return (
    <div
      suppressHydrationWarning
      className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black"
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <PageHeader
            title="Data Survey"
            subtitle="Survey Builder | Pengumpulan Data Mandiri | Sensus Lokal"
          />

          {/* Grid StatCard - Terhubung ke API Stats melalui Store */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCardsData.map((stat, idx) => (
              <StatCard
                key={idx}
                label={stat.label}
                // Tampilkan "..." jika stats belum ada dan sedang memuat
                value={isLoading && !surveyStats ? "..." : stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                valueColor={stat.valueColor}
              />
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-3 mb-6 border-b pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  suppressHydrationWarning
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm ${activeTab === tab.id
                    ? "bg-[#e94560] text-white shadow-md shadow-rose-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <i className={tab.icon}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-4">
              {isLoading && surveys.length === 0 && !surveyStats ? (
                <LoadingState message="Memperbarui statistik dan daftar survey..." />
              ) : (
                <>
                  {activeTab === "builder" && (
                    <SurveyBuilder onDataChange={handleRefreshData} />
                  )}
                  {activeTab === "list" && <SurveyList />}
                  {activeTab === "results" && <SurveyResults />}
                  {activeTab === "sensus" && <SensusData />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}