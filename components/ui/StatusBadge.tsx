// src/components/ui/StatusBadge.tsx
import { Check, AlertTriangle, X, Clock, RefreshCw, Database } from "lucide-react";

export type StatusType = 
  | "Lengkap" | "Kurang" | "Belum Kirim" 
  | "approved" | "cleaning" | "staging" | "validated";

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Mapping konfigurasi untuk semua jenis status di aplikasi
  const config: Record<string, { color: string; icon: any; label: string }> = {
    // Dashboard & Monitoring Styles
    Lengkap: { color: "text-[#10b981] bg-emerald-50 border-emerald-100", icon: Check, label: "Lengkap" },
    Kurang: { color: "text-[#f59e0b] bg-amber-50 border-amber-100", icon: AlertTriangle, label: "Kurang" },
    "Belum Kirim": { color: "text-[#ef4444] bg-red-50 border-red-100", icon: X, label: "Belum Kirim" },
    
    // Upload & Data Quality Styles
    approved: { color: "text-[#10b981] bg-emerald-50 border-emerald-100", icon: Database, label: "Approved" },
    cleaning: { color: "text-[#3b82f6] bg-blue-50 border-blue-100", icon: RefreshCw, label: "Cleaning" },
    staging: { color: "text-[#6366f1] bg-indigo-50 border-indigo-100", icon: Clock, label: "Staging" },
    validated: { color: "text-[#10b981] bg-emerald-50 border-emerald-100", icon: Check, label: "Validated" },
  };

  // Fallback jika status tidak ditemukan untuk mencegah error destructuring
  const current = config[status] || { 
    color: "text-gray-500 bg-gray-50 border-gray-100", 
    icon: AlertTriangle, 
    label: status 
  };

  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${current.color}`}>
      <Icon size={12} />
      {current.label}
    </div>
  );
}