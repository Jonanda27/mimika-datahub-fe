import ManagerSidebar from "@/components/layout/ManagerSidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <ManagerSidebar />
      {/* ml-0 di mobile, ml-[260px] di layar besar (lg) */}
      <div className="lg:ml-[260px] transition-all duration-300">
        {children}
      </div>
    </div>
  );
}