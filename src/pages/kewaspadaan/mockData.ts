import type { KewaspadaanDini } from "../../types/kewaspadaan";

export const mockKewaspadaan: KewaspadaanDini[] = [
  {
    id: "1",
    periode: "2026-01-02",
    aspek: "Keamanan",
    kabupaten: "Belitung Timur",
    kecamatan: "Kelapa Kampit",
    desa: "Mayang",
    alamatDetail: "Jalan Merbabu Nomor 63 RT/TW.002/001",
    titikKoordinat: "47G2+JFX Padang, Kabupaten Belitung Timur, Kepulauan Bangka Belitung",
    buktiFoto: "",
    sumberInformasi: "Polres Belitung Timur",
    kemungkinanAncaman: {
      level: "Tinggi",
      deskripsi:
        "Potensi bentrokan antara warga desa dengan pihak perkebunan PT. ARC karena klaim lahan adat yang belum terselesaikan",
    },
    hambatan:
      "Adanya provokasi dari pihak luar yang memanfaatkan isu lahan untuk kepentingan lokal menjelang Pilkada",
    tantangan:
      "Lambatnya mediasi dan instansi teknis terkait sehingga meningkatkan ketidakpercayaan warga",
    gangguan:
      "Pemblokiran jalan akses perkebunan oleh warga sejak 3 Januari 2026 yang mengganggu aktivitas ekonomi",
    prediksiDampak: {
      level: "Tinggi",
      deskripsi:
        "Jika dibiarkan, akan terjadi perusakan fasilitas perkebunan dan bentrokan dengan aparat keamanan",
    },
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
    kemungkinanAncaman: {
      level: "Sedang",
      deskripsi: "Potensi konflik antar kelompok pemuda akibat perselisihan di media sosial",
    },
    hambatan: "Minimnya tokoh masyarakat yang bisa menjadi mediator",
    tantangan: "Penyebaran hoaks yang cepat melalui grup WhatsApp warga",
    gangguan: "Kerumunan massa di depan balai desa pada malam hari",
    prediksiDampak: {
      level: "Sedang",
      deskripsi: "Potensi tawuran antar pemuda yang dapat meresahkan warga sekitar",
    },
    rekomendasi: "Koordinasi dengan tokoh agama dan pemuda setempat untuk mediasi",
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
    kemungkinanAncaman: {
      level: "Rendah",
      deskripsi: "Potensi gesekan antar pendukung calon kepala desa menjelang pemilihan",
    },
    hambatan: "Kurangnya sosialisasi aturan kampanye di tingkat desa",
    tantangan: "Money politics yang sulit dibuktikan",
    gangguan: "Pemasangan atribut kampanye di lokasi terlarang",
    prediksiDampak: {
      level: "Rendah",
      deskripsi: "Ketegangan sosial yang bersifat sementara pasca pemilihan",
    },
    rekomendasi: "Patroli rutin dan sosialisasi damai pemilu oleh Bhabinkamtibmas",
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
    kemungkinanAncaman: {
      level: "Sangat Tinggi",
      deskripsi:
        "Konflik antara nelayan lokal dan kapal asing yang diduga melakukan penangkapan ikan ilegal di wilayah perairan",
    },
    hambatan: "Keterbatasan armada patroli laut",
    tantangan: "Koordinasi lintas instansi yang lambat antara KKP, TNI AL, dan Polairud",
    gangguan: "Nelayan lokal memblokir akses pelabuhan sebagai bentuk protes",
    prediksiDampak: {
      level: "Sangat Tinggi",
      deskripsi:
        "Eskalasi konflik bersenjata di laut dan kerugian ekonomi besar bagi nelayan lokal",
    },
    rekomendasi:
      "Operasi gabungan TNI AL dan Polairud segera, serta mediasi dengan perwakilan nelayan",
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

export const levelKemungkinanOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
export const levelDampakOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];

// Matriks kalkulasi tingkat risiko
const matriksRisiko: Record<string, Record<string, string>> = {
  Rendah: { Rendah: "Rendah", Sedang: "Rendah", Tinggi: "Sedang", "Sangat Tinggi": "Sedang" },
  Sedang: { Rendah: "Rendah", Sedang: "Sedang", Tinggi: "Tinggi", "Sangat Tinggi": "Tinggi" },
  Tinggi: { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
  "Sangat Tinggi": { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Sangat Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
};

export function kalkulasiTingkatRisiko(levelKemungkinan: string, levelDampak: string): string {
  return matriksRisiko[levelKemungkinan]?.[levelDampak] ?? "-";
}
