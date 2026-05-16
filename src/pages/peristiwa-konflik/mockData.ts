import type { PeristiwaKonflik } from "../../types/peristiwa-konflik";

export const mockPeristiwaKonflik: PeristiwaKonflik[] = [
  {
    id: "1",
    periode: "2026-02-28",
    namaPeristiwa: "Tawuran antar Ormas A dan Ormas B",
    sumberSebabKonflik:
      "Permasalahan yang berkaitan dengan politik, ekonomi dan sosial budaya",
    latarBelakangKejadian: "Kronologis singkat peristiwa",
    deskripsiAkibatPeristiwa:
      "1 Org korban kritis, 5 Org luka-luka, 20 Org Mengungsi. Kerugian Rp.1.000.000.000",
    korbanKritis: 1,
    korbanLukaLuka: 5,
    korbanMengungsi: 20,
    kerugianMateril: 1000000000,
    upayaPenanganan:
      "Dengan melakukan Konsiliasi dan mediasi damai mempertemukan dua kelompok ormas bertujuan mencapai kesepakatan bersama.",
    upayaPemulihan:
      "Melalui kegiatan Pemulihan; Rehabilitasi; dan Rekonstruksi;",
    kabupaten: "Belitung Timur",
    kecamatan: "Kelapa Kampit",
    desa: "Mayang",
    alamatDetail: "Jalan Merbabu Nomor 63 RT/TW.002/001",
    titikKoordinat: "47G2+JFX Padang, Kabupaten Belitung Timur, Kepulauan Bangka Belitung",
    buktiFoto: "",
    sumberInformasi: "Polres, Masyarakat dst. (No.Surat Pengaduan, Tanggal Pengaduan)",
    keterangan: "",
    tingkatRisiko: "Tinggi",
    status: "disetujui",
    approvedBy: "Kepala Bidang Keamanan",
    approvedAt: "2026-03-01T10:00:00Z",
    createdBy: "Budi Santoso",
    createdAt: "2026-02-28T08:00:00Z",
  },
  {
    id: "2",
    periode: "2026-03-05",
    namaPeristiwa: "Bentrokan Warga Antar Dusun",
    sumberSebabKonflik: "Sengketa batas lahan pertanian antar dusun yang sudah berlangsung lama",
    latarBelakangKejadian:
      "Perselisihan batas lahan yang tidak kunjung diselesaikan secara hukum memicu aksi saling serang antar warga",
    deskripsiAkibatPeristiwa:
      "3 Org luka-luka, 8 Org Mengungsi. Kerugian Rp.50.000.000",
    korbanKritis: 0,
    korbanLukaLuka: 3,
    korbanMengungsi: 8,
    kerugianMateril: 50000000,
    upayaPenanganan:
      "Mediasi oleh Camat dan Kepala Desa dengan melibatkan tokoh adat setempat",
    upayaPemulihan: "Rehabilitasi rumah warga yang rusak dan konseling trauma",
    kabupaten: "Belitung Timur",
    kecamatan: "Manggar",
    desa: "Kurnia Jaya",
    alamatDetail: "Jalan Raya Manggar No. 12",
    titikKoordinat: "-2.8833, 108.2667",
    sumberInformasi: "Babinsa Koramil 02",
    keterangan: "Situasi sudah kondusif pasca mediasi",
    tingkatRisiko: "Sedang",
    status: "disetujui",
    approvedBy: "Kabid Intelijen",
    approvedAt: "2026-03-06T09:00:00Z",
    createdBy: "Siti Rahayu",
    createdAt: "2026-03-05T14:00:00Z",
  },
  {
    id: "3",
    periode: "2026-03-10",
    namaPeristiwa: "Kerusuhan Pasca Pilkades",
    sumberSebabKonflik: "Ketidakpuasan pendukung calon yang kalah dalam pemilihan kepala desa",
    latarBelakangKejadian:
      "Dugaan kecurangan dalam proses pemungutan suara memicu massa pendukung calon kalah untuk melakukan aksi anarkis",
    deskripsiAkibatPeristiwa:
      "2 Org luka-luka, 15 Org Mengungsi. Kerugian Rp.200.000.000",
    korbanKritis: 0,
    korbanLukaLuka: 2,
    korbanMengungsi: 15,
    kerugianMateril: 200000000,
    upayaPenanganan:
      "Pengerahan aparat keamanan dan negosiasi dengan pimpinan massa",
    upayaPemulihan: "Rekonsiliasi antar pendukung difasilitasi oleh Pemda",
    kabupaten: "Belitung Timur",
    kecamatan: "Dendang",
    desa: "Dendang",
    alamatDetail: "Kantor Desa Dendang",
    titikKoordinat: "-2.9500, 108.1500",
    sumberInformasi: "Intelijen Polres",
    keterangan: "Proses hukum terhadap pelaku kerusuhan sedang berjalan",
    tingkatRisiko: "Tinggi",
    status: "menunggu",
    createdBy: "Ahmad Fauzi",
    createdAt: "2026-03-10T16:00:00Z",
  },
  {
    id: "4",
    periode: "2026-03-15",
    namaPeristiwa: "Konflik Nelayan dengan Perusahaan Tambak",
    sumberSebabKonflik:
      "Limbah perusahaan tambak udang mencemari area tangkap nelayan tradisional",
    latarBelakangKejadian:
      "Nelayan lokal mengalami penurunan hasil tangkap drastis akibat pencemaran air laut oleh limbah tambak",
    deskripsiAkibatPeristiwa:
      "Tidak ada korban jiwa. Kerugian ekonomi nelayan Rp.500.000.000",
    korbanKritis: 0,
    korbanLukaLuka: 0,
    korbanMengungsi: 0,
    kerugianMateril: 500000000,
    upayaPenanganan:
      "Koordinasi dengan Dinas Lingkungan Hidup dan Dinas Kelautan untuk investigasi pencemaran",
    upayaPemulihan:
      "Kompensasi sementara bagi nelayan terdampak dan program pemulihan ekosistem laut",
    kabupaten: "Belitung Timur",
    kecamatan: "Simpang Pesak",
    desa: "Tanjung Batu Itam",
    alamatDetail: "Pelabuhan Nelayan Tanjung Batu Itam",
    titikKoordinat: "-3.0200, 108.3100",
    sumberInformasi: "Dinas Kelautan dan Perikanan",
    keterangan: "Menunggu hasil uji laboratorium sampel air laut",
    tingkatRisiko: "Sangat Tinggi",
    status: "draft",
    createdBy: "Rudi Hartono",
    createdAt: "2026-03-15T10:00:00Z",
  },
];

export const aspekOptions = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];
export const levelOptions: string[] = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
