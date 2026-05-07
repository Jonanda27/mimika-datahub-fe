import { Dataset } from "./dataset";

export interface DashboardCards {
  total_dataset: number;
  total_sumber: number;
  user_aktif: number;
  rata_rata_kualitas: string;
}

export interface QualityTrend {
  bulan: number;
  skor: number;
}

export interface OpdMonthlyMonitoring {
  opd_name: string;
  terkirim: number;
  target: number;
  persentase: string;
  status: "Lengkap" | "Belum Lengkap";
}

export interface MainStatsResponse {
  cards: DashboardCards;
  recent: Dataset[];
  popular: Dataset[];
  quality_trend: QualityTrend[];
  opd_monthly_monitoring: OpdMonthlyMonitoring[];
}