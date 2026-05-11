import AdminSidebar from "@/components/layout/AdminSidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <AdminSidebar />
      {/* ml-0 di mobile, ml-[260px] di layar besar (lg) */}
      <div className="lg:ml-[px] transition-all duration-300">
        {children}
      </div>
    </div>
  );
}