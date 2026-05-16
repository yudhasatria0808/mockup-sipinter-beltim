export type StatusApproval = "draft" | "menunggu" | "disetujui" | "ditolak";

export type LevelRisikoLabel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";

export interface PeristiwaKonflik {
  id: string;
  periode: string; // ISO date string

  // Identitas Peristiwa
  namaPeristiwa: string;
  sumberSebabKonflik: string;
  latarBelakangKejadian: string;
  deskripsiAkibatPeristiwa: string;

  // Korban & Kerugian
  korbanKritis: number;
  korbanLukaLuka: number;
  korbanMengungsi: number;
  kerugianMateril: number; // dalam rupiah

  // Upaya
  upayaPenanganan: string;
  upayaPemulihan: string;

  // Wilayah / Lokasi
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail: string;
  titikKoordinat: string;

  // Bukti & Sumber
  buktiFoto?: string;
  sumberInformasi: string;
  keterangan?: string;

  // Saran Tindak Lanjut
  saranTindakLanjut?: string;

  // Tingkat Risiko
  tingkatRisiko: LevelRisikoLabel;

  // Approval
  status: StatusApproval;
  catatanApproval?: string;
  approvedBy?: string;
  approvedAt?: string;

  // Meta
  createdBy: string;
  createdAt: string;
}
