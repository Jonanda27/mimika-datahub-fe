"use client";
import { useState } from "react";
import { CloudUpload, FileText, FolderOpen, X } from "lucide-react";

interface FileUploadAreaProps {
  selectedFile: File | null;
  isProcessing: boolean;
  onFileChange: (file: File) => void;
  onRemoveFile: () => void;
}

export default function FileUploadArea({ selectedFile, isProcessing, onFileChange, onRemoveFile }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = window.document ? null : null; // Dihandle via ref di parent atau internal

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) onFileChange(e.dataTransfer.files[0]);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`bg-white rounded-3xl p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
        isProcessing ? "opacity-50 cursor-not-allowed" : ""
      } ${isDragging ? "border-[#ef4444] bg-red-50" : "border-gray-200 hover:border-[#ef4444]"}`}
      onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
    >
      <input 
        id="file-input"
        type="file" 
        onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
        className="hidden" 
        accept=".xlsx,.csv,.json"
        disabled={isProcessing}
      />
      <CloudUpload size={64} className="text-[#ef4444] mb-4" />
      <h3 className="text-lg font-bold text-gray-800">Drag & Drop File</h3>
      <p className="text-gray-500 text-sm mb-6 text-center">atau klik untuk memilih file dari komputer Anda</p>
      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-4">Support: .xlsx, .csv, .json (Max 10MB)</p>
      
      <button type="button" disabled={isProcessing} className="bg-[#ef4444] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-red-600 transition shadow-lg shadow-red-200">
        <FolderOpen size={18} /> Pilih File
      </button>

      {selectedFile && (
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3 w-full border border-gray-100 animate-in zoom-in-95">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <FileText size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemoveFile(); }}
            className="text-gray-400 hover:text-red-500 p-1"
            disabled={isProcessing}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}