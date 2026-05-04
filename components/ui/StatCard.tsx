import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string; // Sesuaikan nama properti ini
  valueColor?: string;
}

export default function StatCard({ label, value, icon, iconBg, valueColor = "text-gray-800" }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-white mb-4 shadow-sm`}>
        {icon}
      </div>
      <h3 className={`text-3xl font-extrabold ${valueColor} mb-1`}>{value}</h3>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}