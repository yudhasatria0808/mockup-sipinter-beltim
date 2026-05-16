import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { PeristiwaKonflik, LevelRisikoLabel } from "../../types/peristiwa-konflik";
import { mockPeristiwaKonflik, levelOptions } from "./mockData";

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
  namaPeristiwa: "",
  sumberSebabKonflik: "",
  latarBelakangKejadian: "",
  deskripsiAkibatPeristiwa: "",
  korbanKritis: "",
  korbanLukaLuka: "",
  korbanMengungsi: "",
  kerugianMateril: "",
  upayaPenanganan: "",
  upayaPemulihan: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  alamatDetail: "",
  titikKoordinat: "",
  sumberInformasi: "",
  keterangan: "",
  tingkatRisiko: "",
  saranTindakLanjut: "",
};

export default function PeristiwaKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockPeristiwaKonflik.find((d) => d.id === id);
      if (found) {
        setForm({
          periode: found.periode,
          namaPeristiwa: found.namaPeristiwa,
          sumberSebabKonflik: found.sumberSebabKonflik,
          latarBelakangKejadian: found.latarBelakangKejadian,
          deskripsiAkibatPeristiwa: found.deskripsiAkibatPeristiwa,
          korbanKritis: String(found.korbanKritis),
          korbanLukaLuka: String(found.korbanLukaLuka),
          korbanMengungsi: String(found.korbanMengungsi),
          kerugianMateril: String(found.kerugianMateril),
          upayaPenanganan: found.upayaPenanganan,
          upayaPemulihan: found.upayaPemulihan,
          kabupaten: found.kabupaten,
          kecamatan: found.kecamatan,
          desa: found.desa,
          alamatDetail: found.alamatDetail,
          titikKoordinat: found.titikKoordinat,
          sumberInformasi: found.sumberInformasi,
          keterangan: found.keterangan ?? "",
          tingkatRisiko: found.tingkatRisiko,
          saranTindakLanjut: found.saranTindakLanjut ?? "",
        });
      } else {
        alert("Data tidak ditemukan");
        navigate("/peristiwa-konflik");
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
    if (!form.namaPeristiwa) e.namaPeristiwa = "Nama peristiwa wajib diisi";
    if (!form.kabupaten) e.kabupaten = "Kabupaten wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Kecamatan wajib diisi";
    if (!form.desa) e.desa = "Desa wajib diisi";
    if (!form.tingkatRisiko) e.tingkatRisiko = "Tingkat risiko wajib dipilih";
    if (!form.saranTindakLanjut.trim()) e.saranTindakLanjut = "Saran tindak lanjut wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;

    const mapped = mapFormToData(form);

    if (isEdit && id) {
      const idx = mockPeristiwaKonflik.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockPeristiwaKonflik[idx] = {
          ...mockPeristiwaKonflik[idx],
          ...mapped,
          status: submitStatus,
        };
      }
    } else {
      const newItem: PeristiwaKonflik = {
        id: String(Date.now()),
        ...mapped,
        status: submitStatus,
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };
      mockPeristiwaKonflik.unshift(newItem);
    }

    navigate("/peristiwa-konflik");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Peristiwa Konflik" : "Tambah Peristiwa Konflik"}
        description="Form Peristiwa Konflik"
      />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit" : "Tambah"} Form Peristiwa Konflik
          </h2>
          <button
            onClick={() => navigate("/peristiwa-konflik")}
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
              <Label htmlFor="tingkatRisiko">Tingkat Risiko <span className="text-error-500">*</span></Label>
              <select
                id="tingkatRisiko"
                value={form.tingkatRisiko}
                onChange={(e) => set("tingkatRisiko", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Tingkat Risiko --</option>
                {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.tingkatRisiko && <p className="mt-1 text-xs text-error-500">{errors.tingkatRisiko}</p>}
              {form.tingkatRisiko && (
                <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[form.tingkatRisiko]}`}>
                  {form.tingkatRisiko}
                </span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="namaPeristiwa">Nama Peristiwa Kejadian <span className="text-error-500">*</span></Label>
            <Input
              id="namaPeristiwa"
              placeholder="Masukkan nama/judul peristiwa konflik"
              value={form.namaPeristiwa}
              onChange={(e) => set("namaPeristiwa", e.target.value)}
            />
            {errors.namaPeristiwa && <p className="mt-1 text-xs text-error-500">{errors.namaPeristiwa}</p>}
          </div>
          <div>
            <Label htmlFor="sumberSebabKonflik">Sumber/Sebab Konflik</Label>
            <textarea
              id="sumberSebabKonflik"
              rows={3}
              placeholder="Uraikan sumber atau sebab konflik..."
              value={form.sumberSebabKonflik}
              onChange={(e) => set("sumberSebabKonflik", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <Label htmlFor="latarBelakangKejadian">Latar Belakang Kejadian</Label>
            <textarea
              id="latarBelakangKejadian"
              rows={3}
              placeholder="Kronologis singkat peristiwa..."
              value={form.latarBelakangKejadian}
              onChange={(e) => set("latarBelakangKejadian", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <Label htmlFor="deskripsiAkibatPeristiwa">Deskripsi/Akibat Peristiwa</Label>
            <textarea
              id="deskripsiAkibatPeristiwa"
              rows={3}
              placeholder="Deskripsi akibat yang ditimbulkan peristiwa..."
              value={form.deskripsiAkibatPeristiwa}
              onChange={(e) => set("deskripsiAkibatPeristiwa", e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        {/* Section: Korban & Kerugian */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Korban &amp; Kerugian
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="korbanKritis">Korban Kritis (Org)</Label>
              <Input
                id="korbanKritis"
                type="number"
                min="0"
                placeholder="0"
                value={form.korbanKritis}
                onChange={(e) => set("korbanKritis", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="korbanLukaLuka">Korban Luka-luka (Org)</Label>
              <Input
                id="korbanLukaLuka"
                type="number"
                min="0"
                placeholder="0"
                value={form.korbanLukaLuka}
                onChange={(e) => set("korbanLukaLuka", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="korbanMengungsi">Korban Mengungsi (Org)</Label>
              <Input
                id="korbanMengungsi"
                type="number"
                min="0"
                placeholder="0"
                value={form.korbanMengungsi}
                onChange={(e) => set("korbanMengungsi", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="kerugianMateril">Kerugian Materil (Rp)</Label>
            <Input
              id="kerugianMateril"
              type="number"
              min="0"
              placeholder="0"
              value={form.kerugianMateril}
              onChange={(e) => set("kerugianMateril", e.target.value)}
            />
          </div>
        </div>

        {/* Section: Upaya */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Upaya Penanganan &amp; Pemulihan
          </h3>
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
            <Label htmlFor="upayaPemulihan">Upaya Pemulihan</Label>
            <textarea
              id="upayaPemulihan"
              rows={3}
              placeholder="Melalui kegiatan Pemulihan; Rehabilitasi; Rekonstruksi..."
              value={form.upayaPemulihan}
              onChange={(e) => set("upayaPemulihan", e.target.value)}
              className={fieldClass}
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

        {/* Section: Wilayah / Lokasi */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Wilayah / Lokasi Peristiwa
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
                placeholder="Contoh: Polres, Masyarakat"
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
          <div>
            <Label htmlFor="keterangan">Keterangan Lainnya</Label>
            <textarea
              id="keterangan"
              rows={2}
              placeholder="Keterangan tambahan..."
              value={form.keterangan}
              onChange={(e) => set("keterangan", e.target.value)}
              className={fieldClass}
            />
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
            onClick={() => navigate("/peristiwa-konflik")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}

function mapFormToData(form: typeof emptyForm): Omit<PeristiwaKonflik, "id" | "status" | "createdBy" | "createdAt"> {
  return {
    periode: form.periode,
    namaPeristiwa: form.namaPeristiwa,
    sumberSebabKonflik: form.sumberSebabKonflik,
    latarBelakangKejadian: form.latarBelakangKejadian,
    deskripsiAkibatPeristiwa: form.deskripsiAkibatPeristiwa,
    korbanKritis: Number(form.korbanKritis) || 0,
    korbanLukaLuka: Number(form.korbanLukaLuka) || 0,
    korbanMengungsi: Number(form.korbanMengungsi) || 0,
    kerugianMateril: Number(form.kerugianMateril) || 0,
    upayaPenanganan: form.upayaPenanganan,
    upayaPemulihan: form.upayaPemulihan,
    kabupaten: form.kabupaten,
    kecamatan: form.kecamatan,
    desa: form.desa,
    alamatDetail: form.alamatDetail,
    titikKoordinat: form.titikKoordinat,
    sumberInformasi: form.sumberInformasi,
    keterangan: form.keterangan,
    tingkatRisiko: form.tingkatRisiko as LevelRisikoLabel,
  };
}
