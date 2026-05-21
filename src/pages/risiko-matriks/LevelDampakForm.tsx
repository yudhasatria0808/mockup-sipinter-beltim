import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { levelDampakService } from "../../services/masterDataService";

export default function LevelDampakForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [skor, setSkor] = useState<number | "">(1);
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      levelDampakService.getById(id)
        .then((data) => { setNama(data.nama); setSkor(data.skor); setDeskripsi(data.deskripsi || ""); })
        .catch(() => { alert("Data tidak ditemukan"); navigate("/risiko/dampak"); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wajib diisi";
    if (skor === "" || skor < 1 || skor > 5) errs.skor = "Skor harus antara 1–5";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { nama: nama.trim(), skor: Number(skor), deskripsi: deskripsi.trim() || undefined };
      if (isEdit && id) await levelDampakService.update(id, payload);
      else await levelDampakService.create(payload);
      navigate("/risiko/dampak");
    } catch { alert("Gagal menyimpan data"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title={isEdit ? "Edit Level Dampak" : "Tambah Level Dampak"} description="Form Level Dampak" />
      <div className="max-w-xl space-y-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">{isEdit ? "Edit Level Dampak" : "Tambah Level Dampak"}</h2>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="skor">Skor (1–5) <span className="text-error-500">*</span></Label>
              <Input id="skor" type="number" placeholder="1–5" value={skor}
                onChange={(e) => { setSkor(e.target.value === "" ? "" : Number(e.target.value)); setErrors((p) => ({ ...p, skor: "" })); }} />
              {errors.skor && <p className="text-xs text-error-500">{errors.skor}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama <span className="text-error-500">*</span></Label>
              <Input id="nama" type="text" placeholder="Contoh: Katastrofik" value={nama}
                onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }} />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea id="deskripsi" rows={3} placeholder="Deskripsi level dampak" value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="gap-1.5" disabled={saving}><SaveIcon /> {saving ? "Menyimpan..." : "Simpan"}</Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/risiko/dampak")}><CloseIcon /> Batal</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
