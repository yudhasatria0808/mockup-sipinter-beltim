import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { LevelRisikoLabel } from "../../types/potensi-konflik";
import { potensiKonflikService } from "../../services/potensiKonflikService";

const aspekOptions = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];
const levelOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
const fieldClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";
const risikoColor: Record<string, string> = { Rendah: "text-success-600 bg-success-50", Sedang: "text-warning-600 bg-warning-50", Tinggi: "text-orange-600 bg-orange-50", "Sangat Tinggi": "text-error-600 bg-error-50" };

const matriksRisiko: Record<string, Record<string, string>> = {
  Rendah: { Rendah: "Rendah", Sedang: "Rendah", Tinggi: "Sedang", "Sangat Tinggi": "Sedang" },
  Sedang: { Rendah: "Rendah", Sedang: "Sedang", Tinggi: "Tinggi", "Sangat Tinggi": "Tinggi" },
  Tinggi: { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
  "Sangat Tinggi": { Rendah: "Sedang", Sedang: "Tinggi", Tinggi: "Sangat Tinggi", "Sangat Tinggi": "Sangat Tinggi" },
};
function kalkulasi(k: string, d: string) { return matriksRisiko[k]?.[d] ?? "-"; }

const emptyForm = { periode: "", aspek: "", kabupaten: "", kecamatan: "", desa: "", alamatDetail: "", titikKoordinat: "", sumberInformasi: "", namaPotensiKonflik: "", kemungkinanLevel: "", kemungkinanDeskripsi: "", sumberSebabPermasalahan: "", latarBelakangMasalah: "", dampakLevel: "", dampakDeskripsi: "", upayaPenanganan: "", keteranganDetail: "", rekomendasi: "" };

export default function PotensiKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tingkatRisiko = form.kemungkinanLevel && form.dampakLevel ? kalkulasi(form.kemungkinanLevel, form.dampakLevel) : "-";

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      potensiKonflikService.getById(id).then((d) => {
        setForm({ periode: d.periode, aspek: d.aspek, kabupaten: d.kabupaten, kecamatan: d.kecamatan, desa: d.desa, alamatDetail: d.alamatDetail || "", titikKoordinat: d.titikKoordinat || "", sumberInformasi: d.sumberInformasi || "", namaPotensiKonflik: d.namaPotensiKonflik, kemungkinanLevel: d.kemungkinanPotensiKonflik.level, kemungkinanDeskripsi: d.kemungkinanPotensiKonflik.deskripsi || "", sumberSebabPermasalahan: d.sumberSebabPermasalahan || "", latarBelakangMasalah: d.latarBelakangMasalah || "", dampakLevel: d.dampakPotensiKonflik.level, dampakDeskripsi: d.dampakPotensiKonflik.deskripsi || "", upayaPenanganan: d.upayaPenanganan || "", keteranganDetail: d.keteranganDetail || "", rekomendasi: d.rekomendasi });
      }).catch(() => { alert("Data tidak ditemukan"); navigate("/potensi-konflik"); }).finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const set = (k: string, v: string) => { setForm((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.periode) e.periode = "Wajib diisi";
    if (!form.aspek) e.aspek = "Wajib dipilih";
    if (!form.kabupaten) e.kabupaten = "Wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Wajib diisi";
    if (!form.desa) e.desa = "Wajib diisi";
    if (!form.namaPotensiKonflik) e.namaPotensiKonflik = "Wajib diisi";
    if (!form.kemungkinanLevel) e.kemungkinanLevel = "Wajib dipilih";
    if (!form.dampakLevel) e.dampakLevel = "Wajib dipilih";
    if (!form.rekomendasi.trim()) e.rekomendasi = "Wajib diisi";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSave = async (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, tingkatRisiko: tingkatRisiko as LevelRisikoLabel, status: submitStatus, alamatDetail: form.alamatDetail || undefined, titikKoordinat: form.titikKoordinat || undefined, sumberInformasi: form.sumberInformasi || undefined, kemungkinanDeskripsi: form.kemungkinanDeskripsi || undefined, sumberSebabPermasalahan: form.sumberSebabPermasalahan || undefined, latarBelakangMasalah: form.latarBelakangMasalah || undefined, dampakDeskripsi: form.dampakDeskripsi || undefined, upayaPenanganan: form.upayaPenanganan || undefined, keteranganDetail: form.keteranganDetail || undefined };
      if (isEdit && id) await potensiKonflikService.update(id, payload);
      else await potensiKonflikService.create(payload);
      navigate("/potensi-konflik");
    } catch { alert("Gagal menyimpan data"); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title={isEdit ? "Edit Potensi Konflik" : "Tambah Potensi Konflik"} description="Form Potensi Konflik" />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">{isEdit ? "Edit" : "Tambah"} Form Potensi Konflik</h2>
          <button onClick={() => navigate("/potensi-konflik")} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"><CloseIcon /> Batal</button>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">Informasi Umum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label htmlFor="periode">Periode <span className="text-error-500">*</span></Label><Input id="periode" type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />{errors.periode && <p className="mt-1 text-xs text-error-500">{errors.periode}</p>}</div>
            <div><Label htmlFor="aspek">Aspek <span className="text-error-500">*</span></Label><select id="aspek" value={form.aspek} onChange={(e) => set("aspek", e.target.value)} className={fieldClass}><option value="">-- Pilih --</option>{aspekOptions.map((a) => <option key={a} value={a}>{a}</option>)}</select>{errors.aspek && <p className="mt-1 text-xs text-error-500">{errors.aspek}</p>}</div>
          </div>
          <div><Label htmlFor="namaPotensiKonflik">Nama Potensi Konflik <span className="text-error-500">*</span></Label><Input id="namaPotensiKonflik" placeholder="Masukkan nama/judul potensi konflik" value={form.namaPotensiKonflik} onChange={(e) => set("namaPotensiKonflik", e.target.value)} />{errors.namaPotensiKonflik && <p className="mt-1 text-xs text-error-500">{errors.namaPotensiKonflik}</p>}</div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">Wilayah / Lokasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Kabupaten <span className="text-error-500">*</span></Label><Input placeholder="Kabupaten" value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} />{errors.kabupaten && <p className="mt-1 text-xs text-error-500">{errors.kabupaten}</p>}</div>
            <div><Label>Kecamatan <span className="text-error-500">*</span></Label><Input placeholder="Kecamatan" value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />{errors.kecamatan && <p className="mt-1 text-xs text-error-500">{errors.kecamatan}</p>}</div>
            <div><Label>Desa <span className="text-error-500">*</span></Label><Input placeholder="Desa" value={form.desa} onChange={(e) => set("desa", e.target.value)} />{errors.desa && <p className="mt-1 text-xs text-error-500">{errors.desa}</p>}</div>
          </div>
          <div><Label>Alamat Detail</Label><Input placeholder="Alamat lengkap" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Titik Koordinat</Label><Input placeholder="-2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} /></div>
            <div><Label>Sumber Informasi</Label><Input placeholder="Intel POLRES" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} /></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">Analisis Konflik</h3>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Kemungkinan Potensi Konflik</p>
            <div><Label>Level <span className="text-error-500">*</span></Label><select value={form.kemungkinanLevel} onChange={(e) => set("kemungkinanLevel", e.target.value)} className={fieldClass}><option value="">-- Pilih --</option>{levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}</select>{errors.kemungkinanLevel && <p className="mt-1 text-xs text-error-500">{errors.kemungkinanLevel}</p>}</div>
            <div><Label>Deskripsi</Label><textarea rows={3} placeholder="Deskripsi kemungkinan..." value={form.kemungkinanDeskripsi} onChange={(e) => set("kemungkinanDeskripsi", e.target.value)} className={fieldClass} /></div>
          </div>
          <div><Label>Sumber/Sebab Permasalahan</Label><textarea rows={3} placeholder="Uraikan sumber permasalahan..." value={form.sumberSebabPermasalahan} onChange={(e) => set("sumberSebabPermasalahan", e.target.value)} className={fieldClass} /></div>
          <div><Label>Latar Belakang Masalah</Label><textarea rows={3} placeholder="Uraikan latar belakang..." value={form.latarBelakangMasalah} onChange={(e) => set("latarBelakangMasalah", e.target.value)} className={fieldClass} /></div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dampak Potensi Konflik</p>
            <div><Label>Level <span className="text-error-500">*</span></Label><select value={form.dampakLevel} onChange={(e) => set("dampakLevel", e.target.value)} className={fieldClass}><option value="">-- Pilih --</option>{levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}</select>{errors.dampakLevel && <p className="mt-1 text-xs text-error-500">{errors.dampakLevel}</p>}</div>
            <div><Label>Deskripsi</Label><textarea rows={3} placeholder="Deskripsi dampak..." value={form.dampakDeskripsi} onChange={(e) => set("dampakDeskripsi", e.target.value)} className={fieldClass} /></div>
          </div>
          <div><Label>Upaya Penanganan</Label><textarea rows={3} placeholder="Upaya penanganan..." value={form.upayaPenanganan} onChange={(e) => set("upayaPenanganan", e.target.value)} className={fieldClass} /></div>
          <div><Label>Keterangan Detail</Label><textarea rows={3} placeholder="Keterangan detail..." value={form.keteranganDetail} onChange={(e) => set("keteranganDetail", e.target.value)} className={fieldClass} /></div>
          <div><Label>Saran & Tindak Lanjut <span className="text-error-500">*</span></Label><textarea rows={3} placeholder="Saran & tindak lanjut..." value={form.rekomendasi} onChange={(e) => set("rekomendasi", e.target.value)} className={fieldClass} />{errors.rekomendasi && <p className="mt-1 text-xs text-error-500">{errors.rekomendasi}</p>}</div>
          <div className="flex items-center gap-3 pt-1"><span className="text-sm text-gray-600">Tingkat Risiko:</span><span className={`px-3 py-1 rounded-full text-sm font-semibold ${tingkatRisiko !== "-" ? risikoColor[tingkatRisiko] : "text-gray-400 bg-gray-100"}`}>{tingkatRisiko}</span></div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" variant="outline" disabled={saving} onClick={() => handleSave("draft")}>Simpan Draft</Button>
          <Button size="sm" disabled={saving} onClick={() => handleSave("menunggu")} className="gap-1.5"><SaveIcon /> {saving ? "Menyimpan..." : "Kirim untuk Approval"}</Button>
        </div>
      </div>
    </>
  );
}
