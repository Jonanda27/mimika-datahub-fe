"use client";
import React, { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ModalProps {
    item: any;
    onClose: () => void;
}

export default function InfographicModal({ item, onClose }: ModalProps) {
    const [zoom, setZoom] = useState(1);

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl max-h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-white shrink-0 gap-4">
                    <div className="flex flex-col text-left w-full sm:w-auto">
                        <h4 className="text-sm font-black text-[#002244] uppercase truncate max-w-md">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.date} • {item.category}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 p-1 border border-slate-200">
                            <button onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))} className="p-1.5 hover:bg-white transition-all"><ZoomOut size={16} /></button>
                            <span className="text-[11px] font-black w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(Math.min(zoom + 0.25, 3))} className="p-1.5 hover:bg-white transition-all"><ZoomIn size={16} /></button>
                            <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-white transition-all ml-1 border-l border-slate-200"><RotateCcw size={14} /></button>
                        </div>
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <a href={item.image} download className="p-2 text-[#0071bc] hover:bg-blue-50"><Download size={22} /></a>
                            <button onClick={onClose} className="p-2 text-rose-500 hover:bg-rose-50"><X size={26} /></button>
                        </div>
                    </div>
                </div>

                {/* Viewer */}
                <div className="overflow-auto bg-slate-200 p-4 md:p-8 flex justify-center items-start h-[75vh] custom-scrollbar">
                    <div
                        className="relative transition-all duration-300 ease-out origin-top shadow-2xl border border-white"
                        style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? '40rem' : 'none' }}
                    >
                        <img src={item.image} alt={item.title} className="w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}