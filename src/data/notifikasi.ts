// Mock data notifikasi real-time untuk semua level (Operator → Admin → User)

export type NotifikasiLevel = "operator" | "administrator" | "user";
export type NotifikasiPrioritas = "rendah" | "sedang" | "tinggi" | "kritis";
export type NotifikasiStatus = "belum_dibaca" | "dibaca" | "ditindaklanjuti";

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  kategori: string; // "kewaspadaan" | "potensi-konflik" | "peristiwa-konflik" | "wna" | "tka" | "sistem"
  prioritas: NotifikasiPrioritas;
  status: NotifikasiStatus;
  pengirim: string;
  tujuanLevel: NotifikasiLevel;
  laporanId?: string;
  laporanPath?: string;
  createdAt: string;
  dibacaAt?: string;
}

export const mockNotifikasi: Notifikasi[] = [
  {
    id: "n1",
    judul: "Laporan Baru: Kewaspadaan Dini",
    pesan: "Operator Budi Santoso mengirimkan laporan kewaspadaan dini baru terkait potensi bentrokan di Desa Mayang, Kec. Kelapa Kampit. Tingkat risiko: Tinggi. Segera lakukan verifikasi.",
    kategori: "kewaspadaan",
    prioritas: "tinggi",
    status: "belum_dibaca",
    pengirim: "Budi Santoso",
    tujuanLevel: "administrator",
    laporanId: "1",
    laporanPath: "/kewaspadaan/1",
    createdAt: "2026-01-02T08:05:00Z",
  },
  {
    id: "n2",
    judul: "Laporan Baru: Potensi Konflik",
    pesan: "Operator Budi Santoso mengirimkan laporan potensi konflik: Perselisihan antara Aktivis Pencinta Lingkungan (Fordas) dan Penambang. Tingkat risiko: Tinggi.",
    kategori: "potensi-konflik",
    prioritas: "tinggi",
    status: "dibaca",
    pengirim: "Budi Santoso",
    tujuanLevel: "administrator",
    laporanId: "1",
    laporanPath: "/potensi-konflik/1",
    createdAt: "2026-01-02T08:10:00Z",
    dibacaAt: "2026-01-02T09:00:00Z",
  },
  {
    id: "n3",
    judul: "[HIGH ALERT] Risiko Tinggi Terverifikasi",
    pesan: "Laporan kewaspadaan dini di Desa Mayang telah diverifikasi oleh Administrator dengan klasifikasi Risiko TINGGI. Segera tindak lanjuti dengan rapat koordinasi Forkopimda.",
    kategori: "kewaspadaan",
    prioritas: "kritis",
    status: "belum_dibaca",
    pengirim: "Administrator",
    tujuanLevel: "user",
    laporanId: "1",
    laporanPath: "/kewaspadaan/1",
    createdAt: "2026-01-02T10:00:00Z",
  },
  {
    id: "n4",
    judul: "Laporan Disetujui",
    pesan: "Laporan potensi konflik 'Konflik Antar Kelompok Pemuda' telah disetujui oleh Kepala Bidang Keamanan. Klasifikasi: Risiko Sedang.",
    kategori: "potensi-konflik",
    prioritas: "sedang",
    status: "dibaca",
    pengirim: "Kepala Bidang Keamanan",
    tujuanLevel: "user",
    laporanId: "2",
    laporanPath: "/potensi-konflik/2",
    createdAt: "2026-01-11T10:05:00Z",
    dibacaAt: "2026-01-11T11:00:00Z",
  },
  {
    id: "n5",
    judul: "Laporan Ditolak",
    pesan: "Laporan kewaspadaan dini Anda ditolak oleh Kabid Intelijen. Catatan: 'Data koordinat tidak valid, mohon diperbaiki'. Silakan perbaiki dan kirim ulang.",
    kategori: "kewaspadaan",
    prioritas: "sedang",
    status: "belum_dibaca",
    pengirim: "Kabid Intelijen",
    tujuanLevel: "operator",
    laporanId: "4",
    laporanPath: "/kewaspadaan/edit/4",
    createdAt: "2026-01-21T08:05:00Z",
  },
  {
    id: "n6",
    judul: "[HIGH ALERT] Konflik Nelayan - Risiko Sangat Tinggi",
    pesan: "PERHATIAN: Laporan konflik nelayan lokal vs kapal asing di Tanjung Batu Itam terklasifikasi SANGAT TINGGI. Diperlukan tindakan segera: operasi gabungan TNI AL dan Polairud.",
    kategori: "potensi-konflik",
    prioritas: "kritis",
    status: "belum_dibaca",
    pengirim: "Sistem",
    tujuanLevel: "user",
    laporanId: "4",
    laporanPath: "/potensi-konflik/4",
    createdAt: "2026-01-21T08:10:00Z",
  },
  {
    id: "n7",
    judul: "[HIGH ALERT - PENGINGAT] Konflik Nelayan Belum Ditindaklanjuti",
    pesan: "PENGINGAT: Laporan Risiko Sangat Tinggi 'Konflik Nelayan Lokal vs Kapal Asing' belum ditindaklanjuti selama 24 jam. Segera ambil keputusan.",
    kategori: "potensi-konflik",
    prioritas: "kritis",
    status: "belum_dibaca",
    pengirim: "Sistem",
    tujuanLevel: "user",
    laporanId: "4",
    laporanPath: "/potensi-konflik/4",
    createdAt: "2026-01-22T08:10:00Z",
  },
  {
    id: "n8",
    judul: "Laporan Baru: Data WNA",
    pesan: "Operator mengirimkan data WNA baru: warga negara China dengan visa kerja di Kec. Manggar. Segera verifikasi kelengkapan dokumen.",
    kategori: "wna",
    prioritas: "rendah",
    status: "dibaca",
    pengirim: "Siti Rahayu",
    tujuanLevel: "administrator",
    laporanId: "1",
    laporanPath: "/wna/1",
    createdAt: "2026-01-15T09:00:00Z",
    dibacaAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "n9",
    judul: "Laporan Baru: Data TKA",
    pesan: "Operator mengirimkan data TKA baru: Li Wei dari PT. Timah Resources. Segera verifikasi kelengkapan IMTA/RPTKA.",
    kategori: "tka",
    prioritas: "rendah",
    status: "ditindaklanjuti",
    pengirim: "Ahmad Fauzi",
    tujuanLevel: "administrator",
    laporanId: "1",
    laporanPath: "/tka/1",
    createdAt: "2026-01-16T09:00:00Z",
    dibacaAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "n10",
    judul: "Laporan Periodik Tersedia",
    pesan: "Laporan periodik bulan Januari 2026 telah digenerate otomatis oleh sistem. Silakan unduh di halaman Laporan.",
    kategori: "sistem",
    prioritas: "rendah",
    status: "belum_dibaca",
    pengirim: "Sistem",
    tujuanLevel: "administrator",
    createdAt: "2026-02-01T00:00:00Z",
  },
];
