import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { WNA, JenisKelamin, JenisVisa, StatusTinggal } from "../../types/wna";
import { mockWNA, kewarganegaraanOptions, jenisVisaOptions, statusTinggalOptions } from "./mockData";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

const emptyForm = {
  periode: "",
  jenisKelamin: "",
  kewarganegaraan: "",
  noPaspor: "",
  jenisVisa: "",
  masaBerlakuVisa: "",
  pekerjaan: "",
  sponsor: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  alamatDetail: "",
  titikKoordinat: "",
  lamaTinggal: "",
  statusTinggal: "",
  keterangan: "",
  sumberInformasi: "",
  saranTindakLanjut: "",
};

export default function WNAForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockWNA.find((d) => d.id === id);
      if (found) {
        setForm({
          periode: found.periode,
          jenisKelamin: found.jenisKelamin,
          kewarganegaraan: found.kewarganegaraan,
          noPaspor: found.noPaspor,
          jenisVisa: found.jenisVisa,
          masaBerlakuVisa: found.masaBerlakuVisa,
          pekerjaan: found.pekerjaan,
          sponsor: found.sponsor,
          kabupaten: found.kabupaten,
          kecamatan: found.kecamatan,
          desa: found.desa,
          alamatDetail: found.alamatDetail,
          titikKoordinat: found.titikKoordinat,
          lamaTinggal: found.lamaTinggal,
          statusTinggal: found.statusTinggal,
          keterangan: found.keterangan ?? "",
          sumberInformasi: found.sumberInformasi,
        });
      } else {
        alert("Data tidak ditemukan");
        navigate("/wna");
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
    if (!form.jenisKelamin) e.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!form.kewarganegaraan) e.kewarganegaraan = "Kewarganegaraan wajib diisi";
    if (!form.noPaspor) e.noPaspor = "No. Paspor wajib diisi";
    if (!form.jenisVisa) e.jenisVisa = "Jenis visa wajib dipilih";
    if (!form.masaBerlakuVisa) e.masaBerlakuVisa = "Masa berlaku visa wajib diisi";
    if (!form.kabupaten) e.kabupaten = "Kabupaten wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Kecamatan wajib diisi";
    if (!form.desa) e.desa = "Desa wajib diisi";
    if (!form.statusTinggal) e.statusTinggal = "Status tinggal wajib dipilih";
    if (!form.saranTindakLanjut.trim()) e.saranTindakLanjut = "Saran tindak lanjut wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;

    const mapped = mapFormToData(form);

    if (isEdit && id) {
      const idx = mockWNA.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockWNA[idx] = {
          ...mockWNA[idx],
          ...mapped,
          status: submitStatus,
        };
      }
    } else {
      const newItem: WNA = {
        id: String(Date.now()),
        ...mapped,
        status: submitStatus,
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };
      mockWNA.unshift(newItem);
    }

    navigate("/wna");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Data WNA" : "Tambah Data WNA"}
        description="Form Warga Negara Asing"
      />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit" : "Tambah"} Data Warga Negara Asing
          </h2>
          <button
            onClick={() => navigate("/wna")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <CloseIcon /> Batal
          </button>
        </div>

        {/* Section: Identitas WNA */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Identitas WNA
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Label htmlFor="noPaspor">No. Paspor / Identitas Utama WNA <span className="text-error-500">*</span></Label>
            <Input
              id="noPaspor"
              placeholder="Contoh: A1234567"
              value={form.noPaspor}
              onChange={(e) => set("noPaspor", e.target.value)}
            />
            {errors.noPaspor && <p className="mt-1 text-xs text-error-500">{errors.noPaspor}</p>}
          </div>
        </div>

        {/* Section: Visa / Izin Tinggal */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Jenis Visa / ITAS (Izin Tinggal)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jenisVisa">Jenis Visa / ITAS <span className="text-error-500">*</span></Label>
              <select
                id="jenisVisa"
                value={form.jenisVisa}
                onChange={(e) => set("jenisVisa", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Jenis Visa --</option>
                {jenisVisaOptions.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.jenisVisa && <p className="mt-1 text-xs text-error-500">{errors.jenisVisa}</p>}
            </div>
            <div>
              <Label htmlFor="masaBerlakuVisa">Masa Berlaku Visa / KITAS / KITAP <span className="text-error-500">*</span></Label>
              <Input
                id="masaBerlakuVisa"
                type="date"
                value={form.masaBerlakuVisa}
                onChange={(e) => set("masaBerlakuVisa", e.target.value)}
              />
              {errors.masaBerlakuVisa && <p className="mt-1 text-xs text-error-500">{errors.masaBerlakuVisa}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pekerjaan">Pekerjaan</Label>
              <Input
                id="pekerjaan"
                placeholder="Contoh: Konsultan, Mahasiswa"
                value={form.pekerjaan}
                onChange={(e) => set("pekerjaan", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sponsor">Sponsor (Perusahaan / Perorangan)</Label>
              <Input
                id="sponsor"
                placeholder="Contoh: PT. ABC, AMINEF"
                value={form.sponsor}
                onChange={(e) => set("sponsor", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section: Alamat Domisili */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Alamat Domisili
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

        {/* Section: Lama Tinggal & Status */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
            Lama Tinggal &amp; Keterangan Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lamaTinggal">Lama Tinggal (Durasi)</Label>
              <Input
                id="lamaTinggal"
                placeholder="Contoh: 1 Tahun, 6 Bulan"
                value={form.lamaTinggal}
                onChange={(e) => set("lamaTinggal", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="statusTinggal">Keterangan / Status <span className="text-error-500">*</span></Label>
              <select
                id="statusTinggal"
                value={form.statusTinggal}
                onChange={(e) => set("statusTinggal", e.target.value)}
                className={fieldClass}
              >
                <option value="">-- Pilih Status --</option>
                {statusTinggalOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.statusTinggal && <p className="mt-1 text-xs text-error-500">{errors.statusTinggal}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="keterangan">Keterangan Tambahan</Label>
            <textarea
              id="keterangan"
              rows={2}
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
              placeholder="Contoh: Intel POLRES, Imigrasi"
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
            onClick={() => navigate("/wna")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
}

function mapFormToData(form: typeof emptyForm): Omit<WNA, "id" | "status" | "createdBy" | "createdAt"> {
  return {
    periode: form.periode,
    jenisKelamin: form.jenisKelamin as JenisKelamin,
    kewarganegaraan: form.kewarganegaraan,
    noPaspor: form.noPaspor,
    jenisVisa: form.jenisVisa as JenisVisa,
    masaBerlakuVisa: form.masaBerlakuVisa,
    pekerjaan: form.pekerjaan,
    sponsor: form.sponsor,
    kabupaten: form.kabupaten,
    kecamatan: form.kecamatan,
    desa: form.desa,
    alamatDetail: form.alamatDetail,
    titikKoordinat: form.titikKoordinat,
    lamaTinggal: form.lamaTinggal,
    statusTinggal: form.statusTinggal as StatusTinggal,
    keterangan: form.keterangan,
    sumberInformasi: form.sumberInformasi,
  };
}
