import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader } from "../../components/common";
import FormSection from "../../components/common/FormSection";
import FormField from "../../components/form/FormField";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { TKA, JenisKelamin, JenisIzinTinggal } from "../../types/tka";
import { mockTKA, kewarganegaraanOptions, jenisIzinTinggalOptions } from "./mockData";

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

  const textareaClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none";

  return (
    <>
      <PageMeta title={isEdit ? "Edit Data TKA" : "Tambah Data TKA"} description="Form Tenaga Kerja Asing" />
      <div className="max-w-3xl space-y-6">
        <PageHeader
          title={`${isEdit ? "Edit" : "Tambah"} Data Tenaga Kerja Asing`}
          actions={
            <button onClick={() => navigate("/tka")} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              <CloseIcon /> Batal
            </button>
          }
        />

        <FormSection title="Identitas Tenaga Kerja Asing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Periode" required error={errors.periode}>
              <Input id="periode" type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />
            </FormField>
            <FormField label="Jenis Kelamin" required error={errors.jenisKelamin}>
              <SelectField value={form.jenisKelamin} onChange={(v) => set("jenisKelamin", v)} options={["Laki-Laki", "Perempuan"]} placeholder="-- Pilih Jenis Kelamin --" />
            </FormField>
          </div>
          <FormField label="Nama Tenaga Kerja Asing (TKA)" required error={errors.namaTKA}>
            <Input id="namaTKA" placeholder="Nama lengkap TKA" value={form.namaTKA} onChange={(e) => set("namaTKA", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nama Perusahaan" required error={errors.namaPerusahaan}>
              <Input placeholder="Nama perusahaan pemberi kerja" value={form.namaPerusahaan} onChange={(e) => set("namaPerusahaan", e.target.value)} />
            </FormField>
            <FormField label="Jabatan / Keterampilan yang Dipersyaratkan" required error={errors.jabatanKeterampilan}>
              <Input placeholder="Contoh: Direktur, Ahli Geologi" value={form.jabatanKeterampilan} onChange={(e) => set("jabatanKeterampilan", e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="No. Telepon / Komunikasi">
              <Input placeholder="Contoh: 021-30027133" value={form.noTelepon} onChange={(e) => set("noTelepon", e.target.value)} />
            </FormField>
            <FormField label="Kewarganegaraan" required error={errors.kewarganegaraan}>
              <SelectField value={form.kewarganegaraan} onChange={(v) => set("kewarganegaraan", v)} options={kewarganegaraanOptions} placeholder="-- Pilih Kewarganegaraan --" />
            </FormField>
          </div>
          <FormField label="No. Paspor" required error={errors.noPaspor}>
            <Input placeholder="Contoh: A1234567" value={form.noPaspor} onChange={(e) => set("noPaspor", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Nomor IMTA / RPTKA & Masa Berlaku">
          <FormField label="Nomor IMTA / RPTKA" required error={errors.nomorIMTA}>
            <Input placeholder="Contoh: IMTA001 / RPTKA-2025-001" value={form.nomorIMTA} onChange={(e) => set("nomorIMTA", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Tanggal Mulai" required error={errors.tanggalMulaiIMTA}>
              <Input type="date" value={form.tanggalMulaiIMTA} onChange={(e) => set("tanggalMulaiIMTA", e.target.value)} />
            </FormField>
            <FormField label="Tanggal Berakhir" required error={errors.tanggalBerakhirIMTA}>
              <Input type="date" value={form.tanggalBerakhirIMTA} onChange={(e) => set("tanggalBerakhirIMTA", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Jenis Izin Tinggal (Visa, KITAS, KITAP)" required error={errors.jenisIzinTinggal}>
            <SelectField value={form.jenisIzinTinggal} onChange={(v) => set("jenisIzinTinggal", v)} options={jenisIzinTinggalOptions} placeholder="-- Pilih Jenis Izin Tinggal --" />
          </FormField>
        </FormSection>

        <FormSection title="Lokasi Kerja">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Kabupaten" required error={errors.kabupaten}>
              <Input placeholder="Kabupaten" value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} />
            </FormField>
            <FormField label="Kecamatan" required error={errors.kecamatan}>
              <Input placeholder="Kecamatan" value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />
            </FormField>
            <FormField label="Desa" required error={errors.desa}>
              <Input placeholder="Desa" value={form.desa} onChange={(e) => set("desa", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Alamat Detail">
            <Input placeholder="Alamat lengkap lokasi kerja" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} />
          </FormField>
          <FormField label="Titik Koordinat">
            <Input placeholder="Contoh: -2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Keterangan & Sumber Informasi">
          <FormField label="Keterangan">
            <textarea rows={3} placeholder="Keterangan tambahan..." value={form.keterangan} onChange={(e) => set("keterangan", e.target.value)} className={textareaClass} />
          </FormField>
          <FormField label="Sumber Informasi">
            <Input placeholder="Contoh: Intel POLRES, Dinas Tenaga Kerja" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} />
          </FormField>
          <FormField label="Saran Tindak Lanjut" required error={errors.saranTindakLanjut}>
            <textarea rows={3} placeholder="Saran tindak lanjut awal yang direkomendasikan operator..." value={form.saranTindakLanjut} onChange={(e) => set("saranTindakLanjut", e.target.value)} className={textareaClass} />
          </FormField>
        </FormSection>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => handleSave("draft")} className="gap-1.5">
            Simpan Draft
          </Button>
          <Button size="sm" onClick={() => handleSave("menunggu")} className="gap-1.5">
            <SaveIcon /> Kirim untuk Approval
          </Button>
          <button onClick={() => navigate("/tka")} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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
