// src/app/lib/mocks/mockAssets.ts

/**
 * MOCK DATA: TITIK SEBARAN ASET OPD
 * Domain: Spasial Fisik (GeoTagging)
 * Data koordinat fasilitas spasial untuk di-render oleh Leaflet MarkerCluster.
 * [REFACTOR] Menambahkan array 'images' untuk demonstrasi Slider/Carousel Media.
 */
export const MOCK_ASSET_DATA: Record<string, any[]> = {
    "dinas_kesehatan": [
        // Pusat Kota (High Density)
        {
            id: "k1",
            name: "RSUD Kabupaten Mimika",
            type: "Rumah Sakit",
            lat: -4.545,
            lng: 136.890,
            // [REFACTOR] Array Multi-Image untuk menguji Carousel
            images: [
                "/bg-mimika.jpg",
                "https://picsum.photos/seed/rsud1/800/450",
                "https://picsum.photos/seed/rsud2/800/450"
            ],
            details: {
                "Alamat": "Jl. Yos Sudarso KM 4, Timika",
                "Status Operasional": "Aktif 24 Jam",
                "Kapasitas Bed": "150 Tempat Tidur",
                "Akreditasi": "Paripurna",
                "Kepala RS": "dr. Antonius"
            }
        },
        {
            id: "k2",
            name: "Puskesmas Timika",
            type: "Puskesmas",
            lat: -4.530,
            lng: 136.885,
            // Hanya 1 gambar, Carousel harus menyesuaikan (tanpa dot/panah navigasi)
            images: ["https://picsum.photos/seed/pkm1/800/450"],
            details: {
                "Alamat": "Kecamatan Mimika Baru",
                "Status Operasional": "Aktif",
                "Layanan Rawat Inap": "Tersedia",
                "Rata-rata Pasien/Hari": "85 Orang"
            }
        },
        { id: "k3", name: "Puskesmas Wania", type: "Puskesmas", lat: -4.560, lng: 136.910 }, // Tanpa media
        { id: "k4", name: "Pustu Kwamki Narama", type: "Puskesmas Pembantu", lat: -4.510, lng: 136.870 },
        { id: "k5", name: "Puskesmas Mapurujaya", type: "Puskesmas", lat: -4.600, lng: 136.950 },
        // Industri & Operasional
        { id: "k6", name: "Klinik Kuala Kencana", type: "Klinik Industri", lat: -4.480, lng: 136.850 },
        { id: "k7", name: "Klinik Tembagapura", type: "Klinik Industri", lat: -4.300, lng: 137.110 },
        // Tersebar / Remote (Low Density)
        { id: "k8", name: "Pustu Mimika Barat", type: "Puskesmas Pembantu", lat: -4.680, lng: 136.550 },
        { id: "k9", name: "Puskesmas Pembantu Jita", type: "Puskesmas Pembantu", lat: -4.850, lng: 137.200 },
        { id: "k10", name: "Pustu Agimuga", type: "Puskesmas Pembantu", lat: -4.450, lng: 137.350 }
    ],
    "dinas_pendidikan": [
        // Pusat Kota & Sekitar
        {
            id: "p1",
            name: "SMP Negeri 2 Timika",
            type: "Gedung Sekolah",
            lat: -4.535,
            lng: 136.895,
            // Menggunakan backward compatibility (image_url) untuk ngetes Adaptor di AssetDetailPanel
            image_url: "/bg-mimika.jpg",
            details: {
                "Alamat": "Kecamatan Mimika Baru",
                "Jumlah Siswa": "450 Siswa",
                "Jumlah Guru": "32 Guru",
                "Kondisi Bangunan": "Baik (Rehab 2024)"
            }
        },
        {
            id: "p2",
            name: "SD Inpres Wania",
            type: "Gedung Sekolah",
            lat: -4.555,
            lng: 136.905,
            images: [
                "https://picsum.photos/seed/sdwania1/800/450",
                "https://picsum.photos/seed/sdwania2/800/450"
            ]
        },
        { id: "p3", name: "SMA Negeri 1 Mimika", type: "Gedung Sekolah", lat: -4.540, lng: 136.880 },
        { id: "p4", name: "Perpustakaan Daerah", type: "Fasilitas Umum", lat: -4.550, lng: 136.890 },
        { id: "p5", name: "SMK Negeri 1 Mimika", type: "Gedung Sekolah", lat: -4.570, lng: 136.920 },
        // Satelit/Remote
        { id: "p6", name: "SMP Satap Jila", type: "Gedung Sekolah", lat: -4.420, lng: 137.050 },
        { id: "p7", name: "SD Negeri Mimika Barat", type: "Gedung Sekolah", lat: -4.650, lng: 136.400 },
        { id: "p8", name: "Sekolah Dasar Alama", type: "Gedung Sekolah", lat: -4.350, lng: 137.250 }
    ],
    "dinas_pupr": [
        // Infrastruktur & Utilitas
        {
            id: "pu1",
            name: "Proyek Jembatan Wania",
            type: "Infrastruktur",
            lat: -4.565,
            lng: 136.915,
            images: [
                "https://picsum.photos/seed/jembatan1/800/450",
                "https://picsum.photos/seed/jembatan2/800/450",
                "https://picsum.photos/seed/jembatan3/800/450",
                "https://picsum.photos/seed/jembatan4/800/450"
            ],
            details: {
                "Tahun Anggaran": "2025",
                "Panjang Bentang": "120 Meter",
                "Status Proyek": "Tahap Konstruksi (65%)",
                "Kontraktor Pelaksana": "PT. Pembangunan Papua"
            }
        },
        { id: "pu2", name: "Gudang Alat Berat PUPR", type: "Aset Bergerak", lat: -4.520, lng: 136.860 },
        { id: "pu3", name: "Instalasi Pengolahan Air (IPA)", type: "Infrastruktur Dasar", lat: -4.575, lng: 136.930 },
        { id: "pu4", name: "Kantor Pemeliharaan Jalan", type: "Kantor Operasional", lat: -4.542, lng: 136.898 },
        // Area Perluasan/Pesisir
        { id: "pu5", name: "Dermaga Poumako", type: "Infrastruktur", lat: -4.620, lng: 137.050 },
        { id: "pu6", name: "Pos Jaga Jalan Trans Papua", type: "Infrastruktur", lat: -4.590, lng: 136.750 }
    ],
    "dinas_sosial": [
        { id: "s1", name: "Gudang Logistik Bencana", type: "Fasilitas Sosial", lat: -4.525, lng: 136.875 },
        { id: "s2", name: "Panti Sosial Mimika", type: "Fasilitas Sosial", lat: -4.548, lng: 136.898 },
        { id: "s3", name: "Posko Penanganan Darurat Wania", type: "Fasilitas Sosial", lat: -4.562, lng: 136.912 },
        { id: "s4", name: "Panti Asuhan Kasih", type: "Fasilitas Sosial", lat: -4.538, lng: 136.892 }
    ]
};