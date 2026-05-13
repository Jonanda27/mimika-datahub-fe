"use client";
import { useState, useEffect } from "react";
import { CloudUpload, FileText, FolderOpen, X, Eye, AlertCircle } from "lucide-react";
// Import library XLSX
import * as XLSX from 'xlsx';

interface FileUploadAreaProps {
  selectedFile: File | null;
  isProcessing: boolean;
  onFileChange: (file: File) => void;
  onRemoveFile: () => void;
}

export default function FileUploadArea({ selectedFile, isProcessing, onFileChange, onRemoveFile }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewRows, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewData([]);
      setPreviewHeaders([]);
      setIsReading(false);
      return;
    }

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    setIsReading(true);

    reader.onload = (e) => {
      try {
        // MENDUKUNG .xlsx DAN .xls
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          // PROSES KHUSUS EXCEL (BINARY)
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Konversi ke JSON
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

          if (jsonData.length > 0) {
            const headers = jsonData[0].map((h: any) => String(h || "").trim());
            
            // Ambil maksimal 5 baris data
            const rows = jsonData.slice(1, 6).map((row: any[]) => {
              const rowObj: any = {};
              headers.forEach((h: string, i: number) => {
                rowObj[h] = row[i];
              });
              return rowObj;
            });
            setPreviewHeaders(headers);
            setPreviewData(rows);
          }
        } else {
          // PROSES CSV & JSON (TEXT)
          const content = e.target?.result as string;
          
          if (fileExt === 'csv') {
            const lines = content.split("\n").filter((line: string) => line.trim() !== "");
            if (lines.length > 0) {
              const headers = lines[0].split(",").map((h: string) => h.trim());
              const rows = lines.slice(1, 6).map((line: string) => {
                const values = line.split(",");
                const rowObj: any = {};
                headers.forEach((h: string, i: number) => {
                  rowObj[h] = values[i];
                });
                return rowObj;
              });
              setPreviewHeaders(headers);
              setPreviewData(rows);
            }
          } else if (fileExt === 'json') {
            const jsonData = JSON.parse(content);
            const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
            if (dataArray.length > 0) {
              setPreviewHeaders(Object.keys(dataArray[0]));
              setPreviewData(dataArray.slice(0, 5));
            }
          }
        }
      } catch (err) {
        console.error("Gagal membaca pratinjau:", err);
      } finally {
        setIsReading(false);
      }
    };

    // Baca sebagai ArrayBuffer untuk Excel (.xls/.xlsx), readAsText untuk sisanya
    if (fileExt === 'xlsx' || fileExt === 'xls') {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) onFileChange(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-4 text-black">
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
          // UPDATE: Menambahkan .xls ke atribut accept
          accept=".xlsx,.xls,.csv,.json"
          disabled={isProcessing}
        />
        
        {!selectedFile ? (
          <>
            <CloudUpload size={64} className="text-[#ef4444] mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Drag & Drop File</h3>
            <p className="text-gray-500 text-sm mb-6 text-center">atau klik untuk memilih file dari komputer Anda</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-4">Support: .xlsx, .xls, .csv, .json (Max 10MB)</p>
            
            <button type="button" disabled={isProcessing} className="bg-[#ef4444] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-red-600 transition shadow-lg shadow-red-200">
              <FolderOpen size={18} /> Pilih File
            </button>
          </>
        ) : (
          <div className="w-full animate-in zoom-in-95">
             <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-sm font-bold text-gray-800 truncate max-w-50">{selectedFile.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">{(selectedFile.size / 1024).toFixed(1)} KB • Siap Diproses</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveFile(); }}
                  className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                  disabled={isProcessing}
                >
                  <X size={20} />
                </button>
             </div>

             <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#1e61d0]">
                  <Eye size={16} />
                  <span className="text-[11px] font-black uppercase tracking-tighter">Pratinjau Data (Top 5 Baris)</span>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-inner min-h-25">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {previewHeaders.map((header: string, i: number) => (
                            <th key={i} className="px-3 py-2 font-bold text-gray-500 uppercase whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {isReading ? (
                          <tr>
                            <td colSpan={previewHeaders.length || 1} className="px-3 py-10 text-center text-gray-300 italic">Membaca isi file...</td>
                          </tr>
                        ) : previewRows.length > 0 ? (
                          previewRows.map((row: any, rowIndex: number) => (
                            <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                              {previewHeaders.map((header: string, colIndex: number) => (
                                <td key={colIndex} className="px-3 py-2 text-gray-600 whitespace-nowrap">
                                  {row[header]?.toString() || "-"}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={previewHeaders.length || 1} className="px-3 py-10 text-center text-gray-400 italic">Data tidak tersedia untuk ditampilkan.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <AlertCircle size={14} className="text-amber-500" />
                    <p className="text-[9px] text-amber-700 font-medium">Tampilan di atas adalah data mentah. Cleaning Engine di server akan merapikan format angka dan teks secara otomatis saat Anda menekan tombol Upload.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}