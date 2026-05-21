import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
import { jenisKonflikService } from "../../services/masterDataService";

export default function JenisKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      jenisKonflikService.getById(id)
        .then((data) => { setNama(data.nama); setDeskripsi(data.deskripsi || ""); })
        .catch(() => { alert("Data tidak ditemukan"); navigate("/jenis-konflik"); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama jenis konflik wajib diisi";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { nama: nama.trim(), deskripsi: deskripsi.trim() || undefined };
      if (isEdit && id) await jenisKonflikService.update(id, payload);
      else await jenisKonflikService.create(payload);
      navigate("/jenis-konflik");
    } catch { alert("Gagal menyimpan data"); }
    finally { setSaving(false); }
  };

  return (
    <FormPage title="Jenis Konflik" isEdit={isEdit} onSubmit={handleSubmit} onCancel={() => navigate("/jenis-konflik")} saving={saving} loading={loading}>
      <FormField label="Nama Jenis Konflik" htmlFor="nama" required error={errors.nama}>
        <Input id="nama" type="text" placeholder="Masukkan nama jenis konflik" value={nama}
          onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }} />
      </FormField>
      <FormField label="Deskripsi" htmlFor="deskripsi">
        <textarea id="deskripsi" rows={4} placeholder="Masukkan deskripsi jenis konflik" value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
      </FormField>
    </FormPage>
  );
}
