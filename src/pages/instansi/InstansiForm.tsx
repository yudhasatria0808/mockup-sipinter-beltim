import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
import { mockInstansi } from "./mockData";

export default function InstansiForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockInstansi.find((a) => a.id === id);
      if (found) {
        setNama(found.nama);
        setDeskripsi(found.deskripsi);
      } else {
        alert("Data tidak ditemukan");
        navigate("/instansi");
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama instansi wajib diisi";
    if (!deskripsi.trim()) errs.deskripsi = "Deskripsi wajib diisi";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit && id) {
      const idx = mockInstansi.findIndex((a) => a.id === id);
      if (idx !== -1) mockInstansi[idx] = { id, nama, deskripsi };
    } else {
      mockInstansi.push({ id: String(Date.now()), nama, deskripsi });
    }

    navigate("/instansi");
  };

  return (
    <FormPage
      title="Instansi"
      isEdit={isEdit}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/instansi")}
    >
      <FormField label="Nama Instansi" htmlFor="nama" required error={errors.nama}>
        <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama instansi"
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
            setErrors((prev) => ({ ...prev, nama: "" }));
          }}
        />
      </FormField>

      <FormField label="Deskripsi" htmlFor="deskripsi" required error={errors.deskripsi}>
        <textarea
          id="deskripsi"
          rows={4}
          placeholder="Masukkan deskripsi instansi"
          value={deskripsi}
          onChange={(e) => {
            setDeskripsi(e.target.value);
            setErrors((prev) => ({ ...prev, deskripsi: "" }));
          }}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </FormField>
    </FormPage>
  );
}
