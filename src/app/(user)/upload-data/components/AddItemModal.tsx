"use client";
import { Database, Tag, X } from "lucide-react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type: "source" | "category";
}

export default function AddItemModal({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  placeholder, 
  value, 
  onChange, 
  type 
}: AddItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {type === "source" ? (
              <Database size={18} className="text-green-500" />
            ) : (
              <Tag size={18} className="text-blue-500" />
            )}
            Tambah {title} Baru
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Nama Item
            </label>
            <input 
              type="text" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
            />
          </div>
          <button 
            onClick={onSave}
            disabled={!value}
            className="w-full bg-[#10b981] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:bg-slate-300"
          >
            Simpan Item Baru
          </button>
        </div>
      </div>
    </div>
  );
}