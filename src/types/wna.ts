export type StatusApproval = "draft" | "menunggu" | "disetujui" | "ditolak";

export type JenisKelamin = "Laki-Laki" | "Perempuan";

export type JenisVisa =
  | "KITAS"
  | "KITAP"
  | "Visa Kunjungan"
  | "Visa Wisata"
  | "Visa Dinas"
  | "Visa Diplomatik"
  | "Visa Pelajar"
  | "Visa Kerja"
  | "Lainnya";

export type StatusTinggal = "Aktif" | "Keluar" | "Habis Izin" | "Lainnya";

export interface WNA {
  id: string;

  // Periode Pelaporan
  periode: string; // ISO date string

  // Identitas
  jenisKelamin: JenisKelamin;
  kewarganegaraan: string;
  noPaspor: string;

  // Visa / Izin Tinggal
  jenisVisa: JenisVisa;
  masaBerlakuVisa: string; // ISO date string
  pekerjaan: string;
  sponsor: string; // Perusahaan / Perorangan

  // Alamat Domisili
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail: string;
  titikKoordinat: string;

  // Lama Tinggal & Status
  lamaTinggal: string; // contoh: "1 Tahun", "6 Bulan"
  statusTinggal: StatusTinggal;
  keterangan?: string;

  // Sumber
  sumberInformasi: string;

  // Approval
  status: StatusApproval;
  catatanApproval?: string;
  approvedBy?: string;
  approvedAt?: string;

  // Meta
  createdBy: string;
  createdAt: string;
}
