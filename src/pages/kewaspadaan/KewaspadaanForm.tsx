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
import type { LevelRisikoLabel } from "../../types/kewaspadaan";
import { kewaspadaanService } from "../../services/kewaspadaanService";

const aspekOptions = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];
const levelKemungkinanOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
const levelDampakOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];

const risikoColor: Record<string, string> = {
  Rendah: "text-success-600 bg-success-50 dark:bg-success-900/20",
  Sedang: "text-warning-600 bg-warning-50 dark:bg-warning-900/20",
  Tinggi: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  "Sangat Tinggi": "text-error-600 bg-error-50 dark:bg-error-900/20",
};

const matriksRisiko: Record<string, Record<string, string>> = {
  Rendah: { Rendah: "Rendah", Sedang: "Rendah", Tinggi: "Sedang", "Sangat Tinggi": "Sedang" },
  Sedang: { Rendah: "Rendah", Sedang: "Sedang", Tinggi: "Tinggi", "Sangat Tinggi": "Tinggi" },
  Tinggi: { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
  "Sangat Tinggi": { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Sangat Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
};

function kalkulasiTingkatRisiko(kemungkinan: string, dampak: string): string {
  return matriksRisiko[kemungkinan]?.[dampak] ?? "-";
}

const emptyForm = {
  periode: "", aspek: "", kabupaten: "", kecamatan: "", desa: "",
  alamatDetail: "", titikKoordinat: "", sumberInformasi: "",
  kemungkinanLevel: "", kemungkinanDeskripsi: "",
  hambatan: "", tantangan: "", gangguan: "",
  dampakLevel: "", dampakDeskripsi: "", rekomendasi: "",
};

export default function KewaspadaanForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tingkatRisiko = form.kemungkinanLevel && form.dampakLevel
    ? kalkulasiTingkatRisiko(form.kemungkinanLevel, form.dampakLevel) : "-";

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      kewaspadaanService.getById(id).then((data) => {
        setForm({
          periode: data.periode,
          aspek: data.aspek,
          kabupaten: data.kabupaten,
          kecamatan: data.kecamatan,
          desa: data.desa,
          alamatDetail: data.alamatDetail || "",
          titikKoordinat: data.titikKoordinat || "",
          sumberInformasi: data.sumberInformasi,
          kemungkinanLevel: data.kemungkinanAncaman.level,
          kemungkinanDeskripsi: data.kemungkinanAncaman.deskripsi,
          hambatan: data.hambatan || "",
          tantangan: data.tantangan || "",
          gangguan: data.gangguan || "",
          dampakLevel: data.prediksiDampak.level,
          dampakDeskripsi: data.prediksiDampak.deskripsi,
          rekomendasi: data.rekomendasi,
        });
      }).catch(() => { alert("Data tidak ditemukan"); navigate("/kewaspadaan"); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const required: [string, string][] = [
      ["periode", "Periode"], ["aspek", "Aspek"], ["kabupaten", "Kabupaten"],
      ["kecamatan", "Kecamatan"], ["desa", "Desa"], ["sumberInformasi", "Sumber Informasi"],
      ["kemungkinanLevel", "Level Kemungkinan Ancaman"], ["kemungkinanDeskripsi", "Deskripsi Kemungkinan Ancaman"],
      ["dampakLevel", "Level Prediksi Dampak"], ["dampakDeskripsi", "Deskripsi Prediksi Dampak"],
      ["rekomendasi", "Saran & Tindak Lanjut"],
    ];
    required.forEach(([k, label]) => {
      if (!form[k as keyof typeof form]?.trim()) errs[k] = `${label} wajib diisi`;
    });
    return errs;
  };

  const handleSubmit = async (submitStatus: "draft" | "menunggu") => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        periode: form.periode,
        aspek: form.aspek,
        kabupaten: form.kabupaten,
        kecamatan: form.kecamatan,
        desa: form.desa,
        alamatDetail: form.alamatDetail || undefined,
        titikKoordinat: form.titikKoordinat || undefined,
        sumberInformasi: form.sumberInformasi,
        kemungkinanLevel: form.kemungkinanLevel,
        kemungkinanDeskripsi: form.kemungkinanDeskripsi,
        hambatan: form.hambatan || undefined,
        tantangan: form.tantangan || undefined,
        gangguan: form.gangguan || undefined,
        dampakLevel: form.dampakLevel,
        dampakDeskripsi: form.dampakDeskripsi,
        rekomendasi: form.rekomendasi,
        tingkatRisiko: tingkatRisiko as LevelRisikoLabel,
        status: submitStatus,
      };

      if (isEdit && id) await kewaspadaanService.update(id, payload);
      else await kewaspadaanService.create(payload);
      navigate("/kewaspadaan");
    } catch { alert("Gagal menyimpan data"); }
    finally { setSaving(false); }
  };

  const textareaClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none";

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );

  return (
    <>
      <PageMeta title={isEdit ? "Edit Kewaspadaan Dini" : "Tambah Kewaspadaan Dini"} description="Form Kewaspadaan Dini Daerah" />
      <div className="max-w-3xl space-y-6">
        <PageHeader title={`${isEdit ? "Edit" : "Tambah"} Form Kewaspadaan Dini`} />
        <form className="space-y-6">
          <FormSection title="Informasi Umum">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Periode" required error={errors.periode}>
                <Input type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />
              </FormField>
              <FormField label="Aspek" required error={errors.aspek}>
                <SelectField value={form.aspek} onChange={(v) => set("aspek", v)} options={aspekOptions} placeholder="-- Pilih Aspek --" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Wilayah / Lokasi">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Kabupaten" required error={errors.kabupaten}>
                <Input placeholder="Nama kabupaten" value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} />
              </FormField>
              <FormField label="Kecamatan" required error={errors.kecamatan}>
                <Input placeholder="Nama kecamatan" value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />
              </FormField>
              <FormField label="Desa" required error={errors.desa}>
                <Input placeholder="Nama desa" value={form.desa} onChange={(e) => set("desa", e.target.value)} />
              </FormField>
              <FormField label="Alamat Detail">
                <Input placeholder="Alamat lengkap" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} />
              </FormField>
              <FormField label="Titik Koordinat">
                <Input placeholder="Contoh: -2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} />
              </FormField>
              <FormField label="Sumber Informasi" required error={errors.sumberInformasi}>
                <Input placeholder="Contoh: Polres, Babinsa" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Analisis Risiko">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <FormField label="Kemungkinan Ancaman — Level" required error={errors.kemungkinanLevel}>
                <SelectField value={form.kemungkinanLevel} onChange={(v) => set("kemungkinanLevel", v)} options={levelKemungkinanOptions} placeholder="-- Pilih Level --" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Deskripsi Kemungkinan Ancaman" required error={errors.kemungkinanDeskripsi}>
                  <textarea rows={3} placeholder="Deskripsikan kemungkinan ancaman..." value={form.kemungkinanDeskripsi} onChange={(e) => set("kemungkinanDeskripsi", e.target.value)} className={textareaClass} />
                </FormField>
              </div>
            </div>
            <FormField label="Hambatan">
              <textarea rows={2} placeholder="Hambatan yang ada..." value={form.hambatan} onChange={(e) => set("hambatan", e.target.value)} className={textareaClass} />
            </FormField>
            <FormField label="Tantangan">
              <textarea rows={2} placeholder="Tantangan yang dihadapi..." value={form.tantangan} onChange={(e) => set("tantangan", e.target.value)} className={textareaClass} />
            </FormField>
            <FormField label="Gangguan">
              <textarea rows={2} placeholder="Gangguan yang terjadi..." value={form.gangguan} onChange={(e) => set("gangguan", e.target.value)} className={textareaClass} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <FormField label="Prediksi Dampak — Level" required error={errors.dampakLevel}>
                <SelectField value={form.dampakLevel} onChange={(v) => set("dampakLevel", v)} options={levelDampakOptions} placeholder="-- Pilih Level --" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Deskripsi Prediksi Dampak" required error={errors.dampakDeskripsi}>
                  <textarea rows={3} placeholder="Deskripsikan prediksi dampak..." value={form.dampakDeskripsi} onChange={(e) => set("dampakDeskripsi", e.target.value)} className={textareaClass} />
                </FormField>
              </div>
            </div>
            <FormField label="Saran & Tindak Lanjut" required error={errors.rekomendasi}>
              <textarea rows={3} placeholder="Saran & tindak lanjut..." value={form.rekomendasi} onChange={(e) => set("rekomendasi", e.target.value)} className={textareaClass} />
            </FormField>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tingkat Risiko (Kalkulasi):</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tingkatRisiko !== "-" ? risikoColor[tingkatRisiko] : "text-gray-400"}`}>
                {tingkatRisiko}
              </span>
              <span className="text-xs text-gray-400">dari matriks kemungkinan × dampak</span>
            </div>
          </FormSection>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled={saving} onClick={() => handleSubmit("draft")}>
              <SaveIcon /> Simpan Draft
            </Button>
            <Button type="button" size="sm" className="gap-1.5" disabled={saving} onClick={() => handleSubmit("menunggu")}>
              <SaveIcon /> {saving ? "Menyimpan..." : "Ajukan Approval"}
            </Button>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/kewaspadaan")}>
              <CloseIcon /> Batal
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
