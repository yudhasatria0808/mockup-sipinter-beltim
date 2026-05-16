import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

export type JenisKeputusan = "rapat_koordinasi" | "pengerahan_personil" | "tindakan_hukum" | "mediasi" | "lainnya";
export type StatusTindakLanjut = "menunggu_keputusan" | "dalam_proses" | "selesai";

export interface TindakLanjut {
  id: string;
  laporanId: string;
  laporanJudul: string;
  laporanKategori: string;
  tingkatRisiko: string;
  jenisKeputusan: JenisKeputusan;
  deskripsiKeputusan: string;
  penanggungJawab: string;
  tanggalKeputusan: string;
  targetSelesai: string;
  status: StatusTindakLanjut;
  catatanPelaksanaan?: string;
  createdBy: string;
  createdAt: string;
}

const jenisKeputusanLabel: Record<JenisKeputusan, string> = {
  rapat_koordinasi: "Rapat Koordinasi Forkopimda",
  pengerahan_personil: "Pengerahan Personil",
  tindakan_hukum: "Tindakan Hukum",
  mediasi: "Mediasi / Negosiasi",
  lainnya: "Lainnya",
};

const statusLabel: Record<StatusTindakLanjut, { label: string; className: string }> = {
  menunggu_keputusan: { label: "Menunggu Keputusan", className: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400" },
  dalam_proses: { label: "Dalam Proses", className: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" },
  selesai: { label: "Selesai", className: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" },
};

export const mockTindakLanjut: TindakLanjut[] = [
  {
    id: "tl1",
    laporanId: "1",
    laporanJudul: "Potensi bentrokan warga desa dengan PT. ARC - Desa Mayang",
    laporanKategori: "Kewaspadaan Dini",
    tingkatRisiko: "Tinggi",
    jenisKeputusan: "rapat_koordinasi",
    deskripsiKeputusan: "Rapat koordinasi terbatas Tim Terpadu PKS Kabupaten Belitung Timur untuk membahas langkah penanganan konflik lahan di Desa Mayang.",
    penanggungJawab: "Sekda Kab. Belitung Timur",
    tanggalKeputusan: "2026-01-03T10:00:00Z",
    targetSelesai: "2026-01-10",
    status: "selesai",
    catatanPelaksanaan: "Rakor telah dilaksanakan pada 5 Januari 2026. Hasil: disepakati mediasi antara warga dan PT. ARC dengan difasilitasi BPN.",
    createdBy: "Bupati Belitung Timur",
    createdAt: "2026-01-03T10:00:00Z",
  },
  {
    id: "tl2",
    laporanId: "4",
    laporanJudul: "Konflik Nelayan Lokal vs Kapal Asing - Tanjung Batu Itam",
    laporanKategori: "Potensi Konflik",
    tingkatRisiko: "Sangat Tinggi",
    jenisKeputusan: "pengerahan_personil",
    deskripsiKeputusan: "Operasi gabungan TNI AL dan Polairud untuk pengamanan perairan dan penindakan kapal asing ilegal.",
    penanggungJawab: "Dandim 0414 Belitung",
    tanggalKeputusan: "2026-01-22T08:00:00Z",
    targetSelesai: "2026-01-30",
    status: "dalam_proses",
    catatanPelaksanaan: "Operasi dimulai 23 Januari 2026. 2 kapal asing berhasil diamankan.",
    createdBy: "Bupati Belitung Timur",
    createdAt: "2026-01-22T08:00:00Z",
  },
  {
    id: "tl3",
    laporanId: "4",
    laporanJudul: "Konflik Nelayan Lokal vs Kapal Asing - Tanjung Batu Itam",
    laporanKategori: "Potensi Konflik",
    tingkatRisiko: "Sangat Tinggi",
    jenisKeputusan: "mediasi",
    deskripsiKeputusan: "Mediasi dengan perwakilan nelayan lokal untuk menenangkan situasi dan menyampaikan langkah pemerintah.",
    penanggungJawab: "Kepala Dinas Kelautan dan Perikanan",
    tanggalKeputusan: "2026-01-22T10:00:00Z",
    targetSelesai: "2026-01-25",
    status: "selesai",
    catatanPelaksanaan: "Mediasi berhasil. Nelayan sepakat membuka blokade pelabuhan setelah pemerintah menjamin operasi penindakan.",
    createdBy: "Bupati Belitung Timur",
    createdAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "tl4",
    laporanId: "2",
    laporanJudul: "Konflik Antar Kelompok Pemuda - Kurnia Jaya",
    laporanKategori: "Potensi Konflik",
    tingkatRisiko: "Sedang",
    jenisKeputusan: "mediasi",
    deskripsiKeputusan: "Koordinasi dengan tokoh agama dan pemuda setempat untuk mediasi dan pencegahan tawuran.",
    penanggungJawab: "Kapolsek Manggar",
    tanggalKeputusan: "2026-01-12T09:00:00Z",
    targetSelesai: "2026-01-20",
    status: "selesai",
    catatanPelaksanaan: "Mediasi berhasil dilakukan. Kedua kelompok sepakat berdamai.",
    createdBy: "Kapolres Belitung Timur",
    createdAt: "2026-01-12T09:00:00Z",
  },
  {
    id: "tl5",
    laporanId: "1",
    laporanJudul: "Perselisihan Aktivis Lingkungan dan Penambang - Desa Mayang",
    laporanKategori: "Potensi Konflik",
    tingkatRisiko: "Tinggi",
    jenisKeputusan: "tindakan_hukum",
    deskripsiKeputusan: "Penindakan hukum terhadap aktivitas penambangan ilegal yang mencemari sumber air bersih warga.",
    penanggungJawab: "Kapolres Belitung Timur",
    tanggalKeputusan: "2026-01-05T14:00:00Z",
    targetSelesai: "2026-02-05",
    status: "dalam_proses",
    createdBy: "Bupati Belitung Timur",
    createdAt: "2026-01-05T14:00:00Z",
  },
];

export default function TindakLanjutList() {
  const navigate = useNavigate();
  const [data] = useState(mockTindakLanjut);
  const [filterStatus, setFilterStatus] = useState<StatusTindakLanjut | "">("");
  const [filterJenis, setFilterJenis] = useState<JenisKeputusan | "">("");

  const filtered = data.filter((tl) => {
    if (filterStatus && tl.status !== filterStatus) return false;
    if (filterJenis && tl.jenisKeputusan !== filterJenis) return false;
    return true;
  });

  const risikoColor: Record<string, string> = {
    Rendah: "text-success-600 bg-success-50 dark:bg-success-900/20",
    Sedang: "text-warning-600 bg-warning-50 dark:bg-warning-900/20",
    Tinggi: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    "Sangat Tinggi": "text-error-600 bg-error-50 dark:bg-error-900/20",
  };

  return (
    <>
      <PageMeta title="Tindak Lanjut & Keputusan" description="Pengambilan Keputusan dan Tindak Lanjut" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Tindak Lanjut & Pengambilan Keputusan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Keputusan intervensi oleh pimpinan (Rapat Forkopimda, Pengerahan Personil, Tindakan Hukum)
            </p>
          </div>
          <Button size="sm" onClick={() => navigate("/tindak-lanjut/create")} className="gap-1.5">
            + Tambah Keputusan
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusTindakLanjut | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="menunggu_keputusan">Menunggu Keputusan</option>
            <option value="dalam_proses">Dalam Proses</option>
            <option value="selesai">Selesai</option>
          </select>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value as JenisKeputusan | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Jenis Keputusan</option>
            {Object.entries(jenisKeputusanLabel).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Tidak ada data tindak lanjut.</div>
          ) : (
            filtered.map((tl) => {
              const sLabel = statusLabel[tl.status];
              return (
                <div
                  key={tl.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {jenisKeputusanLabel[tl.jenisKeputusan]}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Laporan: {tl.laporanJudul}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[tl.tingkatRisiko]}`}>
                        {tl.tingkatRisiko}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sLabel.className}`}>
                        {sLabel.label}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tl.deskripsiKeputusan}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Penanggung Jawab: <strong className="text-gray-700 dark:text-gray-300">{tl.penanggungJawab}</strong></span>
                    <span>Target: <strong className="text-gray-700 dark:text-gray-300">{new Date(tl.targetSelesai).toLocaleDateString("id-ID")}</strong></span>
                    <span>Diputuskan oleh: {tl.createdBy}</span>
                  </div>

                  {/* Catatan Pelaksanaan */}
                  {tl.catatanPelaksanaan && (
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Catatan Pelaksanaan:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{tl.catatanPelaksanaan}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
