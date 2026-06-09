// src/app/(admin)/manajemen-aset/page.tsx
import { redirect } from "next/navigation";

/**
 * ManajemenAsetRedirectPage - Routing Normalization Gate
 * 
 * Mengalihkan rute non-kanonikal `/manajemen-aset` ke rute resmi `/admin-manajemen-aset`.
 * Menerapkan prinsip arsitektur DRY (Don't Repeat Yourself) untuk mencegah
 * duplikasi kode pemeliharaan moderasi aset di sisi administrator.
 */
export default function ManajemenAsetRedirectPage() {
    redirect("/admin-manajemen-aset");
}