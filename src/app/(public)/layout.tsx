import PublicTopBar from "@/components/layout/PublicTopBar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">
      {/* Navbar akan tetap di atas karena sticky di komponennya */}
      <PublicTopBar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
}