"use client"; // Wajib karena menggunakan usePathname

import { usePathname } from "next/navigation";
import PublicTopBar from "@/components/layout/PublicTopBar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /**
   * Logika Pengecekan:
   * Kita tidak ingin merender TopBar jika berada di halaman explorer.
   */
  const isExplorerPage = pathname?.startsWith("/explorer");

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">
      {/* Hanya tampilkan TopBar jika BUKAN halaman explorer */}
      {!isExplorerPage && <PublicTopBar />}

      {/* Main Content Area */}
      <main className={`flex-1 w-full transition-all duration-300 ${isExplorerPage ? 'h-screen' : ''}`}>
        {children}
      </main>
    </div>
  );
}