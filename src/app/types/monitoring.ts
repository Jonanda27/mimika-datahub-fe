// src/app/types/monitoring.ts

export interface MonitoringCards {
  total_opd: number;
  lengkap: number;
  kurang: number;
  belum_kirim: number;
}

export interface MonitoringPieChart {
  Lengkap: number;
  Kurang: number;
  "Belum Kirim": number;
}

export interface MonitoringLineChart {
  bulan: string;
  persentase: number;
}

export interface MonitoringTableData {
  user_id: number;
  opd_name: string;
  last_submit: string | null;
  status: "Lengkap" | "Kurang" | "Belum Kirim";
  progress: string;
  upload_count: number;
  avg_quality: number;
  email: string;
  username: string;
}

export interface MonitoringSummaryResponse {
  cards: MonitoringCards;
  pie_chart: MonitoringPieChart;
  line_chart: MonitoringLineChart[];
  table_data: MonitoringTableData[];
}

export interface ReminderResponse {
  message: string;
}