export type StatusApproval = "draft" | "menunggu" | "disetujui" | "ditolak";

export type LevelRisikoLabel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";

export interface KewaspadaanDini {
  id: string;
  periode: string; // ISO date string
  aspek: string;

  // Wilayah / Lokasi
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail: string;
  titikKoordinat: string;
  buktiFoto?: string; // filename / url
  sumberInformasi: string;

  // Analisis Risiko
  kemungkinanAncaman: {
    level: string;
    deskripsi: string;
  };
  hambatan: string;
  tantangan: string;
  gangguan: string;
  prediksiDampak: {
    level: string;
    deskripsi: string;
  };
  rekomendasi: string;
  tingkatRisiko: LevelRisikoLabel; // kalkulasi otomatis

  // Approval
  status: StatusApproval;
  catatanApproval?: string;
  approvedBy?: string;
  approvedByRole?: string;
  approvedAt?: string;

  // Meta
  createdBy: string;
  createdAt: string;
}
