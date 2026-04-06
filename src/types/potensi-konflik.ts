export type StatusApproval = "draft" | "menunggu" | "disetujui" | "ditolak";

export type LevelRisikoLabel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";

export interface PotensiKonflik {
  id: string;
  periode: string; // ISO date string
  aspek: string;

  // Wilayah / Lokasi
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail: string;
  titikKoordinat: string;
  buktiFoto?: string;
  sumberInformasi: string;

  // Analisis Konflik
  namaPotensiKonflik: string;
  kemungkinanPotensiKonflik: {
    level: LevelRisikoLabel;
    deskripsi: string;
  };
  sumberSebabPermasalahan: string;
  latarBelakangMasalah: string;
  dampakPotensiKonflik: {
    level: LevelRisikoLabel;
    deskripsi: string;
  };
  upayaPenanganan: string;
  keteranganDetail: string;
  rekomendasi: string;
  tingkatRisiko: LevelRisikoLabel; // kalkulasi otomatis dari matriks

  // Approval
  status: StatusApproval;
  catatanApproval?: string;
  approvedBy?: string;
  approvedAt?: string;

  // Meta
  createdBy: string;
  createdAt: string;
}
