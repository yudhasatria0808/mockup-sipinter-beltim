export type StatusApproval = "draft" | "menunggu" | "disetujui" | "ditolak";

export type JenisKelamin = "Laki-Laki" | "Perempuan";

export type JenisIzinTinggal = "Visa" | "KITAS" | "KITAP";

export interface TKA {
  id: string;

  // Periode Pelaporan
  periode: string; // ISO date string

  // Identitas TKA
  namaTKA: string;
  jenisKelamin: JenisKelamin;
  namaPerusahaan: string;
  jabatanKeterampilan: string;
  noTelepon: string;
  kewarganegaraan: string;
  noPaspor: string;

  // IMTA / RPTKA
  nomorIMTA: string; // Nomor IMTA/RPTKA
  tanggalMulaiIMTA: string; // ISO date
  tanggalBerakhirIMTA: string; // ISO date

  // Jenis Izin Tinggal
  jenisIzinTinggal: JenisIzinTinggal;

  // Alamat Domisili
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail: string;
  titikKoordinat: string;

  // Keterangan & Sumber
  keterangan?: string;
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
