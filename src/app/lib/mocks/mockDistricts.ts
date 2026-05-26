// src/app/lib/mocks/mockDistricts.ts
import { DistrictDrilldownResponse } from "../../types/gis";

/**
 * MOCK DATA: DRILLDOWN DISTRIK (18 Distrik Kabupaten Mimika)
 * Domain: Kewilayahan (Profil & Batas Distrik)
 * [REFACTOR] Menambahkan thumbnail_url untuk dirender di Sidebar DistrictListPanel
 */
export const MOCK_DISTRICT_DRILLDOWN: Record<number, DistrictDrilldownResponse> = {
    1: {
        district_id: 1,
        district_name: "Mimika Baru",
        profile: {
            id: 1,
            luas_wilayah: 2216.00,
            jumlah_penduduk: 142519,
            deskripsi: "Distrik Mimika Baru adalah pusat administrasi pemerintahan dan episentrum ekonomi utama Kabupaten Mimika. Menjadi wilayah dengan kepadatan tertinggi, distrik ini menghadapi tantangan urbanisasi cepat, manajemen tata ruang kota Timika, serta pemenuhan akses layanan kesehatan dan pendidikan yang memadai bagi masyarakat urban yang heterogen.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Wania, Timur: Distrik Mimika Timur, Barat: Distrik Iwaka",
            kode_kemendagri: "91.09.01",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-1/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 45 },
            { category_id: 2, name: "Dinas Pendidikan", total: 60 },
            { category_id: 3, name: "Dinas Koperasi & UMKM", total: 85 },
            { category_id: 4, name: "Dinas PUPR", total: 72 },
            { category_id: 5, name: "Dinas Sosial", total: 34 }
        ],
        last_updated: "2026-05-10T08:00:00Z"
    },
    2: {
        district_id: 2,
        district_name: "Kuala Kencana",
        profile: {
            id: 2,
            luas_wilayah: 860.74,
            jumlah_penduduk: 29104,
            deskripsi: "Dibangun khusus oleh PT Freeport Indonesia, Kuala Kencana merupakan kota industri modern pertama di Indonesia dengan utilitas (listrik, komunikasi) tertanam di bawah tanah dan sistem pengolahan limbah berstandar internasional. Merupakan wilayah penyokong logistik dan administrasi operasional pertambangan dengan indeks kualitas hidup tertinggi di Mimika.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Baru, Timur: Distrik Kwamki Narama, Barat: Distrik Iwaka",
            kode_kemendagri: "91.09.11",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-2/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 18 },
            { category_id: 2, name: "Dinas Pendidikan", total: 22 },
            { category_id: 3, name: "Bappeda", total: 45 },
            { category_id: 4, name: "Dinas PUPR", total: 94 }
        ],
        last_updated: "2026-05-12T10:30:00Z"
    },
    3: {
        district_id: 3,
        district_name: "Tembagapura",
        profile: {
            id: 3,
            luas_wilayah: 2586.88,
            jumlah_penduduk: 22120,
            deskripsi: "Tembagapura adalah distrik dataran tinggi yang menampung operasi tambang emas dan tembaga bawah tanah terbesar di dunia (Grasberg). Karena berada di area pegunungan bersuhu dingin ekstrem dengan topografi curam, akses ke wilayah ini sangat terbatas dan dikontrol ketat untuk kepentingan industri strategis nasional.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Kuala Kencana, Timur: Distrik Agimuga, Barat: Distrik Jila",
            kode_kemendagri: "91.09.04",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-3/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 15 },
            { category_id: 3, name: "Dinas Tenaga Kerja", total: 156 },
            { category_id: 4, name: "Dinas PUPR", total: 88 }
        ],
        last_updated: "2026-04-20T15:00:00Z"
    },
    4: {
        district_id: 4,
        district_name: "Wania",
        profile: {
            id: 4,
            luas_wilayah: 310.20,
            jumlah_penduduk: 55210,
            deskripsi: "Distrik Wania merupakan daerah penyangga langsung Distrik Mimika Baru. Wilayah ini didominasi oleh pemukiman transmigran dan warga lokal yang bergerak di sektor pertanian skala kecil serta peternakan. Tantangan utama distrik ini adalah peningkatan infrastruktur jalan poros antar desa dan fasilitas kesehatan rujukan.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru, Timur: Distrik Mimika Timur, Barat: Distrik Mimika Tengah",
            kode_kemendagri: "91.09.12",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-4/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 22 },
            { category_id: 2, name: "Dinas Pendidikan", total: 18 },
            { category_id: 3, name: "Dinas Pertanian", total: 35 },
            { category_id: 4, name: "Dinas PUPR", total: 24 }
        ],
        last_updated: "2026-05-01T09:15:00Z"
    },
    5: {
        district_id: 5,
        district_name: "Iwaka",
        profile: {
            id: 5,
            luas_wilayah: 785.40,
            jumlah_penduduk: 11450,
            deskripsi: "Distrik Iwaka dikenal dengan potensi ekowisata alam dan hasil perkebunan kelapa sawit yang menjanjikan. Dengan dilaluinya jalur Jalan Trans Papua, distrik ini mulai berkembang pesat menjadi jalur distribusi komoditas pangan dari pedalaman menuju kota Timika.",
            batas_wilayah: "Utara: Distrik Tembagapura, Selatan: Distrik Mimika Tengah, Timur: Distrik Kuala Kencana, Barat: Distrik Mimika Barat",
            kode_kemendagri: "91.09.13",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-5/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Pariwisata", total: 10 },
            { category_id: 2, name: "Dinas Pendidikan", total: 12 },
            { category_id: 3, name: "Dinas Koperasi & UMKM", total: 28 },
            { category_id: 4, name: "Dinas PUPR", total: 15 }
        ],
        last_updated: "2026-05-14T11:00:00Z"
    },
    6: {
        district_id: 6,
        district_name: "Kwamki Narama",
        profile: {
            id: 6,
            luas_wilayah: 240.50,
            jumlah_penduduk: 14890,
            deskripsi: "Kwamki Narama merupakan salah satu distrik terpadat yang memiliki histori panjang terkait konflik komunal di masa lalu. Kini, pemerintah daerah fokus pada pendekatan humanis melalui intervensi pembangunan sekolah vokasi, pasar tradisional, dan program pemberdayaan pemuda berbasis komunitas.",
            batas_wilayah: "Utara: Distrik Kuala Kencana, Selatan: Distrik Mimika Baru, Timur: Distrik Mimika Timur, Barat: Distrik Wania",
            kode_kemendagri: "91.09.14",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-6/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 14 },
            { category_id: 2, name: "Dinas Pendidikan", total: 25 },
            { category_id: 3, name: "Bappeda", total: 18 },
            { category_id: 5, name: "Dinas Sosial", total: 42 }
        ],
        last_updated: "2026-05-13T14:45:00Z"
    },
    7: {
        district_id: 7,
        district_name: "Mimika Timur",
        profile: {
            id: 7,
            luas_wilayah: 1520.10,
            jumlah_penduduk: 9540,
            deskripsi: "Terletak di kawasan estuari dan muara sungai besar, Mimika Timur didominasi oleh suku Kamoro. Wilayah ini kaya akan potensi perikanan pesisir (kepiting karang, udang) dan hutan mangrove. Pelabuhan pendaratan ikan (PPI) Poumako menjadi nadi utama ekonomi kelautan di distrik ini.",
            batas_wilayah: "Utara: Distrik Mimika Baru, Selatan: Laut Arafuru, Timur: Distrik Mimika Timur Jauh, Barat: Distrik Wania",
            kode_kemendagri: "91.09.02",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-7/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kelautan & Perikanan", total: 45 },
            { category_id: 2, name: "Dinas Perhubungan", total: 12 },
            { category_id: 3, name: "Dinas Pendidikan", total: 10 },
            { category_id: 4, name: "Dinas Kesehatan", total: 8 }
        ],
        last_updated: "2026-05-11T08:30:00Z"
    },
    8: {
        district_id: 8,
        district_name: "Mimika Tengah",
        profile: {
            id: 8,
            luas_wilayah: 2150.30,
            jumlah_penduduk: 6230,
            deskripsi: "Distrik Mimika Tengah sebagian besar wilayahnya merupakan hamparan dataran rendah rawa dan sungai. Transportasi air (ketinting/perahu motor) adalah satu-satunya moda transportasi yang menghubungkan kampung-kampung di wilayah ini menuju kota.",
            batas_wilayah: "Utara: Distrik Iwaka, Selatan: Laut Arafuru, Timur: Distrik Wania, Barat: Distrik Mimika Barat",
            kode_kemendagri: "91.09.10",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-8/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 5 },
            { category_id: 2, name: "Dinas Pendidikan", total: 8 },
            { category_id: 3, name: "Dinas Perhubungan", total: 15 },
            { category_id: 4, name: "Dinas PUPR", total: 6 }
        ],
        last_updated: "2026-05-09T13:20:00Z"
    },
    9: {
        district_id: 9,
        district_name: "Mimika Barat",
        profile: {
            id: 9,
            luas_wilayah: 2750.00,
            jumlah_penduduk: 4200,
            deskripsi: "Merupakan salah satu distrik terluar di wilayah pesisir barat Kabupaten Mimika. Akses utama menuju ibu kota distrik (Kokonao) masih sangat bergantung pada transportasi laut dan sungai, menjadikannya rentan terhadap isolasi saat cuaca buruk.",
            batas_wilayah: "Utara: Kabupaten Deiyai, Selatan: Laut Arafuru, Timur: Distrik Mimika Tengah, Barat: Distrik Mimika Barat Tengah",
            kode_kemendagri: "91.09.03",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-9/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 4 },
            { category_id: 2, name: "Dinas Pendidikan", total: 5 },
            { category_id: 4, name: "Dinas PUPR", total: 3 }
        ],
        last_updated: "2026-05-15T09:00:00Z"
    },
    10: {
        district_id: 10,
        district_name: "Agimuga",
        profile: {
            id: 10,
            luas_wilayah: 3120.45,
            jumlah_penduduk: 3150,
            deskripsi: "Agimuga adalah salah satu distrik terluas namun dengan kepadatan penduduk terendah di pedalaman pegunungan. Keterisolasian geografis membuat biaya hidup sangat tinggi, di mana pasokan barang hanya bisa mengandalkan pesawat perintis berbadan kecil (Cessna/Pilatus).",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Mimika Timur Jauh, Timur: Distrik Jita, Barat: Distrik Tembagapura",
            kode_kemendagri: "91.09.05",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-10/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 3 },
            { category_id: 2, name: "Dinas Pendidikan", total: 4 },
            { category_id: 3, name: "Bappeda", total: 5 },
            { category_id: 4, name: "Dinas Perhubungan", total: 2 }
        ],
        last_updated: "2026-05-05T07:15:00Z"
    },
    11: {
        district_id: 11,
        district_name: "Jila",
        profile: {
            id: 11,
            luas_wilayah: 1820.00,
            jumlah_penduduk: 2800,
            deskripsi: "Distrik Jila berlokasi di area pegunungan tengah dengan topografi yang sangat curam. Masyarakatnya hidup secara subsisten dari hasil berkebun dan berburu. Penetrasi layanan kesehatan dan pendidikan masih menjadi fokus utama pembangunan daerah di sini.",
            batas_wilayah: "Utara: Kabupaten Puncak, Selatan: Distrik Agimuga, Timur: Distrik Alama, Barat: Distrik Tembagapura",
            kode_kemendagri: "91.09.06",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-11/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 2 },
            { category_id: 2, name: "Dinas Pendidikan", total: 3 },
            { category_id: 5, name: "Dinas Sosial", total: 7 }
        ],
        last_updated: "2026-05-16T10:00:00Z"
    },
    12: {
        district_id: 12,
        district_name: "Jita",
        profile: {
            id: 12,
            luas_wilayah: 1350.00,
            jumlah_penduduk: 3200,
            deskripsi: "Berbatasan langsung dengan Kabupaten Asmat, Jita merupakan daerah dataran rendah bermilir dan berlumpur. Potensi perikanan darat dan perkebunan sagu menjadi penopang utama ekonomi masyarakat lokal.",
            batas_wilayah: "Utara: Distrik Agimuga, Selatan: Laut Arafuru, Timur: Kabupaten Asmat, Barat: Distrik Mimika Timur Jauh",
            kode_kemendagri: "91.09.07",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-12/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 3 },
            { category_id: 3, name: "Dinas Pertanian", total: 12 },
            { category_id: 4, name: "Dinas PUPR", total: 4 }
        ],
        last_updated: "2026-05-17T11:20:00Z"
    },
    13: {
        district_id: 13,
        district_name: "Mimika Timur Jauh",
        profile: {
            id: 13,
            luas_wilayah: 2050.00,
            jumlah_penduduk: 4500,
            deskripsi: "Distrik pemekaran yang membentang di pesisir selatan Mimika. Wilayah ini kaya akan keanekaragaman hayati estuari, namun menghadapi kendala abrasi pantai dan kurangnya infrastruktur pemecah ombak di permukiman nelayan.",
            batas_wilayah: "Utara: Distrik Agimuga, Selatan: Laut Arafuru, Timur: Distrik Jita, Barat: Distrik Mimika Timur",
            kode_kemendagri: "91.09.08",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-13/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 4 },
            { category_id: 3, name: "Dinas Kelautan & Perikanan", total: 18 },
            { category_id: 4, name: "Dinas PUPR", total: 5 }
        ],
        last_updated: "2026-05-18T09:30:00Z"
    },
    14: {
        district_id: 14,
        district_name: "Mimika Barat Jauh",
        profile: {
            id: 14,
            luas_wilayah: 3450.00,
            jumlah_penduduk: 2100,
            deskripsi: "Merupakan distrik dengan luasan daratan rawa terbesar di bagian barat. Akses telekomunikasi dan listrik masih sangat minim, dan permukiman tersebar dalam kelompok-kampung kecil di sepanjang aliran sungai besar.",
            batas_wilayah: "Utara: Kabupaten Kaimana, Selatan: Laut Arafuru, Timur: Distrik Mimika Barat Tengah, Barat: Kabupaten Kaimana",
            kode_kemendagri: "91.09.09",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-14/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kominfo", total: 2 },
            { category_id: 2, name: "Dinas Pendidikan", total: 3 },
            { category_id: 4, name: "Dinas PUPR", total: 2 }
        ],
        last_updated: "2026-05-19T08:15:00Z"
    },
    15: {
        district_id: 15,
        district_name: "Mimika Barat Tengah",
        profile: {
            id: 15,
            luas_wilayah: 2850.00,
            jumlah_penduduk: 3800,
            deskripsi: "Berada di antara distrik pesisir dan dataran rendah, wilayah ini perlahan mulai berkembang dengan adanya inisiatif pembangunan dermaga perintis skala kecil. Mata pencaharian warga bertumpu pada hasil meramu hutan dan mencari ikan.",
            batas_wilayah: "Utara: Kabupaten Deiyai, Selatan: Laut Arafuru, Timur: Distrik Mimika Barat, Barat: Distrik Mimika Barat Jauh",
            kode_kemendagri: "91.09.15",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-15/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 3 },
            { category_id: 3, name: "Dinas Perhubungan", total: 9 },
            { category_id: 5, name: "Dinas Kehutanan", total: 5 }
        ],
        last_updated: "2026-05-20T10:45:00Z"
    },
    16: {
        district_id: 16,
        district_name: "Amar",
        profile: {
            id: 16,
            luas_wilayah: 1250.00,
            jumlah_penduduk: 2950,
            deskripsi: "Distrik pemekaran baru di pesisir yang diproyeksikan sebagai salah satu klaster pengembangan perikanan tangkap terpadu. Kendala utama saat ini adalah air bersih yang payau serta terbatasnya tenaga kesehatan yang menetap.",
            batas_wilayah: "Utara: Distrik Mimika Barat, Selatan: Laut Arafuru, Timur: Distrik Mimika Tengah, Barat: Distrik Mimika Barat Tengah",
            kode_kemendagri: "91.09.16",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-16/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 4 },
            { category_id: 2, name: "Dinas Kelautan & Perikanan", total: 4 },
            { category_id: 4, name: "Dinas PUPR", total: 6 }
        ],
        last_updated: "2026-05-21T13:00:00Z"
    },
    17: {
        district_id: 17,
        district_name: "Hoya",
        profile: {
            id: 17,
            luas_wilayah: 980.00,
            jumlah_penduduk: 1500,
            deskripsi: "Hoya adalah wilayah kantong di dataran tinggi yang berbatasan dengan Kabupaten Nduga. Sama seperti Alama dan Jila, layanan dasar di Hoya sangat bergantung pada penerbangan perintis subsidi pemerintah akibat putusnya akses jalan darat.",
            batas_wilayah: "Utara: Kabupaten Nduga, Selatan: Distrik Tembagapura, Timur: Distrik Jila, Barat: Kabupaten Puncak",
            kode_kemendagri: "91.09.17",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-17/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 1 },
            { category_id: 2, name: "Dinas Pendidikan", total: 2 },
            { category_id: 5, name: "Bappeda", total: 4 }
        ],
        last_updated: "2026-05-22T08:00:00Z"
    },
    18: {
        district_id: 18,
        district_name: "Alama",
        profile: {
            id: 18,
            luas_wilayah: 1520.80,
            jumlah_penduduk: 1980,
            deskripsi: "Distrik paling terisolir di Kabupaten Mimika yang berada persis di sabuk Pegunungan Jayawijaya. Kondisi keamanan yang rentan dan ketiadaan jalan darat menjadikan pembangunan infrastruktur sipil sangat tersendat. Program pelayanan kesehatan berjalan ('Flying Doctor') menjadi andalan pemerintah.",
            batas_wilayah: "Utara: Kabupaten Nduga, Selatan: Distrik Agimuga, Timur: Kabupaten Asmat, Barat: Distrik Jila",
            kode_kemendagri: "91.09.18",
            thumbnail_url: "https://picsum.photos/seed/mimika-dist-18/100/100"
        },
        categories: [
            { category_id: 1, name: "Dinas Kesehatan", total: 2 },
            { category_id: 2, name: "Dinas Pendidikan", total: 3 },
            { category_id: 5, name: "Dinas Sosial", total: 8 }
        ],
        last_updated: "2026-04-28T16:00:00Z"
    }
};