import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { mockLevelKemungkinan } from "./mockData";

export default function LevelKemungkinanForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [skor, setSkor] = useState<number | "">(1);
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockLevelKemungkinan.find((a) => a.id === id);
      if (found) { setNama(found.nama); setSkor(found.skor); setDeskripsi(found.deskripsi); }
      else { alert("Data tidak ditemukan"); navigate("/risiko/kemungkinan"); }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wajib diisi";
    if (skor === "" || skor < 1 || skor > 5) errs.skor = "Skor harus antara 1–5";
    if (!deskripsi.trim()) errs.deskripsi = "Deskripsi wajib diisi";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (isEdit && id) {
      const idx = mockLevelKemungkinan.findIndex((a) => a.id === id);
      if (idx !== -1) mockLevelKemungkinan[idx] = { id, nama, skor: Number(skor), deskripsi };
    } else {
      mockLevelKemungkinan.push({ id: String(Date.now()), nama, skor: Number(skor), deskripsi });
    }
    navigate("/risiko/kemungkinan");
  };

  return (
    <>
      <PageMeta title={isEdit ? "Edit Level Kemungkinan" : "Tambah Level Kemungkinan"} description="Form Level Kemungkinan" />
      <div className="max-w-xl space-y-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? "Edit Level Kemungkinan" : "Tambah Level Kemungkinan"}
        </h2>
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
              <Input id="nama" type="text" placeholder="Contoh: Sangat Jarang" value={nama}
                onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }} />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi">Deskripsi <span className="text-error-500">*</span></Label>
              <textarea id="deskripsi" rows={3} placeholder="Deskripsi level kemungkinan" value={deskripsi}
                onChange={(e) => { setDeskripsi(e.target.value); setErrors((p) => ({ ...p, deskripsi: "" })); }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              {errors.deskripsi && <p className="text-xs text-error-500">{errors.deskripsi}</p>}
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="gap-1.5"><SaveIcon /> Simpan</Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/risiko/kemungkinan")}>
                <CloseIcon /> Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
