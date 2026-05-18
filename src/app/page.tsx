"use client";

import { useState, useEffect } from "react";

// Integrasi Store
import { useDatasetStore } from "@/src/app/store/useDatasetStore";

// --- IMPORT KOMPONEN LANDING ---
import Navbar from "@/src/components/landing/Navbar";
import HeroSection from "@/src/components/landing/HeroSection";
import QuickLinks from "@/src/components/landing/QuickLinks";
import InfographicSection from "@/src/components/landing/InfographicSection";
import ThematicSection from "@/src/components/landing/ThematicSection";
import GisSection from "@/src/components/landing/GisSection";
import NewsSection from "@/src/components/landing/NewsSection";
import SectoralData from "@/src/components/landing/SectoralData";
import Footer from "@/src/components/landing/Footer";

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { fetchLatestByCategory } = useDatasetStore();

  // Handle Initial Data Fetching
  useEffect(() => {
    setIsMounted(true);
    fetchLatestByCategory();
  }, [fetchLatestByCategory]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#0071bc] selection:text-white overflow-x-hidden">

      <Navbar />

      <main>
        {/* HeroSection sekarang mengelola state pencarian & dropdown secara internal */}
        <HeroSection />

        <QuickLinks />

        <InfographicSection />

        <ThematicSection />

        <GisSection />

        <NewsSection />

        <SectoralData />
      </main>

      <Footer />

    </div>
  );
}