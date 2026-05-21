import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
import { aspekService } from "../../services/masterDataService";

export default function AspekForm() {
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
      aspekService.getById(id)
        .then((data) => { setNama(data.nama); setDeskripsi(data.deskripsi || ""); })
        .catch(() => { alert("Data tidak ditemukan"); navigate("/aspek"); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama aspek wajib diisi";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = { nama: nama.trim(), deskripsi: deskripsi.trim() || undefined };
      if (isEdit && id) {
        await aspekService.update(id, payload);
      } else {
        await aspekService.create(payload);
      }
      navigate("/aspek");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal menyimpan data";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormPage
      title="Aspek"
      isEdit={isEdit}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/aspek")}
      saving={saving}
      loading={loading}
    >
      <FormField label="Nama Aspek" htmlFor="nama" required error={errors.nama}>
        <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama aspek"
          value={nama}
          onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="deskripsi">
        <textarea
          id="deskripsi"
          rows={4}
          placeholder="Masukkan deskripsi aspek"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </FormField>
    </FormPage>
  );
}
