import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { mockTindakLanjut, type TindakLanjut, type JenisKeputusan, type StatusTindakLanjut } from "./TindakLanjutList";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

const jenisKeputusanOptions: { value: JenisKeputusan; label: string }[] = [
  { value: "rapat_koordinasi", label: "Rapat Koordinasi Forkopimda" },
  { value: "pengerahan_personil", label: "Pengerahan Personil" },
  { value: "tindakan_hukum", label: "Tindakan Hukum" },
  { value: "mediasi", label: "Mediasi / Negosiasi" },
  { value: "lainnya", label: "Lainnya" },
];

// Mock laporan yang bisa dipilih (yang sudah disetujui/terverifikasi)
const laporanOptions = [
  { id: "kd-1", judul: "Potensi bentrokan warga desa dengan PT. ARC - Desa Mayang", kategori: "Kewaspadaan Dini", risiko: "Tinggi" },
  { id: "pk-1", judul: "Perselisihan Aktivis Lingkungan dan Penambang", kategori: "Potensi Konflik", risiko: "Tinggi" },
  { id: "pk-2", judul: "Konflik Antar Kelompok Pemuda - Kurnia Jaya", kategori: "Potensi Konflik", risiko: "Sedang" },
  { id: "pk-4", judul: "Konflik Nelayan Lokal vs Kapal Asing", kategori: "Potensi Konflik", risiko: "Sangat Tinggi" },
];

export default function TindakLanjutForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    laporanId: "",
    jenisKeputusan: "",
    deskripsiKeputusan: "",
    penanggungJawab: "",
    targetSelesai: "",
    catatanPelaksanaan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const selectedLaporan = laporanOptions.find((l) => l.id === form.laporanId);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.laporanId) e.laporanId = "Laporan wajib dipilih";
    if (!form.jenisKeputusan) e.jenisKeputusan = "Jenis keputusan wajib dipilih";
    if (!form.deskripsiKeputusan.trim()) e.deskripsiKeputusan = "Deskripsi keputusan wajib diisi";
    if (!form.penanggungJawab.trim()) e.penanggungJawab = "Penanggung jawab wajib diisi";
    if (!form.targetSelesai) e.targetSelesai = "Target selesai wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const laporan = laporanOptions.find((l) => l.id === form.laporanId)!;
    const newItem: TindakLanjut = {
      id: String(Date.now()),
      laporanId: form.laporanId,
      laporanJudul: laporan.judul,
      laporanKategori: laporan.kategori,
      tingkatRisiko: laporan.risiko,
      jenisKeputusan: form.jenisKeputusan as JenisKeputusan,
      deskripsiKeputusan: form.deskripsiKeputusan,
      penanggungJawab: form.penanggungJawab,
      tanggalKeputusan: new Date().toISOString(),
      targetSelesai: form.targetSelesai,
      status: "dalam_proses" as StatusTindakLanjut,
      catatanPelaksanaan: form.catatanPelaksanaan || undefined,
      createdBy: "Admin User",
      createdAt: new Date().toISOString(),
    };

    mockTindakLanjut.unshift(newItem);
    navigate("/tindak-lanjut");
  };

  return (
    <>
      <PageMeta title="Tambah Keputusan Tindak Lanjut" description="Form Pengambilan Keputusan" />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Tambah Keputusan Tindak Lanjut
          </h2>
          <button
            onClick={() => navigate("/tindak-lanjut")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <CloseIcon /> Batal
          </button>
        </div>

        {/* Pilih Laporan */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Laporan yang Ditindaklanjuti
          </h3>
          <div>
            <Label>Pilih Laporan <span className="text-error-500">*</span></Label>
            <select
              value={form.laporanId}
              onChange={(e) => set("laporanId", e.target.value)}
              className={fieldClass}
            >
              <option value="">-- Pilih Laporan --</option>
              {laporanOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  [{l.risiko}] {l.judul}
                </option>
              ))}
            </select>
            {errors.laporanId && <p className="mt-1 text-xs text-error-500">{errors.laporanId}</p>}
          </div>
          {selectedLaporan && (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Kategori: <strong>{selectedLaporan.kategori}</strong></p>
              <p className="text-gray-600 dark:text-gray-400">Tingkat Risiko: <strong>{selectedLaporan.risiko}</strong></p>
            </div>
          )}
        </div>

        {/* Keputusan */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Detail Keputusan
          </h3>
          <div>
            <Label>Jenis Keputusan <span className="text-error-500">*</span></Label>
            <select
              value={form.jenisKeputusan}
              onChange={(e) => set("jenisKeputusan", e.target.value)}
              className={fieldClass}
            >
              <option value="">-- Pilih Jenis Keputusan --</option>
              {jenisKeputusanOptions.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
            {errors.jenisKeputusan && <p className="mt-1 text-xs text-error-500">{errors.jenisKeputusan}</p>}
          </div>
          <div>
            <Label>Deskripsi Keputusan <span className="text-error-500">*</span></Label>
            <textarea
              rows={4}
              placeholder="Jelaskan keputusan yang diambil secara detail..."
              value={form.deskripsiKeputusan}
              onChange={(e) => set("deskripsiKeputusan", e.target.value)}
              className={fieldClass + " resize-none"}
            />
            {errors.deskripsiKeputusan && <p className="mt-1 text-xs text-error-500">{errors.deskripsiKeputusan}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Penanggung Jawab <span className="text-error-500">*</span></Label>
              <Input
                placeholder="Nama/jabatan penanggung jawab"
                value={form.penanggungJawab}
                onChange={(e) => set("penanggungJawab", e.target.value)}
              />
              {errors.penanggungJawab && <p className="mt-1 text-xs text-error-500">{errors.penanggungJawab}</p>}
            </div>
            <div>
              <Label>Target Selesai <span className="text-error-500">*</span></Label>
              <Input
                type="date"
                value={form.targetSelesai}
                onChange={(e) => set("targetSelesai", e.target.value)}
              />
              {errors.targetSelesai && <p className="mt-1 text-xs text-error-500">{errors.targetSelesai}</p>}
            </div>
          </div>
          <div>
            <Label>Catatan Pelaksanaan (opsional)</Label>
            <textarea
              rows={3}
              placeholder="Catatan awal pelaksanaan..."
              value={form.catatanPelaksanaan}
              onChange={(e) => set("catatanPelaksanaan", e.target.value)}
              className={fieldClass + " resize-none"}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" onClick={handleSubmit} className="gap-1.5">
            <SaveIcon /> Simpan Keputusan
          </Button>
          <button
            onClick={() => navigate("/tindak-lanjut")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}
