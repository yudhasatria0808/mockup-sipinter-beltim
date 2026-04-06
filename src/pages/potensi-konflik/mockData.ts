import type { PotensiKonflik } from "../../types/potensi-konflik";

export const mockPotensiKonflik: PotensiKonflik[] = [
  {
    id: "1",
    periode: "2026-01-02",
    aspek: "Lingkungan",
    kabupaten: "Belitung Timur",
    kecamatan: "Kelapa Kampit",
    desa: "Mayang",
    alamatDetail: "Jalan Merbabu Nomor 63 RT/TW.002/001",
    titikKoordinat: "47G2+JFX Padang, Kabupaten Belitung Timur, Kepulauan Bangka Belitung",
    buktiFoto: "",
    sumberInformasi: "Intel POLRES Belitung Timur",
    namaPotensiKonflik: "Perselisihan antara Aktivis Pencinta Lingkungan (Fordas) dan Penambang",
    kemungkinanPotensiKonflik: {
      level: "Tinggi",
      deskripsi:
        "Sengketa sumber daya alam antarmasyarakat Aliran Sungai yang tercemar akibat aktifitas tambang di Hutan Lindung, DAS dan Hutan Wisata maupun Hutan Tambang Darat. Kronologis singkat peristiwa",
    },
    sumberSebabPermasalahan:
      "Aktifitas penambangan ilegal yang mencemari sumber air bersih warga dan merusak ekosistem hutan lindung",
    latarBelakangMasalah:
      "Upaya Aktifis Konsiliasi dan mediasi damai mempertemukan dua kelompok ormas bertujuan mencapai kesepakatan bersama",
    dampakPotensiKonflik: {
      level: "Tinggi",
      deskripsi:
        "Dengan melakukan Konsiliasi dan mediasi damai mempertemukan dua kelompok ormas bertujuan mencapai kesepakatan bersama",
    },
    upayaPenanganan:
      "Mengupayakan keikutsertaan peran Pemerintah daerah dalam menyelesaikan potensi konflik ini melalui tata kelola pertambangan",
    keteranganDetail:
      "Koordinasi dengan Dinas ESDM dan aparat keamanan setempat untuk pengawasan ketat aktivitas tambang",
    rekomendasi:
      "Perlu segera dilakukan rapat koordinasi terbatas (Rakor) Tim Terpadu Penanganan Konflik Sosial (PKS) Kabupaten",
    tingkatRisiko: "Tinggi",
    status: "menunggu",
    createdBy: "Budi Santoso",
    createdAt: "2026-01-02T08:00:00Z",
  },
  {
    id: "2",
    periode: "2026-01-10",
    aspek: "Sosial",
    kabupaten: "Belitung Timur",
    kecamatan: "Manggar",
    desa: "Kurnia Jaya",
    alamatDetail: "Jalan Raya Manggar No. 12",
    titikKoordinat: "-2.8833, 108.2667",
    sumberInformasi: "Babinsa Koramil 02",
    namaPotensiKonflik: "Konflik Antar Kelompok Pemuda",
    kemungkinanPotensiKonflik: {
      level: "Sedang",
      deskripsi: "Potensi konflik antar kelompok pemuda akibat perselisihan di media sosial yang memanas",
    },
    sumberSebabPermasalahan: "Penyebaran konten provokatif di media sosial oleh oknum tidak bertanggung jawab",
    latarBelakangMasalah: "Minimnya tokoh masyarakat yang bisa menjadi mediator dan penyebaran hoaks yang cepat",
    dampakPotensiKonflik: {
      level: "Sedang",
      deskripsi: "Potensi tawuran antar pemuda yang dapat meresahkan warga sekitar dan mengganggu ketertiban umum",
    },
    upayaPenanganan: "Koordinasi dengan tokoh agama dan pemuda setempat untuk mediasi",
    keteranganDetail: "Kerumunan massa di depan balai desa pada malam hari perlu diantisipasi",
    rekomendasi: "Patroli rutin dan sosialisasi damai oleh Bhabinkamtibmas",
    tingkatRisiko: "Sedang",
    status: "disetujui",
    approvedBy: "Kepala Bidang Keamanan",
    approvedAt: "2026-01-11T10:00:00Z",
    createdBy: "Siti Rahayu",
    createdAt: "2026-01-10T09:30:00Z",
  },
  {
    id: "3",
    periode: "2026-01-15",
    aspek: "Politik",
    kabupaten: "Belitung Timur",
    kecamatan: "Dendang",
    desa: "Dendang",
    alamatDetail: "Kantor Desa Dendang",
    titikKoordinat: "-2.9500, 108.1500",
    sumberInformasi: "Intelijen Polres",
    namaPotensiKonflik: "Gesekan Antar Pendukung Calon Kepala Desa",
    kemungkinanPotensiKonflik: {
      level: "Rendah",
      deskripsi: "Potensi gesekan antar pendukung calon kepala desa menjelang pemilihan",
    },
    sumberSebabPermasalahan: "Kurangnya sosialisasi aturan kampanye di tingkat desa dan money politics",
    latarBelakangMasalah: "Persaingan ketat antar calon yang memicu polarisasi di masyarakat desa",
    dampakPotensiKonflik: {
      level: "Rendah",
      deskripsi: "Ketegangan sosial yang bersifat sementara pasca pemilihan",
    },
    upayaPenanganan: "Patroli rutin dan sosialisasi damai pemilu oleh Bhabinkamtibmas",
    keteranganDetail: "Pemasangan atribut kampanye di lokasi terlarang perlu ditertibkan",
    rekomendasi: "Koordinasi dengan KPU dan Panwaslu setempat untuk pengawasan kampanye",
    tingkatRisiko: "Rendah",
    status: "draft",
    createdBy: "Ahmad Fauzi",
    createdAt: "2026-01-15T14:00:00Z",
  },
  {
    id: "4",
    periode: "2026-01-20",
    aspek: "Ekonomi",
    kabupaten: "Belitung Timur",
    kecamatan: "Simpang Pesak",
    desa: "Tanjung Batu Itam",
    alamatDetail: "Pelabuhan Nelayan Tanjung Batu Itam",
    titikKoordinat: "-3.0200, 108.3100",
    sumberInformasi: "Dinas Kelautan dan Perikanan",
    namaPotensiKonflik: "Konflik Nelayan Lokal vs Kapal Asing",
    kemungkinanPotensiKonflik: {
      level: "Sangat Tinggi",
      deskripsi:
        "Konflik antara nelayan lokal dan kapal asing yang diduga melakukan penangkapan ikan ilegal di wilayah perairan",
    },
    sumberSebabPermasalahan: "Keterbatasan armada patroli laut dan koordinasi lintas instansi yang lambat",
    latarBelakangMasalah:
      "Nelayan lokal memblokir akses pelabuhan sebagai bentuk protes atas kerugian ekonomi akibat illegal fishing",
    dampakPotensiKonflik: {
      level: "Sangat Tinggi",
      deskripsi:
        "Eskalasi konflik bersenjata di laut dan kerugian ekonomi besar bagi nelayan lokal",
    },
    upayaPenanganan: "Operasi gabungan TNI AL dan Polairud segera",
    keteranganDetail: "Koordinasi lintas instansi antara KKP, TNI AL, dan Polairud perlu dipercepat",
    rekomendasi: "Mediasi dengan perwakilan nelayan dan penegakan hukum terhadap kapal asing",
    tingkatRisiko: "Sangat Tinggi",
    status: "ditolak",
    catatanApproval: "Data koordinat tidak valid, mohon diperbaiki",
    approvedBy: "Kabid Intelijen",
    approvedAt: "2026-01-21T08:00:00Z",
    createdBy: "Rudi Hartono",
    createdAt: "2026-01-20T16:00:00Z",
  },
];

export const aspekOptions = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];
export const levelOptions: string[] = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];

const matriksRisiko: Record<string, Record<string, string>> = {
  Rendah: { Rendah: "Rendah", Sedang: "Rendah", Tinggi: "Sedang", "Sangat Tinggi": "Sedang" },
  Sedang: { Rendah: "Rendah", Sedang: "Sedang", Tinggi: "Tinggi", "Sangat Tinggi": "Tinggi" },
  Tinggi: { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
  "Sangat Tinggi": { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Sangat Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
};

export function kalkulasiTingkatRisiko(levelKemungkinan: string, levelDampak: string): string {
  return matriksRisiko[levelKemungkinan]?.[levelDampak] ?? "-";
}
