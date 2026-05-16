import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { PotensiKonflik, LevelRisikoLabel } from "../../types/potensi-konflik";
import { mockPotensiKonflik, aspekOptions, levelOptions, kalkulasiTingkatRisiko } from "./mockData";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

const risikoColor: Record<string, string> = {
  Rendah: "text-success-600 bg-success-50 dark:bg-success-900/20",
  Sedang: "text-warning-600 bg-warning-50 dark:bg-warning-900/20",
  Tinggi: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  "Sangat Tinggi": "text-error-600 bg-error-50 dark:bg-error-900/20",
};

const emptyForm = {
  periode: "",
  aspek: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  alamatDetail: "",
  titikKoordinat: "",
  sumberInformasi: "",
  namaPotensiKonflik: "",
  kemungkinanLevel: "",
  kemungkinanDeskripsi: "",
  sumberSebabPermasalahan: "",
  latarBelakangMasalah: "",
  dampakLevel: "",
  dampakDeskripsi: "",
  upayaPenanganan: "",
  keteranganDetail: "",
  rekomendasi: "",
};

export default function PotensiKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tingkatRisiko = form.kemungkinanLevel && form.dampakLevel
    ? kalkulasiTingkatRisiko(form.kemungkinanLevel, form.dampakLevel)
    : "-";

  useEffect(() => {
    if (isEdit && id) {
      const found = mockPotensiKonflik.find((d) => d.id === id);
      if (found) {
        setForm({
          periode: found.periode,
          aspek: found.aspek,
          kabupaten: found.kabupaten,
          kecamatan: found.kecamatan,
          desa: found.desa,
          alamatDetail: found.alamatDetail,
          titikKoordinat: found.titikKoordinat,
          sumberInformasi: found.sumberInformasi,
          namaPotensiKonflik: found.namaPotensiKonflik,
          kemungkinanLevel: found.kemungkinanPotensiKonflik.level,
          kemungkinanDeskripsi: found.kemungkinanPotensiKonflik.deskripsi,
          sumberSebabPermasalahan: found.sumberSebabPermasalahan,
          latarBelakangMasalah: found.latarBelakangMasalah,
          dampakLevel: found.dampakPotensiKonflik.level,
          dampakDeskripsi: found.dampakPotensiKonflik.deskripsi,
          upayaPenanganan: found.upayaPenanganan,
          keteranganDetail: found.keteranganDetail,
          rekomendasi: found.rekomendasi,
        });
      } else {
        alert("Data tidak ditemukan");
        navigate("/potensi-konflik");
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
    if (!form.aspek) e.aspek = "Aspek wajib dipilih";
    if (!form.kabupaten) e.kabupaten = "Kabupaten wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Kecamatan wajib diisi";
    if (!form.desa) e.desa = "Desa wajib diisi";
    if (!form.namaPotensiKonflik) e.namaPotensiKonflik = "Nama potensi konflik wajib diisi";
    if (!form.kemungkinanLevel) e.kemungkinanLevel = "Level kemungkinan wajib dipilih";
    if (!form.dampakLevel) e.dampakLevel = "Level dampak wajib dipilih";
    if (!form.rekomendasi.trim()) e.rekomendasi = "Rekomendasi/saran tindak lanjut wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;

    const risiko = kalkulasiTingkatRisiko(form.kemungkinanLevel, form.dampakLevel) as LevelRisikoLabel;

    if (isEdit && id) {
      const idx = mockPotensiKonflik.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockPotensiKonflik[idx] = {
          ...mockPotensiKonflik[idx],
          ...mapFormToData(form, risiko),
          status: submitStatus,
        };
      }
    } else {
      const newItem: PotensiKonflik = {
        id: String(Date.now()),
        ...mapFormToData(form, risiko),
        status: submitStatus,
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };
      mockPotensiKonflik.unshift(newItem);
    }

    navigate("/potensi-konflik");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Potensi Konflik" : "Tambah Potensi Konflik"}
        description="Form Potensi Konflik"
      />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit" : "Tambah"} Form Potensi Konflik
          </h2>
          <button
            onClick={() => navigate("/potensi-konflik")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <CloseIcon /> Batal
          </button>
        </div>

        {/* Section: Informasi Umum */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Informasi Umum
          </h3>
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
              <Label htmlFor="aspek">Aspek <span className="text-error-500">*</span></Label>
              <select
                id="aspek"
                value={form.aspek}
                onChange={(e) => set("aspek", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Aspek --</option>
                {aspekOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.aspek && <p className="mt-1 text-xs text-error-500">{errors.aspek}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="namaPotensiKonflik">Nama Potensi Konflik <span className="text-error-500">*</span></Label>
            <Input
              id="namaPotensiKonflik"
              placeholder="Masukkan nama/judul potensi konflik"
              value={form.namaPotensiKonflik}
              onChange={(e) => set("namaPotensiKonflik", e.target.value)}
            />
            {errors.namaPotensiKonflik && <p className="mt-1 text-xs text-error-500">{errors.namaPotensiKonflik}</p>}
          </div>
        </div>

        {/* Section: Wilayah / Lokasi */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Wilayah / Lokasi
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
              placeholder="Alamat lengkap"
              value={form.alamatDetail}
              onChange={(e) => set("alamatDetail", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titikKoordinat">Titik Koordinat</Label>
              <Input
                id="titikKoordinat"
                placeholder="Contoh: -2.8833, 108.2667"
                value={form.titikKoordinat}
                onChange={(e) => set("titikKoordinat", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sumberInformasi">Sumber Informasi</Label>
              <Input
                id="sumberInformasi"
                placeholder="Contoh: Intel POLRES"
                value={form.sumberInformasi}
                onChange={(e) => set("sumberInformasi", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="buktiFoto">Bukti Dukung (Foto)</Label>
            <input
              id="buktiFoto"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/20 dark:file:text-brand-400"
            />
          </div>
        </div>

        {/* Section: Analisis Konflik */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Analisis Konflik
          </h3>

          {/* Kemungkinan Potensi Konflik */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Kemungkinan Potensi Konflik
            </p>
            <div>
              <Label htmlFor="kemungkinanLevel">Level <span className="text-error-500">*</span></Label>
              <select
                id="kemungkinanLevel"
                value={form.kemungkinanLevel}
                onChange={(e) => set("kemungkinanLevel", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Level --</option>
                {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.kemungkinanLevel && <p className="mt-1 text-xs text-error-500">{errors.kemungkinanLevel}</p>}
            </div>
            <div>
              <Label htmlFor="kemungkinanDeskripsi">Deskripsi</Label>
              <textarea
                id="kemungkinanDeskripsi"
                rows={3}
                placeholder="Deskripsi kemungkinan potensi konflik..."
                value={form.kemungkinanDeskripsi}
                onChange={(e) => set("kemungkinanDeskripsi", e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sumberSebabPermasalahan">Sumber/Sebab Permasalahan</Label>
            <textarea
              id="sumberSebabPermasalahan"
              rows={3}
              placeholder="Uraikan sumber atau sebab permasalahan..."
              value={form.sumberSebabPermasalahan}
              onChange={(e) => set("sumberSebabPermasalahan", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="latarBelakangMasalah">Latar Belakang Masalah</Label>
            <textarea
              id="latarBelakangMasalah"
              rows={3}
              placeholder="Uraikan latar belakang masalah..."
              value={form.latarBelakangMasalah}
              onChange={(e) => set("latarBelakangMasalah", e.target.value)}
              className={fieldClass}
            />
          </div>

          {/* Dampak Potensi Konflik */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Dampak Potensi Konflik
            </p>
            <div>
              <Label htmlFor="dampakLevel">Level <span className="text-error-500">*</span></Label>
              <select
                id="dampakLevel"
                value={form.dampakLevel}
                onChange={(e) => set("dampakLevel", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Level --</option>
                {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.dampakLevel && <p className="mt-1 text-xs text-error-500">{errors.dampakLevel}</p>}
            </div>
            <div>
              <Label htmlFor="dampakDeskripsi">Deskripsi</Label>
              <textarea
                id="dampakDeskripsi"
                rows={3}
                placeholder="Deskripsi dampak potensi konflik..."
                value={form.dampakDeskripsi}
                onChange={(e) => set("dampakDeskripsi", e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="upayaPenanganan">Upaya Penanganan</Label>
            <textarea
              id="upayaPenanganan"
              rows={3}
              placeholder="Uraikan upaya penanganan yang telah/akan dilakukan..."
              value={form.upayaPenanganan}
              onChange={(e) => set("upayaPenanganan", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="keteranganDetail">Keterangan Detail</Label>
            <textarea
              id="keteranganDetail"
              rows={3}
              placeholder="Keterangan detail tambahan..."
              value={form.keteranganDetail}
              onChange={(e) => set("keteranganDetail", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="rekomendasi">Rekomendasi / Saran Tindak Lanjut <span className="text-error-500">*</span></Label>
            <textarea
              id="rekomendasi"
              rows={3}
              placeholder="Rekomendasi tindak lanjut..."
              value={form.rekomendasi}
              onChange={(e) => set("rekomendasi", e.target.value)}
              className={fieldClass}
            />
            {errors.rekomendasi && <p className="mt-1 text-xs text-error-500">{errors.rekomendasi}</p>}
          </div>

          {/* Tingkat Risiko (kalkulasi otomatis) */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tingkat Risiko (kalkulasi otomatis):</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                tingkatRisiko !== "-" ? risikoColor[tingkatRisiko] : "text-gray-400 bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {tingkatRisiko}
            </span>
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
            onClick={() => navigate("/potensi-konflik")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}

function mapFormToData(form: typeof emptyForm, risiko: LevelRisikoLabel): Omit<PotensiKonflik, "id" | "status" | "createdBy" | "createdAt"> {
  return {
    periode: form.periode,
    aspek: form.aspek,
    kabupaten: form.kabupaten,
    kecamatan: form.kecamatan,
    desa: form.desa,
    alamatDetail: form.alamatDetail,
    titikKoordinat: form.titikKoordinat,
    sumberInformasi: form.sumberInformasi,
    namaPotensiKonflik: form.namaPotensiKonflik,
    kemungkinanPotensiKonflik: {
      level: form.kemungkinanLevel as LevelRisikoLabel,
      deskripsi: form.kemungkinanDeskripsi,
    },
    sumberSebabPermasalahan: form.sumberSebabPermasalahan,
    latarBelakangMasalah: form.latarBelakangMasalah,
    dampakPotensiKonflik: {
      level: form.dampakLevel as LevelRisikoLabel,
      deskripsi: form.dampakDeskripsi,
    },
    upayaPenanganan: form.upayaPenanganan,
    keteranganDetail: form.keteranganDetail,
    rekomendasi: form.rekomendasi,
    tingkatRisiko: risiko,
  };
}
