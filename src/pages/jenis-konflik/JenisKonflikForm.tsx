import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
import { mockJenisKonflik } from "./mockData";

export default function JenisKonflikForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockJenisKonflik.find((item) => item.id === id);
      if (found) {
        setNama(found.nama);
        setDeskripsi(found.deskripsi);
      } else {
        alert("Data tidak ditemukan");
        navigate("/jenis-konflik");
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama jenis konflik wajib diisi";
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
      const idx = mockJenisKonflik.findIndex((item) => item.id === id);
      if (idx !== -1) mockJenisKonflik[idx] = { id, nama, deskripsi };
    } else {
      mockJenisKonflik.push({ id: String(Date.now()), nama, deskripsi });
    }

    navigate("/jenis-konflik");
  };

  return (
    <FormPage
      title="Jenis Konflik"
      isEdit={isEdit}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/jenis-konflik")}
    >
      <FormField label="Nama Jenis Konflik" htmlFor="nama" required error={errors.nama}>
        <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama jenis konflik"
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
          placeholder="Masukkan deskripsi jenis konflik"
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
