// src/app/(user)/data-brida/page.tsx
import { redirect } from "next/navigation";

/**
 * DataBridaRedirectPage - Routing Normalization Gate
 * 
 * Mengalihkan rute legacy non-kanonikal `/data-brida` ke modul resmi survei terintegrasi `/survey`.
 * Mencegah redundansi komponen dummy dan memastikan seluruh operasional survei
 * berada pada ekosistem BRIDA yang terhubung ke REST API & useSurveyStore.
 */
export default function DataBridaRedirectPage() {
  redirect("/survey");
}
