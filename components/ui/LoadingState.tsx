// src/components/ui/LoadingState.tsx
import { Activity } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Memuat data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Spinner luar */}
        <div className="absolute w-16 h-16 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
        {/* Ikon tengah */}
        <Activity className="text-red-500 animate-pulse" size={32} />
      </div>
      
      <p className="mt-8 text-gray-500 font-medium font-sans tracking-wide">
        {message}
      </p>
      
      {/* Efek skeleton atau bar kecil di bawah teks (Opsional) */}
      <div className="mt-4 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-400 to-red-600 w-1/2 animate-[loading_1.5s_infinite_ease-in-out]"></div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}