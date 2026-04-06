import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { KewaspadaanDini, LevelRisikoLabel } from "../../types/kewaspadaan";
import { mockKewaspadaan, aspekOptions, levelKemungkinanOptions, levelDampakOptions, kalkulasiTingkatRisiko } from "./mockData";

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
  kemungkinanLevel: "",
  kemungkinanDeskripsi: "",
  hambatan: "",
  tantangan: "",
  gangguan: "",
  dampakLevel: "",
  dampakDeskripsi: "",
  rekomendasi: "",
};

export default function KewaspadaanForm() {
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
      const found = mockKewaspadaan.find((d) => d.id === id);
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
          kemungkinanLevel: found.kemungkinanAncaman.level,
          kemungkinanDeskripsi: found.kemungkinanAncaman.deskripsi,
          hambatan: found.hambatan,
          tantangan: found.tantangan,
          gangguan: found.gangguan,
          dampakLevel: found.prediksiDampak.level,
          dampakDeskripsi: found.prediksiDampak.deskripsi,
          rekomendasi: found.rekomendasi,
        });
      } else {
        alert("Data tidak ditemukan");
        navigate("/kewaspadaan");
      }
    }
  }, [id, isEdit, navigate]);

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const required: [string, string][] = [
      ["periode", "Periode"],
      ["aspek", "Aspek"],
      ["kabupaten", "Kabupaten"],
      ["kecamatan", "Kecamatan"],
      ["desa", "Desa"],
      ["sumberInformasi", "Sumber Informasi"],
      ["kemungkinanLevel", "Level Kemungkinan Ancaman"],
      ["kemungkinanDeskripsi", "Deskripsi Kemungkinan Ancaman"],
      ["dampakLevel", "Level Prediksi Dampak"],
      ["dampakDeskripsi", "Deskripsi Prediksi Dampak"],
      ["rekomendasi", "Rekomendasi"],
    ];
    required.forEach(([k, label]) => {
      if (!form[k as keyof typeof form]?.trim()) errs[k] = `${label} wajib diisi`;
    });
    return errs;
  };

  const handleSubmit = (e: React.FormEvent, submitStatus: "draft" | "menunggu") => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload: KewaspadaanDini = {
      id: isEdit && id ? id : String(Date.now()),
      periode: form.periode,
      aspek: form.aspek,
      kabupaten: form.kabupaten,
      kecamatan: form.kecamatan,
      desa: form.desa,
      alamatDetail: form.alamatDetail,
      titikKoordinat: form.titikKoordinat,
      sumberInformasi: form.sumberInformasi,
      kemungkinanAncaman: { level: form.kemungkinanLevel, deskripsi: form.kemungkinanDeskripsi },
      hambatan: form.hambatan,
      tantangan: form.tantangan,
      gangguan: form.gangguan,
      prediksiDampak: { level: form.dampakLevel, deskripsi: form.dampakDeskripsi },
      rekomendasi: form.rekomendasi,
      tingkatRisiko: tingkatRisiko as LevelRisikoLabel,
      status: submitStatus,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
    };

    if (isEdit && id) {
      const idx = mockKewaspadaan.findIndex((d) => d.id === id);
      if (idx !== -1) mockKewaspadaan[idx] = { ...mockKewaspadaan[idx], ...payload };
    } else {
      mockKewaspadaan.unshift(payload);
    }
    navigate("/kewaspadaan");
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
      {children}
    </h3>
  );

  const Field = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Kewaspadaan Dini" : "Tambah Kewaspadaan Dini"}
        description="Form Kewaspadaan Dini Daerah"
      />
      <div className="max-w-3xl space-y-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? "Edit" : "Tambah"} Form Kewaspadaan Dini
        </h2>

        <form className="space-y-6">
          {/* Informasi Umum */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <SectionTitle>Informasi Umum</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Periode" required error={errors.periode}>
                <Input type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />
              </Field>
              <Field label="Aspek" required error={errors.aspek}>
                <select value={form.aspek} onChange={(e) => set("aspek", e.target.value)} className={fieldClass}>
                  <option value="">-- Pilih Aspek --</option>
                  {aspekOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Wilayah / Lokasi */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <SectionTitle>Wilayah / Lokasi</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kabupaten" required error={errors.kabupaten}>
                <Input type="text" placeholder="Nama kabupaten" value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} />
              </Field>
              <Field label="Kecamatan" required error={errors.kecamatan}>
                <Input type="text" placeholder="Nama kecamatan" value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />
              </Field>
              <Field label="Desa" required error={errors.desa}>
                <Input type="text" placeholder="Nama desa" value={form.desa} onChange={(e) => set("desa", e.target.value)} />
              </Field>
              <Field label="Alamat Detail" error={errors.alamatDetail}>
                <Input type="text" placeholder="Alamat lengkap" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} />
              </Field>
              <Field label="Titik Koordinat" error={errors.titikKoordinat}>
                <Input type="text" placeholder="Contoh: -2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} />
              </Field>
              <Field label="Sumber Informasi" required error={errors.sumberInformasi}>
                <Input type="text" placeholder="Contoh: Polres, Babinsa" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bukti Dukung (Foto)" error={errors.buktiFoto}>
                  <input type="file" accept="image/*" className={fieldClass + " py-1.5"} />
                </Field>
              </div>
            </div>
          </div>

          {/* Analisis Risiko */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <SectionTitle>Analisis Risiko</SectionTitle>
            <div className="space-y-4">
              {/* Kemungkinan Ancaman */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="sm:col-span-1">
                  <Field label="Kemungkinan Ancaman — Level" required error={errors.kemungkinanLevel}>
                    <select value={form.kemungkinanLevel} onChange={(e) => set("kemungkinanLevel", e.target.value)} className={fieldClass}>
                      <option value="">-- Pilih Level --</option>
                      {levelKemungkinanOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Deskripsi Kemungkinan Ancaman" required error={errors.kemungkinanDeskripsi}>
                    <textarea rows={3} placeholder="Deskripsikan kemungkinan ancaman..." value={form.kemungkinanDeskripsi} onChange={(e) => set("kemungkinanDeskripsi", e.target.value)} className={fieldClass + " resize-none"} />
                  </Field>
                </div>
              </div>

              <Field label="Hambatan" error={errors.hambatan}>
                <textarea rows={2} placeholder="Hambatan yang ada..." value={form.hambatan} onChange={(e) => set("hambatan", e.target.value)} className={fieldClass + " resize-none"} />
              </Field>
              <Field label="Tantangan" error={errors.tantangan}>
                <textarea rows={2} placeholder="Tantangan yang dihadapi..." value={form.tantangan} onChange={(e) => set("tantangan", e.target.value)} className={fieldClass + " resize-none"} />
              </Field>
              <Field label="Gangguan" error={errors.gangguan}>
                <textarea rows={2} placeholder="Gangguan yang terjadi..." value={form.gangguan} onChange={(e) => set("gangguan", e.target.value)} className={fieldClass + " resize-none"} />
              </Field>

              {/* Prediksi Dampak */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="sm:col-span-1">
                  <Field label="Prediksi Dampak — Level" required error={errors.dampakLevel}>
                    <select value={form.dampakLevel} onChange={(e) => set("dampakLevel", e.target.value)} className={fieldClass}>
                      <option value="">-- Pilih Level --</option>
                      {levelDampakOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Deskripsi Prediksi Dampak" required error={errors.dampakDeskripsi}>
                    <textarea rows={3} placeholder="Deskripsikan prediksi dampak..." value={form.dampakDeskripsi} onChange={(e) => set("dampakDeskripsi", e.target.value)} className={fieldClass + " resize-none"} />
                  </Field>
                </div>
              </div>

              <Field label="Rekomendasi" required error={errors.rekomendasi}>
                <textarea rows={3} placeholder="Rekomendasi tindakan..." value={form.rekomendasi} onChange={(e) => set("rekomendasi", e.target.value)} className={fieldClass + " resize-none"} />
              </Field>

              {/* Tingkat Risiko kalkulasi */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tingkat Risiko (Kalkulasi):</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tingkatRisiko !== "-" ? risikoColor[tingkatRisiko] : "text-gray-400"}`}>
                  {tingkatRisiko}
                </span>
                <span className="text-xs text-gray-400">dari matriks kemungkinan × dampak</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={(e) => handleSubmit(e, "draft")}>
              <SaveIcon /> Simpan Draft
            </Button>
            <Button type="button" size="sm" className="gap-1.5" onClick={(e) => handleSubmit(e, "menunggu")}>
              <SaveIcon /> Ajukan Approval
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
