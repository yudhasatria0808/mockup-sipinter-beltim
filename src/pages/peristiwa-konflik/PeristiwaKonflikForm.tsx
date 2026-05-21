import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { peristiwaKonflikService } from "../../services/peristiwaKonflikService";

const levelOptions = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
const fieldClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

const emptyForm = { periode: "", namaPeristiwa: "", sumberSebabKonflik: "", latarBelakangKejadian: "", deskripsiAkibatPeristiwa: "", korbanKritis: 0, korbanLukaLuka: 0, korbanMengungsi: 0, kerugianMateril: 0, upayaPenanganan: "", upayaPemulihan: "", kabupaten: "", kecamatan: "", desa: "", alamatDetail: "", titikKoordinat: "", sumberInformasi: "", keterangan: "", saranTindakLanjut: "", tingkatRisiko: "" };

export default function PeristiwaKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      peristiwaKonflikService.getById(id).then((d) => {
        setForm({ periode: d.periode, namaPeristiwa: d.namaPeristiwa, sumberSebabKonflik: d.sumberSebabKonflik || "", latarBelakangKejadian: d.latarBelakangKejadian || "", deskripsiAkibatPeristiwa: d.deskripsiAkibatPeristiwa || "", korbanKritis: d.korbanKritis, korbanLukaLuka: d.korbanLukaLuka, korbanMengungsi: d.korbanMengungsi, kerugianMateril: d.kerugianMateril, upayaPenanganan: d.upayaPenanganan || "", upayaPemulihan: d.upayaPemulihan || "", kabupaten: d.kabupaten, kecamatan: d.kecamatan, desa: d.desa, alamatDetail: d.alamatDetail || "", titikKoordinat: d.titikKoordinat || "", sumberInformasi: d.sumberInformasi || "", keterangan: d.keterangan || "", saranTindakLanjut: d.saranTindakLanjut || "", tingkatRisiko: d.tingkatRisiko });
      }).catch(() => { alert("Data tidak ditemukan"); navigate("/peristiwa-konflik"); }).finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const set = (k: string, v: string | number) => { setForm((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.periode) e.periode = "Wajib diisi";
    if (!form.namaPeristiwa) e.namaPeristiwa = "Wajib diisi";
    if (!form.kabupaten) e.kabupaten = "Wajib diisi";
    if (!form.kecamatan) e.kecamatan = "Wajib diisi";
    if (!form.desa) e.desa = "Wajib diisi";
    if (!form.tingkatRisiko) e.tingkatRisiko = "Wajib dipilih";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSave = async (submitStatus: "draft" | "menunggu") => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, status: submitStatus, sumberSebabKonflik: form.sumberSebabKonflik || undefined, latarBelakangKejadian: form.latarBelakangKejadian || undefined, deskripsiAkibatPeristiwa: form.deskripsiAkibatPeristiwa || undefined, upayaPenanganan: form.upayaPenanganan || undefined, upayaPemulihan: form.upayaPemulihan || undefined, alamatDetail: form.alamatDetail || undefined, titikKoordinat: form.titikKoordinat || undefined, sumberInformasi: form.sumberInformasi || undefined, keterangan: form.keterangan || undefined, saranTindakLanjut: form.saranTindakLanjut || undefined };
      if (isEdit && id) await peristiwaKonflikService.update(id, payload);
      else await peristiwaKonflikService.create(payload);
      navigate("/peristiwa-konflik");
    } catch { alert("Gagal menyimpan data"); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title={isEdit ? "Edit Peristiwa Konflik" : "Tambah Peristiwa Konflik"} description="Form Peristiwa Konflik" />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">{isEdit ? "Edit" : "Tambah"} Form Peristiwa Konflik</h2><button onClick={() => navigate("/peristiwa-konflik")} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"><CloseIcon /> Batal</button></div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Identitas Peristiwa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Periode <span className="text-error-500">*</span></Label><Input type="date" value={form.periode} onChange={(e) => set("periode", e.target.value)} />{errors.periode && <p className="mt-1 text-xs text-error-500">{errors.periode}</p>}</div>
            <div><Label>Tingkat Risiko <span className="text-error-500">*</span></Label><select value={form.tingkatRisiko} onChange={(e) => set("tingkatRisiko", e.target.value)} className={fieldClass}><option value="">-- Pilih --</option>{levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}</select>{errors.tingkatRisiko && <p className="mt-1 text-xs text-error-500">{errors.tingkatRisiko}</p>}</div>
          </div>
          <div><Label>Nama Peristiwa <span className="text-error-500">*</span></Label><Input placeholder="Nama/judul peristiwa konflik" value={form.namaPeristiwa} onChange={(e) => set("namaPeristiwa", e.target.value)} />{errors.namaPeristiwa && <p className="mt-1 text-xs text-error-500">{errors.namaPeristiwa}</p>}</div>
          <div><Label>Sumber/Sebab Konflik</Label><textarea rows={3} placeholder="Sumber/sebab konflik..." value={form.sumberSebabKonflik} onChange={(e) => set("sumberSebabKonflik", e.target.value)} className={fieldClass} /></div>
          <div><Label>Latar Belakang Kejadian</Label><textarea rows={3} placeholder="Kronologis singkat..." value={form.latarBelakangKejadian} onChange={(e) => set("latarBelakangKejadian", e.target.value)} className={fieldClass} /></div>
          <div><Label>Deskripsi Akibat Peristiwa</Label><textarea rows={3} placeholder="Deskripsi akibat..." value={form.deskripsiAkibatPeristiwa} onChange={(e) => set("deskripsiAkibatPeristiwa", e.target.value)} className={fieldClass} /></div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Korban & Kerugian</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><Label>Korban Kritis</Label><Input type="number" value={form.korbanKritis} onChange={(e) => set("korbanKritis", Number(e.target.value))} /></div>
            <div><Label>Luka-luka</Label><Input type="number" value={form.korbanLukaLuka} onChange={(e) => set("korbanLukaLuka", Number(e.target.value))} /></div>
            <div><Label>Mengungsi</Label><Input type="number" value={form.korbanMengungsi} onChange={(e) => set("korbanMengungsi", Number(e.target.value))} /></div>
            <div><Label>Kerugian Materil (Rp)</Label><Input type="number" value={form.kerugianMateril} onChange={(e) => set("kerugianMateril", Number(e.target.value))} /></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Upaya</h3>
          <div><Label>Upaya Penanganan</Label><textarea rows={3} placeholder="Upaya penanganan..." value={form.upayaPenanganan} onChange={(e) => set("upayaPenanganan", e.target.value)} className={fieldClass} /></div>
          <div><Label>Upaya Pemulihan</Label><textarea rows={3} placeholder="Upaya pemulihan..." value={form.upayaPemulihan} onChange={(e) => set("upayaPemulihan", e.target.value)} className={fieldClass} /></div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Wilayah / Lokasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Kabupaten <span className="text-error-500">*</span></Label><Input placeholder="Kabupaten" value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} />{errors.kabupaten && <p className="mt-1 text-xs text-error-500">{errors.kabupaten}</p>}</div>
            <div><Label>Kecamatan <span className="text-error-500">*</span></Label><Input placeholder="Kecamatan" value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />{errors.kecamatan && <p className="mt-1 text-xs text-error-500">{errors.kecamatan}</p>}</div>
            <div><Label>Desa <span className="text-error-500">*</span></Label><Input placeholder="Desa" value={form.desa} onChange={(e) => set("desa", e.target.value)} />{errors.desa && <p className="mt-1 text-xs text-error-500">{errors.desa}</p>}</div>
          </div>
          <div><Label>Alamat Detail</Label><Input placeholder="Alamat lengkap" value={form.alamatDetail} onChange={(e) => set("alamatDetail", e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Titik Koordinat</Label><Input placeholder="-2.8833, 108.2667" value={form.titikKoordinat} onChange={(e) => set("titikKoordinat", e.target.value)} /></div>
            <div><Label>Sumber Informasi</Label><Input placeholder="Polres, Masyarakat" value={form.sumberInformasi} onChange={(e) => set("sumberInformasi", e.target.value)} /></div>
          </div>
          <div><Label>Keterangan</Label><textarea rows={2} placeholder="Keterangan tambahan..." value={form.keterangan} onChange={(e) => set("keterangan", e.target.value)} className={fieldClass} /></div>
          <div><Label>Saran & Tindak Lanjut</Label><textarea rows={3} placeholder="Saran & tindak lanjut..." value={form.saranTindakLanjut} onChange={(e) => set("saranTindakLanjut", e.target.value)} className={fieldClass} /></div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" variant="outline" disabled={saving} onClick={() => handleSave("draft")}>Simpan Draft</Button>
          <Button size="sm" disabled={saving} onClick={() => handleSave("menunggu")} className="gap-1.5"><SaveIcon /> {saving ? "Menyimpan..." : "Kirim untuk Approval"}</Button>
        </div>
      </div>
    </>
  );
}
