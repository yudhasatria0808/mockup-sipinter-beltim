import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { mockLevelRisiko } from "./mockData";

export default function LevelRisikoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [warna, setWarna] = useState("#22c55e");
  const [skorMin, setSkorMin] = useState<number | "">(1);
  const [skorMax, setSkorMax] = useState<number | "">(4);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockLevelRisiko.find((a) => a.id === id);
      if (found) { setNama(found.nama); setWarna(found.warna); setSkorMin(found.skorMin); setSkorMax(found.skorMax); }
      else { alert("Data tidak ditemukan"); navigate("/risiko/level"); }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wajib diisi";
    if (!warna.trim()) errs.warna = "Warna wajib diisi";
    if (skorMin === "" || Number(skorMin) < 1) errs.skorMin = "Skor min wajib diisi (min 1)";
    if (skorMax === "" || Number(skorMax) < Number(skorMin)) errs.skorMax = "Skor max harus ≥ skor min";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const entry = { id: id || String(Date.now()), nama, warna, skorMin: Number(skorMin), skorMax: Number(skorMax) };
    if (isEdit && id) {
      const idx = mockLevelRisiko.findIndex((a) => a.id === id);
      if (idx !== -1) mockLevelRisiko[idx] = entry;
    } else {
      mockLevelRisiko.push(entry);
    }
    navigate("/risiko/level");
  };

  return (
    <>
      <PageMeta title={isEdit ? "Edit Level Risiko" : "Tambah Level Risiko"} description="Form Level Risiko" />
      <div className="max-w-xl space-y-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? "Edit Level Risiko" : "Tambah Level Risiko"}
        </h2>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama <span className="text-error-500">*</span></Label>
              <Input id="nama" type="text" placeholder="Contoh: Sangat Tinggi" value={nama}
                onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }} />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="warna">Warna <span className="text-error-500">*</span></Label>
              <div className="flex items-center gap-3">
                <input id="warna" type="color" value={warna}
                  onChange={(e) => { setWarna(e.target.value); setErrors((p) => ({ ...p, warna: "" })); }}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5 bg-white dark:bg-gray-900" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{warna}</span>
              </div>
              {errors.warna && <p className="text-xs text-error-500">{errors.warna}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="skorMin">Skor Min <span className="text-error-500">*</span></Label>
                <Input id="skorMin" type="number" placeholder="1" value={skorMin}
                  onChange={(e) => { setSkorMin(e.target.value === "" ? "" : Number(e.target.value)); setErrors((p) => ({ ...p, skorMin: "" })); }} />
                {errors.skorMin && <p className="text-xs text-error-500">{errors.skorMin}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="skorMax">Skor Max <span className="text-error-500">*</span></Label>
                <Input id="skorMax" type="number" placeholder="25" value={skorMax}
                  onChange={(e) => { setSkorMax(e.target.value === "" ? "" : Number(e.target.value)); setErrors((p) => ({ ...p, skorMax: "" })); }} />
                {errors.skorMax && <p className="text-xs text-error-500">{errors.skorMax}</p>}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="gap-1.5"><SaveIcon /> Simpan</Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/risiko/level")}>
                <CloseIcon /> Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
