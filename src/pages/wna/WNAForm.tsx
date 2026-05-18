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
import type { WNA, JenisKelamin, JenisVisa, StatusTinggal } from "../../types/wna";
import { mockWNA, kewarganegaraanOptions, jenisVisaOptions, statusTinggalOptions } from "./mockData";

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
          saranTindakLanjut: found.saranTindakLanjut ?? "",
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
        mockWNA[idx] = { ...mockWNA[idx], ...mapped, status: submitStatus };
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

  const textareaClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none";

  return (
    <>
      <PageMeta title={isEdit ? "Edit Data WNA" : "Tambah Data WNA"} description="Form Warga Negara Asing" />
      <div className="max-w-3xl space-y-6">
        <PageHeader
          title={`${isEdit ? "Edit" : "Tambah"} Data Warga Negara Asing`}
          actions={
            <button onClick={() => navigate("/wna")} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              <CloseIcon /> Batal
            </button>
          }
        />

        <FormSection title="Identitas WNA">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Periode" required error={errors.periode}>
              <Input type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Jenis Kelamin" required error={errors.jenisKelamin}>
              <SelectField value={form.jenisKelamin} onChange={(v) => set("jenisKelamin", v)} options={["Laki-Laki", "Perempuan"]} placeholder="-- Pilih Jenis Kelamin --" />
            </FormField>
            <FormField label="Kewarganegaraan" required error={errors.kewarganegaraan}>
              <SelectField value={form.kewarganegaraan} onChange={(v) => set("kewarganegaraan", v)} options={kewarganegaraanOptions} placeholder="-- Pilih Kewarganegaraan --" />
            </FormField>
          </div>
          <FormField label="No. Paspor / Identitas Utama WNA" required error={errors.noPaspor}>
            <Input placeholder="Contoh: A1234567" value={form.noPaspor} onChange={(e) => set("noPaspor", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Jenis Visa / ITAS (Izin Tinggal)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Jenis Visa / ITAS" required error={errors.jenisVisa}>
              <SelectField value={form.jenisVisa} onChange={(v) => set("jenisVisa", v)} options={jenisVisaOptions} placeholder="-- Pilih Jenis Visa --" />
            </FormField>
            <FormField label="Masa Berlaku Visa / KITAS / KITAP" required error={errors.masaBerlakuVisa}>
              <Input type="date" value={form.masaBerlakuVisa} onChange={(e) => set("masaBerlakuVisa", e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Pekerjaan">
              <Input placeholder="Contoh: Konsultan, Mahasiswa" value={form.pekerjaan} onChange={(e) => set("pekerjaan", e.target.value)} />
            </FormField>
            <FormField label="Sponsor (Perusahaan / Perorangan)">
              <Input placeholder="Contoh: PT. ABC, AMINEF" value={form.sponsor} onChange={(e) => set("sponsor", e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Alamat Domisili">
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
            <Input placeholder="Alamat lengkap" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} />
          </FormField>
          <FormField label="Titik Koordinat">
            <Input placeholder="Contoh: -2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Lama Tinggal & Keterangan Status">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lama Tinggal (Durasi)">
              <Input placeholder="Contoh: 1 Tahun, 6 Bulan" value={form.lamaTinggal} onChange={(e) => set("lamaTinggal", e.target.value)} />
            </FormField>
            <FormField label="Keterangan / Status" required error={errors.statusTinggal}>
              <SelectField value={form.statusTinggal} onChange={(v) => set("statusTinggal", v)} options={statusTinggalOptions} placeholder="-- Pilih Status --" />
            </FormField>
          </div>
          <FormField label="Keterangan Tambahan">
            <textarea rows={2} placeholder="Keterangan tambahan..." value={form.keterangan} onChange={(e) => set("keterangan", e.target.value)} className={textareaClass} />
          </FormField>
          <FormField label="Sumber Informasi">
            <Input placeholder="Contoh: Intel POLRES, Imigrasi" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} />
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
          <button onClick={() => navigate("/wna")} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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
