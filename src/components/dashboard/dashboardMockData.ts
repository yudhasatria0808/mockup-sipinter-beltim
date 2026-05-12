/**
 * Mock data untuk Dashboard Belitung Timur
 * Data statis — tidak ada API call
 */

export interface KecamatanData {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  totalKonflik: number;
  risikoTinggi: number;
  risikoSedang: number;
  risikoRendah: number;
}

export interface KonflikPerAspek {
  kecamatan: string;
  keamanan: number;
  sosial: number;
  politik: number;
  ekonomi: number;
  lingkungan: number;
  hukum: number;
}

export interface RecentAlert {
  id: string;
  kecamatan: string;
  desa: string;
  aspek: string;
  tingkatRisiko: "Sangat Tinggi" | "Tinggi" | "Sedang" | "Rendah";
  deskripsi: string;
  tanggal: string;
}

// Data kecamatan Belitung Timur dengan koordinat dan statistik konflik
export const kecamatanData: KecamatanData[] = [
  {
    id: "190601",
    nama: "Manggar",
    latitude: -2.8800,
    longitude: 108.2700,
    totalKonflik: 8,
    risikoTinggi: 2,
    risikoSedang: 4,
    risikoRendah: 2,
  },
  {
    id: "190602",
    nama: "Gantung",
    latitude: -2.9600,
    longitude: 108.0800,
    totalKonflik: 5,
    risikoTinggi: 1,
    risikoSedang: 2,
    risikoRendah: 2,
  },
  {
    id: "190603",
    nama: "Dendang",
    latitude: -2.7800,
    longitude: 108.1500,
    totalKonflik: 3,
    risikoTinggi: 0,
    risikoSedang: 1,
    risikoRendah: 2,
  },
  {
    id: "190604",
    nama: "Kelapa Kampit",
    latitude: -2.8200,
    longitude: 107.9500,
    totalKonflik: 7,
    risikoTinggi: 3,
    risikoSedang: 2,
    risikoRendah: 2,
  },
  {
    id: "190605",
    nama: "Damar",
    latitude: -3.0500,
    longitude: 108.1000,
    totalKonflik: 2,
    risikoTinggi: 0,
    risikoSedang: 1,
    risikoRendah: 1,
  },
  {
    id: "190606",
    nama: "Simpang Renggiang",
    latitude: -2.9200,
    longitude: 107.9800,
    totalKonflik: 4,
    risikoTinggi: 1,
    risikoSedang: 2,
    risikoRendah: 1,
  },
  {
    id: "190607",
    nama: "Simpang Pesak",
    latitude: -3.1000,
    longitude: 107.8800,
    totalKonflik: 6,
    risikoTinggi: 2,
    risikoSedang: 3,
    risikoRendah: 1,
  },
];

// Data heatmap: intensitas konflik per aspek per kecamatan
export const konflikPerAspek: KonflikPerAspek[] = [
  { kecamatan: "Manggar", keamanan: 3, sosial: 2, politik: 1, ekonomi: 1, lingkungan: 0, hukum: 1 },
  { kecamatan: "Gantung", keamanan: 1, sosial: 1, politik: 2, ekonomi: 0, lingkungan: 1, hukum: 0 },
  { kecamatan: "Dendang", keamanan: 0, sosial: 1, politik: 1, ekonomi: 0, lingkungan: 1, hukum: 0 },
  { kecamatan: "Kelapa Kampit", keamanan: 3, sosial: 1, politik: 0, ekonomi: 2, lingkungan: 1, hukum: 0 },
  { kecamatan: "Damar", keamanan: 0, sosial: 0, politik: 0, ekonomi: 1, lingkungan: 1, hukum: 0 },
  { kecamatan: "Simpang Renggiang", keamanan: 1, sosial: 1, politik: 1, ekonomi: 0, lingkungan: 0, hukum: 1 },
  { kecamatan: "Simpang Pesak", keamanan: 2, sosial: 1, politik: 0, ekonomi: 2, lingkungan: 1, hukum: 0 },
];

// Recent alerts
export const recentAlerts: RecentAlert[] = [
  {
    id: "1",
    kecamatan: "Kelapa Kampit",
    desa: "Mayang",
    aspek: "Keamanan",
    tingkatRisiko: "Tinggi",
    deskripsi: "Potensi bentrokan antara warga desa dengan pihak perkebunan PT. ARC karena klaim lahan adat",
    tanggal: "2026-01-02",
  },
  {
    id: "2",
    kecamatan: "Manggar",
    desa: "Kurnia Jaya",
    aspek: "Sosial",
    tingkatRisiko: "Sedang",
    deskripsi: "Potensi konflik antar kelompok pemuda akibat perselisihan di media sosial",
    tanggal: "2026-01-10",
  },
  {
    id: "3",
    kecamatan: "Dendang",
    desa: "Dendang",
    aspek: "Politik",
    tingkatRisiko: "Rendah",
    deskripsi: "Potensi gesekan antar pendukung calon kepala desa menjelang pemilihan",
    tanggal: "2026-01-15",
  },
  {
    id: "4",
    kecamatan: "Simpang Pesak",
    desa: "Tanjung Batu Itam",
    aspek: "Ekonomi",
    tingkatRisiko: "Sangat Tinggi",
    deskripsi: "Konflik nelayan lokal dan kapal asing — penangkapan ikan ilegal di perairan",
    tanggal: "2026-01-20",
  },
  {
    id: "5",
    kecamatan: "Manggar",
    desa: "Lalang Jaya",
    aspek: "Lingkungan",
    tingkatRisiko: "Tinggi",
    deskripsi: "Pencemaran sungai akibat aktivitas tambang ilegal yang meresahkan warga",
    tanggal: "2026-02-05",
  },
  {
    id: "6",
    kecamatan: "Gantung",
    desa: "Selingsing",
    aspek: "Keamanan",
    tingkatRisiko: "Sedang",
    deskripsi: "Peningkatan kriminalitas pencurian di area perkebunan sawit",
    tanggal: "2026-02-12",
  },
  {
    id: "7",
    kecamatan: "Simpang Renggiang",
    desa: "Renggiang",
    aspek: "Sosial",
    tingkatRisiko: "Sedang",
    deskripsi: "Ketegangan antar warga pendatang dan warga lokal terkait akses lahan",
    tanggal: "2026-02-18",
  },
  {
    id: "8",
    kecamatan: "Kelapa Kampit",
    desa: "Air Kelik",
    aspek: "Ekonomi",
    tingkatRisiko: "Tinggi",
    deskripsi: "Protes pekerja tambang timah terhadap pemutusan kontrak sepihak",
    tanggal: "2026-03-01",
  },
];
