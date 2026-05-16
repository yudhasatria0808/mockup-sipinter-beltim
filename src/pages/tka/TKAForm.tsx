import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { TKA, JenisKelamin, JenisIzinTinggal } from "../../types/tka";
import { mockTKA, kewarganegaraanOptions, jenisIzinTinggalOptions } from "./mockData";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

const emptyForm = {
  periode: "",
  namaTKA: "",
  jenisKelamin: "",
  namaPerusahaan: "",
  jabatanKeterampilan: "",
  noTelepon: "",
  kewarganegaraan: "",
  noPaspor: "",
  nomorIMTA: "",
  tanggalMulaiIMTA: "",
  tanggalBerakhirIMTA: "",
  jenisIzinTinggal: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  alamatDetail: "",
  titikKoordinat: "",
  keterangan: "",
  sumberInformasi: "",
  saranTindakLanjut: "",
};

export default function TKAForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockTKA.find((d) => d.id === id);
      if (found) {
        setForm({
          periode: found.periode,
          namaTKA: found.namaTKA,
          jenisKelamin: found.jenisKelamin,
          namaPerusahaan: found.namaPerusahaan,
          jabatanKeterampilan: found.jabatanKeterampilan,
          noTelepon: found.noTelepon,
          kewarganegaraan: found.kewarganegaraan,
          noPaspor: found.noPaspor,
          nomorIMTA: found.nomorIMTA,
          tanggalMulaiIMTA: found.tanggalMulaiIMTA,
          tanggalBerakhirIMTA: found.tanggalBerakhirIMTA,
          jenisIzinTinggal: found.jenisIzinTinggal,
          kabupaten: found.kabupaten,
          kecamatan: found.kecamatan,
          desa: found.desa,
          alamatDetail: found.alamatDetail,
          titikKoordinat: found.titikKoordinat,
          keterangan: found.keterangan ?? "",
          sumberInformasi: found.sumberInformasi,
          saranTindakLanjut: found.saranTindakLanjut ?? "",
        });
      } else {
        alert("Data tidak ditemukan");
        navigate("/tka");
      }
    }
  }, [id, isEdit, navigate]);

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.periode) e.periode = "Periode wajib diisi";
    if (!form.namaTKA) e.namaTKA = "Nama TKA wajib diisi";
    if (!form.jenisKelamin) e.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!form.namaPerusahaan) e.namaPerusahaan = "Nama perusahaan wajib diisi";
    if (!form.jabatanKeterampilan) e.jabatanKeterampilan = "Jabatan/keterampilan wajib diisi";
    if (!form.kewarganegaraan) e.kewarganegaraan = "Kewarganegaraan wajib dipilih";
    if (!form.noPaspor) e.noPaspor = "No. paspor wajib diisi";
    if (!form.nomorIMTA) e.nomorIMTA = "Nomor IMTA/RPTKA wajib diisi";
    if (!form.tanggalMulaiIMTA) e.tanggalMulaiIMTA = "Tanggal mulai wajib diisi";
    if (!form.tanggalBerakhirIMTA) e.tanggalBerakhirIMTA = "Tanggal berakhir wajib diisi";
    if (!form.jenisIzinTinggal) e.jenisIzinTinggal = "Jenis izin tinggal wajib dipilih";
    if (!form.kabupaten) e.kabupaten = "Kabupaten wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Kecamatan wajib diisi";
    if (!form.desa) e.desa = "Desa wajib diisi";
    if (!form.saranTindakLanjut.trim()) e.saranTindakLanjut = "Saran tindak lanjut wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;

    const mapped = mapFormToData(form);

    if (isEdit && id) {
      const idx = mockTKA.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockTKA[idx] = { ...mockTKA[idx], ...mapped, status: submitStatus };
      }
    } else {
      const newItem: TKA = {
        id: String(Date.now()),
        ...mapped,
        status: submitStatus,
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };
      mockTKA.unshift(newItem);
    }

    navigate("/tka");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Data TKA" : "Tambah Data TKA"}
        description="Form Tenaga Kerja Asing"
      />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit" : "Tambah"} Data Tenaga Kerja Asing
          </h2>
          <button
            onClick={() => navigate("/tka")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <CloseIcon /> Batal
          </button>
        </div>

        {/* Section: Periode & Identitas TKA */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Identitas Tenaga Kerja Asing
          </h3>

          {/* Periode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periode">Periode <span className="text-error-500">*</span></Label>
              <Input
                id="periode"
                type="date"
                value={form.periode}
                onChange={(e) => set("periode", e.target.value)}
              />
              {errors.periode && <p className="mt-1 text-xs text-error-500">{errors.periode}</p>}
            </div>
            <div>
              <Label htmlFor="jenisKelamin">Jenis Kelamin <span className="text-error-500">*</span></Label>
              <select
                id="jenisKelamin"
                value={form.jenisKelamin}
                onChange={(e) => set("jenisKelamin", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin && <p className="mt-1 text-xs text-error-500">{errors.jenisKelamin}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="namaTKA">Nama Tenaga Kerja Asing (TKA) <span className="text-error-500">*</span></Label>
            <Input
              id="namaTKA"
              placeholder="Nama lengkap TKA"
              value={form.namaTKA}
              onChange={(e) => set("namaTKA", e.target.value)}
            />
            {errors.namaTKA && <p className="mt-1 text-xs text-error-500">{errors.namaTKA}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="namaPerusahaan">Nama Perusahaan <span className="text-error-500">*</span></Label>
              <Input
                id="namaPerusahaan"
                placeholder="Nama perusahaan pemberi kerja"
                value={form.namaPerusahaan}
                onChange={(e) => set("namaPerusahaan", e.target.value)}
              />
              {errors.namaPerusahaan && <p className="mt-1 text-xs text-error-500">{errors.namaPerusahaan}</p>}
            </div>
            <div>
              <Label htmlFor="jabatanKeterampilan">Jabatan / Keterampilan yang Dipersyaratkan <span className="text-error-500">*</span></Label>
              <Input
                id="jabatanKeterampilan"
                placeholder="Contoh: Direktur, Ahli Geologi"
                value={form.jabatanKeterampilan}
                onChange={(e) => set("jabatanKeterampilan", e.target.value)}
              />
              {errors.jabatanKeterampilan && <p className="mt-1 text-xs text-error-500">{errors.jabatanKeterampilan}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="noTelepon">No. Telepon / Komunikasi</Label>
              <Input
                id="noTelepon"
                placeholder="Contoh: 021-30027133"
                value={form.noTelepon}
                onChange={(e) => set("noTelepon", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kewarganegaraan">Kewarganegaraan <span className="text-error-500">*</span></Label>
              <select
                id="kewarganegaraan"
                value={form.kewarganegaraan}
                onChange={(e) => set("kewarganegaraan", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Kewarganegaraan --</option>
                {kewarganegaraanOptions.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              {errors.kewarganegaraan && <p className="mt-1 text-xs text-error-500">{errors.kewarganegaraan}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="noPaspor">No. Paspor <span className="text-error-500">*</span></Label>
            <Input
              id="noPaspor"
              placeholder="Contoh: A1234567"
              value={form.noPaspor}
              onChange={(e) => set("noPaspor", e.target.value)}
            />
            {errors.noPaspor && <p className="mt-1 text-xs text-error-500">{errors.noPaspor}</p>}
          </div>
        </div>

        {/* Section: IMTA / RPTKA */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Nomor IMTA / RPTKA &amp; Masa Berlaku
          </h3>

          <div>
            <Label htmlFor="nomorIMTA">Nomor IMTA / RPTKA <span className="text-error-500">*</span></Label>
            <Input
              id="nomorIMTA"
              placeholder="Contoh: IMTA001 / RPTKA-2025-001"
              value={form.nomorIMTA}
              onChange={(e) => set("nomorIMTA", e.target.value)}
            />
            {errors.nomorIMTA && <p className="mt-1 text-xs text-error-500">{errors.nomorIMTA}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tanggalMulaiIMTA">Tanggal Mulai <span className="text-error-500">*</span></Label>
              <Input
                id="tanggalMulaiIMTA"
                type="date"
                value={form.tanggalMulaiIMTA}
                onChange={(e) => set("tanggalMulaiIMTA", e.target.value)}
              />
              {errors.tanggalMulaiIMTA && <p className="mt-1 text-xs text-error-500">{errors.tanggalMulaiIMTA}</p>}
            </div>
            <div>
              <Label htmlFor="tanggalBerakhirIMTA">Tanggal Berakhir <span className="text-error-500">*</span></Label>
              <Input
                id="tanggalBerakhirIMTA"
                type="date"
                value={form.tanggalBerakhirIMTA}
                onChange={(e) => set("tanggalBerakhirIMTA", e.target.value)}
              />
              {errors.tanggalBerakhirIMTA && <p className="mt-1 text-xs text-error-500">{errors.tanggalBerakhirIMTA}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="jenisIzinTinggal">Jenis Izin Tinggal (Visa, KITAS, KITAP) <span className="text-error-500">*</span></Label>
            <select
              id="jenisIzinTinggal"
              value={form.jenisIzinTinggal}
              onChange={(e) => set("jenisIzinTinggal", e.target.value)}
              className={fieldClass}
            >
              <option value="">-- Pilih Jenis Izin Tinggal --</option>
              {jenisIzinTinggalOptions.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.jenisIzinTinggal && <p className="mt-1 text-xs text-error-500">{errors.jenisIzinTinggal}</p>}
          </div>
        </div>

        {/* Section: Lokasi Kerja */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Lokasi Kerja
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="kabupaten">Kabupaten <span className="text-error-500">*</span></Label>
              <Input
                id="kabupaten"
                placeholder="Kabupaten"
                value={form.kabupaten}
                onChange={(e) => set("kabupaten", e.target.value)}
              />
              {errors.kabupaten && <p className="mt-1 text-xs text-error-500">{errors.kabupaten}</p>}
            </div>
            <div>
              <Label htmlFor="kecamatan">Kecamatan <span className="text-error-500">*</span></Label>
              <Input
                id="kecamatan"
                placeholder="Kecamatan"
                value={form.kecamatan}
                onChange={(e) => set("kecamatan", e.target.value)}
              />
              {errors.kecamatan && <p className="mt-1 text-xs text-error-500">{errors.kecamatan}</p>}
            </div>
            <div>
              <Label htmlFor="desa">Desa <span className="text-error-500">*</span></Label>
              <Input
                id="desa"
                placeholder="Desa"
                value={form.desa}
                onChange={(e) => set("desa", e.target.value)}
              />
              {errors.desa && <p className="mt-1 text-xs text-error-500">{errors.desa}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="alamatDetail">Alamat Detail</Label>
            <Input
              id="alamatDetail"
              placeholder="Alamat lengkap lokasi kerja"
              value={form.alamatDetail}
              onChange={(e) => set("alamatDetail", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="titikKoordinat">Titik Koordinat</Label>
            <Input
              id="titikKoordinat"
              placeholder="Contoh: -2.8833, 108.2667"
              value={form.titikKoordinat}
              onChange={(e) => set("titikKoordinat", e.target.value)}
            />
          </div>
        </div>

        {/* Section: Keterangan & Sumber */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Keterangan &amp; Sumber Informasi
          </h3>

          <div>
            <Label htmlFor="keterangan">Keterangan</Label>
            <textarea
              id="keterangan"
              rows={3}
              placeholder="Keterangan tambahan..."
              value={form.keterangan}
              onChange={(e) => set("keterangan", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="sumberInformasi">Sumber Informasi</Label>
            <Input
              id="sumberInformasi"
              placeholder="Contoh: Intel POLRES, Dinas Tenaga Kerja"
              value={form.sumberInformasi}
              onChange={(e) => set("sumberInformasi", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="saranTindakLanjut">Saran Tindak Lanjut <span className="text-error-500">*</span></Label>
            <textarea
              id="saranTindakLanjut"
              rows={3}
              placeholder="Saran tindak lanjut awal yang direkomendasikan operator..."
              value={form.saranTindakLanjut}
              onChange={(e) => set("saranTindakLanjut", e.target.value)}
              className={fieldClass}
            />
            {errors.saranTindakLanjut && <p className="mt-1 text-xs text-error-500">{errors.saranTindakLanjut}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => handleSave("draft")} className="gap-1.5">
            Simpan Draft
          </Button>
          <Button size="sm" onClick={() => handleSave("menunggu")} className="gap-1.5">
            <SaveIcon /> Kirim untuk Approval
          </Button>
          <button
            onClick={() => navigate("/tka")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}

function mapFormToData(form: typeof emptyForm): Omit<TKA, "id" | "status" | "createdBy" | "createdAt"> {
  return {
    periode: form.periode,
    namaTKA: form.namaTKA,
    jenisKelamin: form.jenisKelamin as JenisKelamin,
    namaPerusahaan: form.namaPerusahaan,
    jabatanKeterampilan: form.jabatanKeterampilan,
    noTelepon: form.noTelepon,
    kewarganegaraan: form.kewarganegaraan,
    noPaspor: form.noPaspor,
    nomorIMTA: form.nomorIMTA,
    tanggalMulaiIMTA: form.tanggalMulaiIMTA,
    tanggalBerakhirIMTA: form.tanggalBerakhirIMTA,
    jenisIzinTinggal: form.jenisIzinTinggal as JenisIzinTinggal,
    kabupaten: form.kabupaten,
    kecamatan: form.kecamatan,
    desa: form.desa,
    alamatDetail: form.alamatDetail,
    titikKoordinat: form.titikKoordinat,
    keterangan: form.keterangan,
    sumberInformasi: form.sumberInformasi,
  };
}
