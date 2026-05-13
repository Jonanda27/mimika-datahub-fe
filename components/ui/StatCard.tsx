import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string; 
  valueColor?: string;
}

export default function StatCard({ label, value, icon, iconBg, valueColor = "text-gray-800" }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100/50 flex items-center gap-4">
      {/* Container Ikon di sebelah kiri */}
      <div className={`w-11 h-11 ${iconBg} rounded-lg flex items-center justify-center text-white shadow-sm shrink-0`}>
        <div className="scale-90">
          {icon}
        </div>
      </div>

      {/* Container Teks di sebelah kanan */}
      <div className="flex flex-col min-w-0">
        <h3 className={`text-xl font-extrabold ${valueColor} leading-none mb-1 truncate`}>
          {value}
        </h3>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}