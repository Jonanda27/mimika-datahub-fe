"use client";
import { History } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { UploadLog } from "../page";

interface UploadLogTableProps {
  logs: UploadLog[];
}

export default function UploadLogTable({ logs }: UploadLogTableProps) {
  return (
    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <History size={18} className="text-gray-400" /> Log Pengiriman Data
        </h3>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Real-time Staging</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Nama Dataset</th>
              <th className="px-6 py-4">Sumber</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Kualitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{log.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{log.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{log.source}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 font-black text-gray-300 text-right">{log.quality ? `${log.quality}%` : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">Belum ada aktivitas pengiriman data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}